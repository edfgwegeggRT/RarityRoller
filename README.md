# Rarity Roller Game

A dynamic web-based rarity roller game that offers an immersive collecting experience with strategic economic mechanics and engaging gameplay.

## Features

- **Multiple Rarity Tiers**: From common "Uncommon" to ultra-rare "LEBRON" and "Hyperpigmentation" items
- **Dynamic Inventory Management**: Collect and sell items with expandable storage capacity
- **Coin-based Economy**: Earn coins by selling items to purchase upgrades
- **Luck Enhancement System**: Increase your chances of finding rare items
- **Secret Buttons**: Discover hidden buttons for strategic luck multipliers
- **Daily Rewards**: Claim daily rewards with enhanced luck
- **Auto-Sell Feature**: Configure automatic selling for specified rarity tiers

## How to Play

1. Click the "Roll" button to get a random item
2. Items are added to your inventory (if there's space)
3. Sell items to earn coins
4. Use coins to purchase luck enhancements and storage upgrades
5. Unlock the Auto Roll feature at 50 rolls
6. Discover secret buttons for special luck bonuses

## Rarity Tiers

The game features multiple rarity tiers, each with different probabilities and values:

| Rarity | Base Chance | Value |
|--------|-------------|-------|
| Uncommon | 1 in 2 | 1 |
| Good | 1 in 5 | 2 |
| Rare | 1 in 20 | 10 |
| Epic | 1 in 100 | 50 |
| Legendary | 1 in 1,000 | 500 |
| Divine | 1 in 5,000 | 2,500 |
| Mythical | 1 in 10,000 | 5,000 |
| Jack Attack | 1 in 50,000 | 25,000 |
| Ancient | 1 in 100,000 | 50,000 |
| Special | 1 in 500,000 | 250,000 |
| Secret | 1 in 1,000,000 | 500,000 |
| Hax | 1 in 2,500,000 | 1,000,000 |
| Hyperpigmentation | 1 in 10,000,000 | 5,000,000 |
| LEBRON | 1 in 50,000,000 | 10,000,000 |

## Running the Game

This repository contains two versions of the game:

1. **Static Version**: Can be run directly in a browser without a server (index.html)
2. **Dynamic Version**: Requires a Flask server (app.py)

### Running the Static Version

Simply open `index.html` in a web browser to play the static version.

### Running the Dynamic Version

To run the full dynamic version with server-side features:

1. Install required dependencies:
   ```
   pip install flask flask-sqlalchemy gunicorn psycopg2-binary
   ```

2. Run the Flask application:
   ```
   python main.py
   ```

3. Open a browser and navigate to `http://localhost:5000`

## Technologies Used

- HTML, CSS, JavaScript
- Bootstrap for styling
- Flask (Python) for the server-side version
- Font Awesome for icons

## License

[MIT License](LICENSE)