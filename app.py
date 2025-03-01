import os
import random
from flask import Flask, render_template, jsonify

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
    return render_template('index.html', rarity_tiers=RARITY_TIERS)

@app.route('/roll')
def roll():
    roll_number = random.randint(1, 100000)
    result = "Uncommon"  # Default result
    
    for rarity, info in RARITY_TIERS.items():
        if roll_number <= 100000 / info["chance"]:
            result = rarity
            break
    
    return jsonify({
        "result": result,
        "color": RARITY_TIERS[result]["color"],
        "roll_number": roll_number
    })
