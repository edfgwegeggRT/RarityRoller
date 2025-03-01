document.addEventListener('DOMContentLoaded', function() {
    const rollButton = document.getElementById('roll-button');
    const autoRollButton = document.getElementById('auto-roll-button');
    const rarityText = document.getElementById('rarity-text');
    const spinner = document.getElementById('spinner');
    const rollCountDisplay = document.getElementById('roll-count');
    const luckBonusDisplay = document.getElementById('luck-bonus');
    const secretButton = document.getElementById('secret-button');
    const inventoryContainer = document.getElementById('inventory-items');
    const inventoryCountDisplay = document.getElementById('inventory-count');
    const coinCountDisplay = document.getElementById('coin-count');
    const buyLuckButton = document.getElementById('buy-luck-button');
    const sellAllButton = document.getElementById('sell-all-button');

    let isAutoRolling = false;
    let autoRollInterval;
    
    // Sell all functionality
    sellAllButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/sell-all');
            const data = await response.json();

            if (response.ok) {
                // Update displays
                coinCountDisplay.textContent = data.coins;
                updateInventoryDisplay(data.inventory);

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Sold all items for ${data.value} coins!`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Failed to sell all items';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error selling all items:', error);
        }
    });

    // Secret button functionality
    if (secretButton) {
        secretButton.addEventListener('click', async function() {
            try {
                const response = await fetch('/activate-super-luck');
                const data = await response.json();

                if (response.ok) {
                    // Disable the button after successful use
                    secretButton.disabled = true;
                    secretButton.style.display = 'none';

                    // Show temporary notification
                    const notification = document.createElement('div');
                    notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = '🌟 Super luck activated for 10 seconds! 🌟';
                    document.body.appendChild(notification);

                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                } else {
                    console.error('Failed to activate super luck:', data.error);
                }
            } catch (error) {
                console.error('Error activating super luck:', error);
            }
        });
    }

    function updateInventoryDisplay(inventory) {
        inventoryContainer.innerHTML = '';
        inventoryCountDisplay.textContent = inventory.length;

        inventory.forEach(rarity => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.dataset.rarity = rarity;

            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.style.backgroundColor = rarityColors[rarity];
            badge.textContent = rarity;

            const sellButton = document.createElement('button');
            sellButton.className = 'btn btn-sm btn-outline-warning sell-button';
            sellButton.dataset.rarity = rarity;
            sellButton.innerHTML = `Sell (${rarityValues[rarity]} <i class="fas fa-coins"></i>)`;

            sellButton.addEventListener('click', () => sellItem(rarity));

            itemDiv.appendChild(badge);
            itemDiv.appendChild(sellButton);
            inventoryContainer.appendChild(itemDiv);
        });
    }

    async function sellItem(rarity) {
        try {
            const response = await fetch(`/sell/${rarity}`);
            const data = await response.json();

            if (response.ok) {
                // Update displays
                coinCountDisplay.textContent = data.coins;
                updateInventoryDisplay(data.inventory);

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Sold ${rarity} for ${data.value} coins!`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                console.error('Failed to sell item:', data.error);
            }
        } catch (error) {
            console.error('Error selling item:', error);
        }
    }

    // Buy luck functionality
    const luckCostDisplay = document.getElementById('luck-cost');
    const luckStatusDisplay = document.getElementById('luck-status');
    const toggleLuckButton = document.getElementById('toggle-luck-button');
    
    buyLuckButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/buy-luck');
            const data = await response.json();

            if (response.ok) {
                // Update displays
                coinCountDisplay.textContent = data.coins;
                luckBonusDisplay.textContent = data.total_luck + 'x';
                
                // Update the luck cost display for next level
                if (luckCostDisplay) {
                    luckCostDisplay.textContent = data.luck_cost;
                }

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = 'Purchased +1 Luck!';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Failed to buy luck';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error buying luck:', error);
        }
    });
    
    // Toggle luck functionality
    toggleLuckButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/toggle-luck');
            const data = await response.json();
            
            if (response.ok) {
                // Update luck status
                luckStatusDisplay.textContent = data.luck_active ? 'ON' : 'OFF';
                
                // Update the luck multiplier display
                luckBonusDisplay.textContent = data.total_luck + 'x';
                
                // Update button styling based on state
                if (data.luck_active) {
                    toggleLuckButton.classList.replace('btn-outline-danger', 'btn-outline-primary');
                } else {
                    toggleLuckButton.classList.replace('btn-outline-primary', 'btn-outline-danger');
                }
                
                // Show message
                const notification = document.createElement('div');
                notification.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Luck turned ${data.luck_active ? 'ON' : 'OFF'}`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error toggling luck:', error);
        }
    });
    });

    async function performRoll() {
        // Disable button and show spinner
        rollButton.disabled = true;
        rarityText.classList.add('d-none');
        spinner.classList.remove('d-none');

        try {
            const response = await fetch('/roll');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to roll');
            }

            // Hide spinner
            spinner.classList.add('d-none');
            rarityText.classList.remove('d-none');

            // Update display
            rarityText.textContent = data.result;
            rarityText.style.color = data.color;
            rarityText.classList.add('roll-animation');

            // Show secret button only on Uncommon roll
            if (data.result === 'Uncommon') {
                secretButton.classList.remove('d-none');
            } else {
                secretButton.classList.add('d-none');
            }

            // Update stats
            rollCountDisplay.textContent = data.roll_count;
            luckBonusDisplay.textContent = data.luck_bonus + 'x';
            coinCountDisplay.textContent = data.coins;

            // Update inventory
            updateInventoryDisplay(data.inventory);

            // Enable auto-roll if unlocked
            if (data.can_auto_roll) {
                autoRollButton.classList.remove('disabled');
                autoRollButton.disabled = false;
            }

            // Remove animation class after it completes
            setTimeout(() => {
                rarityText.classList.remove('roll-animation');
            }, 500);

        } catch (error) {
            console.error('Error:', error);
            rarityText.textContent = error.message || 'Error occurred!';
            rarityText.style.color = 'red';
            rarityText.classList.remove('d-none');
            spinner.classList.add('d-none');
            stopAutoRoll();

            // Show error notification
            const notification = document.createElement('div');
            notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
            notification.textContent = error.message || 'Error occurred while rolling!';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }

        // Re-enable button
        setTimeout(() => {
            rollButton.disabled = false;
        }, 1000);
    }

    function startAutoRoll() {
        if (isAutoRolling) return;
        isAutoRolling = true;
        autoRollButton.innerHTML = '<i class="fas fa-stop me-2"></i>Stop Auto Roll';
        autoRollButton.classList.remove('btn-secondary');
        autoRollButton.classList.add('btn-danger');
        autoRollInterval = setInterval(performRoll, 1500);
    }

    function stopAutoRoll() {
        if (!isAutoRolling) return;
        isAutoRolling = false;
        clearInterval(autoRollInterval);
        autoRollButton.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Auto Roll';
        autoRollButton.classList.remove('btn-danger');
        autoRollButton.classList.add('btn-secondary');
    }

    rollButton.addEventListener('click', performRoll);

    autoRollButton.addEventListener('click', function() {
        if (isAutoRolling) {
            stopAutoRoll();
        } else {
            startAutoRoll();
        }
    });
});