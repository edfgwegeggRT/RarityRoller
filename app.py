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
    "Secret": {"chance": 1000000, "color": "#FFD700"},  # Gold
    "Ancient": {"chance": 100000, "color": "#4B0082"},  # Indigo
    "Jack Attack": {"chance": 50000, "color": "#008000"},  # Green
    "Mythical": {"chance": 10000, "color": "#FF0000"},  # Red
    "Divine": {"chance": 5000, "color": "#E6E6FA"},  # Lavender
    "Legendary": {"chance": 1000, "color": "#FFA500"},  # Orange
    "Epic": {"chance": 100, "color": "#800080"},  # Purple
    "Rare": {"chance": 20, "color": "#0000FF"},  # Blue
    "Good": {"chance": 5, "color": "#008000"},  # Green
    "Uncommon": {"chance": 2, "color": "#808080"},  # Gray
}

@app.route('/')
def index():
    try:
        if 'roll_count' not in session:
            session['roll_count'] = 0
        return render_template('index.html', 
                             rarity_tiers=RARITY_TIERS, 
                             roll_count=session['roll_count'],
                             luck_bonus=calculate_luck(session['roll_count']),
                             can_auto_roll=session['roll_count'] >= 50)
    except Exception as e:
        logger.error(f"Error rendering index: {e}")
        return "An error occurred", 500

def calculate_luck(roll_count):
    base_luck = 1 + (roll_count // 100)  # Base luck from rolls
    if session.get('super_luck_until'):
        # Check if super luck is still active
        if datetime.now() < datetime.fromisoformat(session['super_luck_until']):
            return base_luck * 100  # Apply 100x multiplier
        else:
            # Clear expired super luck
            session.pop('super_luck_until', None)
    return base_luck

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

@app.route('/roll')
def roll():
    try:
        if 'roll_count' not in session:
            session['roll_count'] = 0

        session['roll_count'] += 1
        luck = calculate_luck(session['roll_count'])

        roll_number = random.randint(1, 100000)
        result = "Uncommon"  # Default result

        # Apply luck to improve chances
        for rarity, info in RARITY_TIERS.items():
            if roll_number <= (100000 / info["chance"]) * luck:
                result = rarity
                break

        response = {
            "result": result,
            "color": RARITY_TIERS[result]["color"],
            "roll_number": roll_number,
            "roll_count": session['roll_count'],
            "luck_bonus": luck,
            "can_auto_roll": session['roll_count'] >= 50
        }
        logger.debug(f"Roll result: {response}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error during roll: {e}")
        return jsonify({"error": "An error occurred during roll"}), 500

if __name__ == '__main__':
    logger.info(f"Starting server on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=True)