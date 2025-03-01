import os
import random
from flask import Flask, render_template, jsonify, session
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "default_secret_key")

RARITY_TIERS = {
    "Mythical": {"chance": 100000, "color": "#FF0000"},
    "Legendary": {"chance": 1000, "color": "#FFA500"},
    "Epic": {"chance": 100, "color": "#800080"},
    "Rare": {"chance": 20, "color": "#0000FF"},
    "Good": {"chance": 5, "color": "#008000"},
    "Uncommon": {"chance": 2, "color": "#808080"},
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
    return 1 + (roll_count // 100)  # +1 luck every 100 rolls

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