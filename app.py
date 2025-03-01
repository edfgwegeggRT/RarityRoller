import os
import random
from flask import Flask, render_template, jsonify, session, make_response, request
import logging
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key")

RARITY_TIERS = {
    "Secret": {"chance": 1000000, "color": "#FFD700", "value": 1000},  # Gold
    "Ancient": {"chance": 100000, "color": "#4B0082", "value": 500},  # Indigo
    "Jack Attack": {"chance": 50000, "color": "#008000", "value": 250},  # Green
    "Mythical": {"chance": 10000, "color": "#FF0000", "value": 100},  # Red
    "Divine": {"chance": 5000, "color": "#E6E6FA", "value": 50},  # Lavender
    "Legendary": {"chance": 1000, "color": "#FFA500", "value": 25},  # Orange
    "Epic": {"chance": 100, "color": "#800080", "value": 10},  # Purple
    "Rare": {"chance": 20, "color": "#0000FF", "value": 5},  # Blue
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

        return render_template('index.html', 
                             rarity_tiers=RARITY_TIERS, 
                             roll_count=session['roll_count'],
                             luck_bonus=calculate_luck(session['roll_count']),
                             can_auto_roll=session['roll_count'] >= 50,
                             inventory=session['inventory'],
                             coins=session['coins'],
                             purchased_luck=session['purchased_luck'])
    except Exception as e:
        logger.error(f"Error rendering index: {e}")
        return "An error occurred", 500

def calculate_luck(roll_count):
    base_luck = 1 + (roll_count // 100)  # Base luck from rolls
    purchased_luck = session.get('purchased_luck', 0)  # Luck from shop

    if session.get('super_luck_until'):
        # Check if super luck is still active
        if datetime.now() < datetime.fromisoformat(session['super_luck_until']):
            return (base_luck + purchased_luck) * 100  # Apply 100x multiplier
        else:
            # Clear expired super luck
            session.pop('super_luck_until', None)
    return base_luck + purchased_luck

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
        if session['coins'] >= 50:
            session['coins'] -= 50
            session['purchased_luck'] += 1
            session.modified = True
            return jsonify({
                "success": True,
                "coins": session['coins'],
                "purchased_luck": session['purchased_luck'],
                "total_luck": calculate_luck(session['roll_count'])
            })
        return jsonify({"error": "Not enough coins"}), 400
    except Exception as e:
        logger.error(f"Error buying luck: {e}")
        return jsonify({"error": "Failed to buy luck"}), 500

@app.route('/roll')
def roll():
    try:
        if 'roll_count' not in session:
            session['roll_count'] = 0
        if 'inventory' not in session:
            session['inventory'] = []

        # Check inventory size
        if len(session['inventory']) >= 10:
            return jsonify({"error": "Inventory full! Sell items to make space."}), 400

        session['roll_count'] += 1
        luck = calculate_luck(session['roll_count'])

        roll_number = random.randint(1, 100000)
        result = "Uncommon"  # Default result

        # Apply luck to improve chances
        for rarity, info in RARITY_TIERS.items():
            if roll_number <= (100000 / info["chance"]) * luck:
                result = rarity

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

                break

        # Add to inventory
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
            "coins": session['coins']
        }
        logger.debug(f"Roll result: {response}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error during roll: {e}")
        return jsonify({"error": "An error occurred during roll"}), 500

@app.route('/activate-super-luck')
def activate_super_luck():
    try:
        response = make_response(jsonify({"success": True}))

        # Check if super luck was already used
        if request.cookies.get('used_super_luck'):
            return jsonify({"error": "Super luck already used"}), 400

        # Set super luck expiration
        session['super_luck_until'] = (datetime.now() + timedelta(seconds=10)).isoformat()

        # Set cookie to track usage
        response.set_cookie('used_super_luck', 'true', max_age=365*24*60*60)  # 1 year expiry
        return response
    except Exception as e:
        logger.error(f"Error activating super luck: {e}")
        return jsonify({"error": "Failed to activate super luck"}), 500

@app.route('/reset-cookies')
def reset_cookies():
    try:
        response = make_response(jsonify({"success": True}))
        response.delete_cookie('used_super_luck')
        return response
    except Exception as e:
        logger.error(f"Error resetting cookies: {e}")
        return jsonify({"error": "Failed to reset cookies"}), 500

if __name__ == '__main__':
    logger.info(f"Starting server on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=True)