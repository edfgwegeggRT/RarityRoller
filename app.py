import os
import random
from flask import Flask, render_template, jsonify, session, make_response, request
import logging
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Generate a secure random secret key
app.secret_key = os.urandom(24)

RARITY_TIERS = {
    "LEBRON": {"chance": 50000000, "color": "#800080", "value": 10000000},  # Purple color, highest value
    "Hyperpigmentation": {"chance": 10000000, "color": "#D2B48C", "value": 5000000},  # Tan color
    "Hax": {"chance": 2500000, "color": "#008800", "value": 1000000},  # Dark green
    "Secret": {"chance": 1000000, "color": "#FFD700", "value": 500000},  # Gold
    "Special": {"chance": 500000, "color": "#87CEEB", "value": 250000},  # Chill blue
    "Ancient": {"chance": 100000, "color": "#4B0082", "value": 50000},  # Indigo
    "Jack Attack": {"chance": 50000, "color": "#008000", "value": 25000},  # Green
    "Mythical": {"chance": 10000, "color": "#FF0000", "value": 5000},  # Red
    "Divine": {"chance": 5000, "color": "#E6E6FA", "value": 2500},  # Lavender
    "Legendary": {"chance": 1000, "color": "#FFA500", "value": 500},  # Orange
    "Epic": {"chance": 100, "color": "#800080", "value": 50},  # Purple
    "Rare": {"chance": 20, "color": "#0000FF", "value": 10},  # Blue
    "Good": {"chance": 5, "color": "#008000", "value": 2},  # Green
    "Uncommon": {"chance": 2, "color": "#808080", "value": 1},  # Gray
}

