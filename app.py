import os
import random
from flask import Flask, render_template, jsonify
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
        return render_template('index.html', rarity_tiers=RARITY_TIERS)
    except Exception as e:
        logger.error(f"Error rendering index: {e}")
        return "An error occurred", 500

@app.route('/roll')
def roll():
    try:
        roll_number = random.randint(1, 100000)
        result = "Uncommon"  # Default result

        for rarity, info in RARITY_TIERS.items():
            if roll_number <= 100000 / info["chance"]:
                result = rarity
                break

        response = {
            "result": result,
            "color": RARITY_TIERS[result]["color"],
            "roll_number": roll_number
        }
        logger.debug(f"Roll result: {response}")
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error during roll: {e}")
        return jsonify({"error": "An error occurred during roll"}), 500

if __name__ == '__main__':
    logger.info(f"Starting server on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=True)