@app.route('/')
def index():
    try:
        if 'roll_count' not in session:
            session['roll_count'] = 0
        if 'inventory' not in session:
            session['inventory'] = []
        if 'coins' not in session:
            session['coins'] = 0
        if 'purchased_luck' not in session:
            session['purchased_luck'] = 0
        if 'permanent_luck' not in session:
            session['permanent_luck'] = 0
        if 'inventory_upgrade' not in session:
            session['inventory_upgrade'] = 0
        if 'auto_sell_settings' not in session:
            session['auto_sell_settings'] = {rarity: False for rarity in RARITY_TIERS}
            
        # Check daily reward status
        can_claim_daily = True
        time_until_next = "Available now!"
        
        if 'last_daily_claim' in session:
            last_claim = datetime.fromisoformat(session['last_daily_claim'])
            now = datetime.now()
            can_claim_daily = (now - last_claim) > timedelta(hours=24)
            
            if not can_claim_daily:
                next_claim = last_claim + timedelta(hours=24)
                time_left = next_claim - now
                hours_left = int(time_left.total_seconds() // 3600)
                minutes_left = int((time_left.total_seconds() % 3600) // 60)
                time_until_next = f"{hours_left}h {minutes_left}m"

        return render_template('index.html', 
                             rarity_tiers=RARITY_TIERS, 
                             roll_count=session['roll_count'],
                             luck_bonus=calculate_luck(session['roll_count']),
                             can_auto_roll=session['roll_count'] >= 50,
                             inventory=session['inventory'],
                             coins=session['coins'],
                             purchased_luck=session['purchased_luck'],
                             inventory_capacity=3 + session.get('inventory_upgrade', 0),
                             inventory_upgrade=session.get('inventory_upgrade', 0),
                             auto_sell_settings=session.get('auto_sell_settings', {}),
                             can_claim_daily=can_claim_daily,
                             time_until_next=time_until_next)
    except Exception as e:
        logger.error(f"Error rendering index: {e}")
        return "An error occurred", 500

def calculate_luck(roll_count):
    # If luck is toggled off, return 1
    if not session.get('luck_active', True):
        return 1

    base_luck = 1 + (roll_count // 100)  # Base luck from rolls
    purchased_luck = session.get('purchased_luck', 0)  # Luck from shop
    permanent_luck = session.get('permanent_luck', 0)  # Permanent luck from Divine secret

    total_base_luck = base_luck + purchased_luck + permanent_luck
    
    # Check for one-time rare luck boost (x2500)
    if session.get('rare_luck_boost'):
        # Use the boost for this roll, then remove it
        boost = session.get('rare_luck_boost')
        session.pop('rare_luck_boost', None)
        session.modified = True
        return total_base_luck * boost

    if session.get('super_luck_until'):
        # Check if super luck is still active
        if datetime.now() < datetime.fromisoformat(session['super_luck_until']):
            if session.get('epic_multiplier2'):
                multiplier = 300  # Use 300x for Epic2
            elif session.get('epic_multiplier'):
                multiplier = 250  # Use 250x for Epic
            else:
                multiplier = 100  # Use 100x for others
            return total_base_luck * multiplier
        else:
            # Clear expired super luck and multiplier flags
            session.pop('super_luck_until', None)
            session.pop('epic_multiplier', None)
            session.pop('epic_multiplier2', None)
    return total_base_luck

@app.route('/sell/<rarity>')
def sell_item(rarity):
    try:
        if rarity in session['inventory']:
            session['inventory'].remove(rarity)
            value = RARITY_TIERS[rarity]['value']
            session['coins'] += value
            session.modified = True
            return jsonify({
                "success": True,
                "coins": session['coins'],
                "inventory": session['inventory'],
                "value": value
            })
        return jsonify({"error": "Item not in inventory"}), 400
    except Exception as e:
        logger.error(f"Error selling item: {e}")
        return jsonify({"error": "Failed to sell item"}), 500

@app.route('/buy-luck')
def buy_luck():
    try:
        # Calculate the cost based on current luck level
        # Level 1: 50, Level 2: 125, Level 3: 312.5, etc.
        current_level = session.get('purchased_luck', 0)
        cost = round(50 * (2.5 ** current_level))

        if session['coins'] >= cost:
            session['coins'] -= cost
            session['purchased_luck'] += 1
            session.modified = True
            return jsonify({
                "success": True,
                "coins": session['coins'],
                "purchased_luck": session['purchased_luck'],
                "total_luck": calculate_luck(session['roll_count']),
                "next_cost": round(50 * (2.5 ** session['purchased_luck']))
            })
        return jsonify({"error": f"Not enough coins! Luck level {current_level + 1} costs {cost} coins"}), 400
    except Exception as e:
        logger.error(f"Error buying luck: {e}")
        return jsonify({"error": "Failed to buy luck"}), 500

@app.route('/buy-max-luck')
def buy_max_luck():
    try:
        purchased_levels = 0
        total_spent = 0

        while True:
            current_level = session.get('purchased_luck', 0)
            cost = round(50 * (2.5 ** current_level))

            if session['coins'] >= cost:
                session['coins'] -= cost
                session['purchased_luck'] += 1
                purchased_levels += 1
                total_spent += cost
            else:
                break

        if purchased_levels == 0:
            return jsonify({"error": "Not enough coins to buy any luck"}), 400

        session.modified = True
        next_cost = round(50 * (2.5 ** session['purchased_luck']))
        return jsonify({
            "success": True,
            "levels_purchased": purchased_levels,
            "total_spent": total_spent,
            "coins": session['coins'],
            "purchased_luck": session['purchased_luck'],
            "total_luck": calculate_luck(session['roll_count']),
            "next_cost": next_cost
        })
    except Exception as e:
        logger.error(f"Error buying max luck: {e}")
        return jsonify({"error": "Failed to buy max luck"}), 500

@app.route('/toggle-luck')
def toggle_luck():
    try:
        # If luck_active doesn't exist, initialize it to True
        if 'luck_active' not in session:
            session['luck_active'] = True
        
        # Toggle the state
        session['luck_active'] = not session.get('luck_active')
        session.modified = True
        
        return jsonify({
            "success": True,
            "luck_active": session['luck_active'],
            "total_luck": calculate_luck(session['roll_count']) if session['luck_active'] else 1
        })
    except Exception as e:
        logger.error(f"Error toggling luck: {e}")
        return jsonify({"error": "Failed to toggle luck"}), 500

@app.route('/buy-storage')
def buy_storage():
    try:
        # Calculate the cost based on current storage level
        # Level 1: 100, Level 2: 300, Level 3: 900, etc.
        current_level = session.get('inventory_upgrade', 0)
        cost = 100 * (3 ** current_level)
        
        if session['coins'] >= cost:
            session['coins'] -= cost
            session['inventory_upgrade'] += 1
            session.modified = True
            return jsonify({
                "success": True,
                "coins": session['coins'],
                "inventory_upgrade": session['inventory_upgrade'],
                "inventory_capacity": 20 + session['inventory_upgrade'],
                "next_cost": 100 * (3 ** session['inventory_upgrade'])
            })
        return jsonify({"error": f"Not enough coins! Storage upgrade costs {cost} coins"}), 400
    except Exception as e:
        logger.error(f"Error buying storage: {e}")
        return jsonify({"error": "Failed to buy storage"}), 500

@app.route('/toggle-auto-sell/<rarity>')
def toggle_auto_sell(rarity):
    try:
        if rarity not in RARITY_TIERS:
            return jsonify({"error": "Invalid rarity"}), 400
            
        # Initialize auto_sell_settings if it doesn't exist
        if 'auto_sell_settings' not in session:
            session['auto_sell_settings'] = {r: False for r in RARITY_TIERS}
        
        # Toggle the setting for this rarity
        session['auto_sell_settings'][rarity] = not session['auto_sell_settings'].get(rarity, False)
        session.modified = True
        
        return jsonify({
            "success": True,
            "rarity": rarity,
            "auto_sell_enabled": session['auto_sell_settings'][rarity]
        })
    except Exception as e:
        logger.error(f"Error toggling auto-sell for {rarity}: {e}")
        return jsonify({"error": f"Failed to toggle auto-sell for {rarity}"}), 500

@app.route('/roll')
def roll():
    try:
        if 'roll_count' not in session:
            session['roll_count'] = 0
        if 'inventory' not in session:
            session['inventory'] = []
        if 'auto_sell_settings' not in session:
            session['auto_sell_settings'] = {rarity: False for rarity in RARITY_TIERS}

        # Check inventory size with upgraded capacity
        inventory_capacity = 3 + session.get('inventory_upgrade', 0)
        if len(session['inventory']) >= inventory_capacity:
            return jsonify({"error": "Inventory full! Sell items to make space."}), 400

        session['roll_count'] += 1
        luck = calculate_luck(session['roll_count'])

        roll_number = random.randint(1, 100000)
        result = "Uncommon"  # Default result

        # Apply luck to improve chances
        for rarity, info in RARITY_TIERS.items():
            if roll_number <= (100000 / info["chance"]) * luck:
                result = rarity
                break

        # Check if this rarity should be auto-sold
        auto_sold = False
        auto_sell_value = 0
        if session['auto_sell_settings'].get(result, False):
            auto_sold = True
            auto_sell_value = RARITY_TIERS[result]['value']
            session['coins'] += auto_sell_value
        else:
            # Add to inventory only if not auto-sold
            session['inventory'].append(result)
            

        session.modified = True

        response = {
            "result": result,
            "color": RARITY_TIERS[result]["color"],
            "roll_number": roll_number,
            "roll_count": session['roll_count'],
            "luck_bonus": luck,
            "can_auto_roll": session['roll_count'] >= 50,
            "inventory": session['inventory'],
            "coins": session['coins'],
            "auto_sold": auto_sold,
            "auto_sell_value": auto_sell_value
        }
        logger.debug(f"Roll result: {response}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error during roll: {e}")
        return jsonify({"error": "An error occurred during roll"}), 500

@app.route('/sell-all')
def sell_all():
    try:
        if not session['inventory']:
            return jsonify({"error": "No items in inventory"}), 400

        total_value = 0
        for rarity in session['inventory']:
            total_value += RARITY_TIERS[rarity]['value']

        # Calculate bonus coins: 1 coin for every 2 rarities
        rarity_bonus = len(session['inventory']) // 2
        total_value += rarity_bonus

        session['coins'] += total_value
        session['inventory'] = []
        session.modified = True

        return jsonify({
            "success": True,
            "coins": session['coins'],
            "inventory": session['inventory'],
            "value": total_value
        })
    except Exception as e:
        logger.error(f"Error selling all items: {e}")
        return jsonify({"error": "Failed to sell all items"}), 500

@app.route('/activate-super-luck/<button_type>')
def activate_super_luck(button_type):
    try:
        response = make_response(jsonify({"success": True}))

        # Check if this specific button was already used
        if request.cookies.get(f'used_super_luck_{button_type}'):
            return jsonify({"error": f"Super luck for {button_type} already used"}), 400

        # Set super luck expiration
        session['super_luck_until'] = (datetime.now() + timedelta(seconds=10)).isoformat()

        # Set epic multiplier flags based on button type
        if button_type == 'epic':
            session['epic_multiplier'] = True
        elif button_type == 'epic2':
            session['epic_multiplier2'] = True
            # For epic2, extend duration to 15 seconds
            session['super_luck_until'] = (datetime.now() + timedelta(seconds=15)).isoformat()

        session.modified = True

        # Set cookie to track usage for this specific button
        response.set_cookie(f'used_super_luck_{button_type}', 'true', max_age=365*24*60*60)  # 1 year expiry
        return response
    except Exception as e:
        logger.error(f"Error activating super luck: {e}")
        return jsonify({"error": "Failed to activate super luck"}), 500

@app.route('/activate-divine-luck')
def activate_divine_luck():
    try:
        response = make_response(jsonify({"success": True}))

        # Check if divine luck was already used
        if request.cookies.get('used_divine_luck'):
            return jsonify({"error": "Divine luck already used"}), 400

        # Add permanent luck bonus
        session['permanent_luck'] = session.get('permanent_luck', 0) + 50
        session.modified = True

        # Set cookie to track usage
        response.set_cookie('used_divine_luck', 'true', max_age=365*24*60*60)  # 1 year expiry
        return response
    except Exception as e:
        logger.error(f"Error activating divine luck: {e}")
        return jsonify({"error": "Failed to activate divine luck"}), 500
        
@app.route('/activate-divine-luck2')
def activate_divine_luck2():
    try:
        response = make_response(jsonify({"success": True}))

        # Check if divine luck 2 was already used
        if request.cookies.get('used_divine_luck2'):
            return jsonify({"error": "Divine luck 2 already used"}), 400

        # Add permanent luck bonus (75 for the second divine button)
        session['permanent_luck'] = session.get('permanent_luck', 0) + 75
        session.modified = True

        # Set cookie to track usage
        response.set_cookie('used_divine_luck2', 'true', max_age=365*24*60*60)  # 1 year expiry
        return response
    except Exception as e:
        logger.error(f"Error activating divine luck 2: {e}")
        return jsonify({"error": "Failed to activate divine luck 2"}), 500
        
@app.route('/activate-rare-luck')
def activate_rare_luck():
    try:
        response = make_response(jsonify({"success": True}))

        # Check if rare luck was already used
        if request.cookies.get('used_rare_luck'):
            return jsonify({"error": "Rare luck already used"}), 400

        # Set rare luck bonus for one roll
        session['rare_luck_boost'] = 2500
        session.modified = True

        # Set cookie to track usage
        response.set_cookie('used_rare_luck', 'true', max_age=365*24*60*60)  # 1 year expiry
        return response
    except Exception as e:
        logger.error(f"Error activating rare luck: {e}")
        return jsonify({"error": "Failed to activate rare luck"}), 500

@app.route('/activate-legendary-luck')
def activate_legendary_luck():
    try:
        response = make_response(jsonify({"success": True}))

        # Check if legendary luck was already used
        if request.cookies.get('used_legendary_luck'):
            return jsonify({"error": "Legendary luck already used"}), 400

        # Set legendary luck bonus for one roll
        session['rare_luck_boost'] = 10000
        session.modified = True

        # Set cookie to track usage
        response.set_cookie('used_legendary_luck', 'true', max_age=365*24*60*60)  # 1 year expiry
        return response
    except Exception as e:
        logger.error(f"Error activating legendary luck: {e}")
        return jsonify({"error": "Failed to activate legendary luck"}), 500

@app.route('/activate-legendary-luck2')
def activate_legendary_luck2():
    try:
        response = make_response(jsonify({"success": True}))

        # Check if legendary luck 2 was already used
        if request.cookies.get('used_legendary_luck2'):
            return jsonify({"error": "Legendary luck 2 already used"}), 400

        # Set legendary luck boost for one roll (15000 for second legendary button)
        session['rare_luck_boost'] = 15000
        session.modified = True

        # Set cookie to track usage
        response.set_cookie('used_legendary_luck2', 'true', max_age=365*24*60*60)  # 1 year expiry
        return response
    except Exception as e:
        logger.error(f"Error activating legendary luck 2: {e}")
        return jsonify({"error": "Failed to activate legendary luck 2"}), 500

@app.route('/activate-mythical-luck')
def activate_mythical_luck():
    try:
        response = make_response(jsonify({"success": True}))

        # Check if mythical luck was already used
        if request.cookies.get('used_mythical_luck'):
            return jsonify({"error": "Mythical luck already used"}), 400

        # Set mythical luck boost for one roll (500000 multiplier)
        session['rare_luck_boost'] = 500000
        session.modified = True

        # Set cookie to track usage
        response.set_cookie('used_mythical_luck', 'true', max_age=365*24*60*60)  # 1 year expiry
        return response
    except Exception as e:
        logger.error(f"Error activating mythical luck: {e}")
        return jsonify({"error": "Failed to activate mythical luck"}), 500


@app.route('/reset-cookies')
def reset_cookies():
    try:
        response = make_response(jsonify({"success": True}))
        # Reset all super luck cookies
        response.delete_cookie('used_super_luck_uncommon')
        response.delete_cookie('used_super_luck_good')
        response.delete_cookie('used_super_luck_epic')
        response.delete_cookie('used_divine_luck')
        response.delete_cookie('used_divine_luck2')
        response.delete_cookie('used_rare_luck')
        response.delete_cookie('used_legendary_luck')
        response.delete_cookie('used_legendary_luck2')
        response.delete_cookie('used_mythical_luck')
        return response
    except Exception as e:
        logger.error(f"Error resetting cookies: {e}")
        return jsonify({"error": "Failed to reset cookies"}), 500

@app.route('/reset-all')
def reset_all():
    try:
        # Reset the player's stats to exact values
        session['coins'] = 0
        # Set luck to exactly 0
        session['purchased_luck'] = 0
        session['permanent_luck'] = 0 #added to reset permanent luck
        session['inventory'] = []
        session['inventory_upgrade'] = 0
        session.modified = True
        logger.info(f"Reset stats - luck set to exactly 0")
        return jsonify({
            "success": True,
            "message": "All stats reset to default values: coins=0, luck=0, inventory capacity=20"
        })
    except Exception as e:
        logger.error(f"Error resetting all stats: {e}")
        return jsonify({"error": "Failed to reset all stats"}), 500
        
@app.route('/check-daily-reward')
def check_daily_reward():
    try:
        # If last_daily_claim doesn't exist or it's older than 24 hours
        if 'last_daily_claim' not in session:
            can_claim = True
        else:
            last_claim = datetime.fromisoformat(session['last_daily_claim'])
            now = datetime.now()
            # Check if 24 hours have passed since last claim
            can_claim = (now - last_claim) > timedelta(hours=24)
            
        # Calculate time until next reward if can't claim
        if not can_claim:
            last_claim = datetime.fromisoformat(session['last_daily_claim'])
            next_claim = last_claim + timedelta(hours=24)
            time_left = next_claim - datetime.now()
            hours_left = int(time_left.total_seconds() // 3600)
            minutes_left = int((time_left.total_seconds() % 3600) // 60)
            time_str = f"{hours_left}h {minutes_left}m"
        else:
            time_str = "Available now!"

        return jsonify({
            "can_claim": can_claim,
            "time_until_next": time_str
        })
    except Exception as e:
        logger.error(f"Error checking daily reward: {e}")
        return jsonify({"error": "Failed to check daily reward status"}), 500

@app.route('/claim-daily-reward')
def claim_daily_reward():
    try:
        # Check if user already claimed today
        if 'last_daily_claim' in session:
            last_claim = datetime.fromisoformat(session['last_daily_claim'])
            now = datetime.now()
            if (now - last_claim) < timedelta(hours=24):
                return jsonify({
                    "error": "You've already claimed your daily reward today!"
                }), 400

        # If inventory is full
        inventory_capacity = 3 + session.get('inventory_upgrade', 0)
        if len(session.get('inventory', [])) >= inventory_capacity:
            return jsonify({"error": "Inventory full! Sell items to make space."}), 400

        # Set today as last claim date
        session['last_daily_claim'] = datetime.now().isoformat()
        
        # Apply roll with 1000x luck
        if 'roll_count' not in session:
            session['roll_count'] = 0
        if 'inventory' not in session:
            session['inventory'] = []
            
        session['roll_count'] += 1
        # Use base luck multiplied by 1000
        base_luck = calculate_luck(session['roll_count'])
        daily_luck = base_luck * 1000
        
        roll_number = random.randint(1, 100000)
        result = "Uncommon"  # Default result

        # Apply luck to improve chances
        for rarity, info in RARITY_TIERS.items():
            if roll_number <= (100000 / info["chance"]) * daily_luck:
                result = rarity
                break

        # Add to inventory
        session['inventory'].append(result)
        session.modified = True

        return jsonify({
            "success": True,
            "result": result,
            "color": RARITY_TIERS[result]["color"],
            "roll_number": roll_number,
            "luck_applied": daily_luck,
            "inventory": session['inventory']
        })
    except Exception as e:
        logger.error(f"Error claiming daily reward: {e}")
        return jsonify({"error": "Failed to claim daily reward"}), 500

if __name__ == '__main__':
    logger.info(f"Starting server on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=True)