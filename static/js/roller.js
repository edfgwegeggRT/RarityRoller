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
    const autoSellToggles = document.querySelectorAll('.auto-sell-toggle'); 

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
    buyLuckButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/buy-luck');
            const data = await response.json();

            if (response.ok) {
                // Update displays
                coinCountDisplay.textContent = data.coins;
                luckBonusDisplay.textContent = data.total_luck + 'x';
                document.getElementById('luck-cost').textContent = data.next_cost;

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

    // Buy max luck functionality
    const buyMaxLuckButton = document.getElementById('buy-max-luck-button');

    buyMaxLuckButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/buy-max-luck');
            const data = await response.json();

            if (response.ok) {
                // Update displays
                coinCountDisplay.textContent = data.coins;
                luckBonusDisplay.textContent = data.total_luck + 'x';
                document.getElementById('luck-cost').textContent = data.next_cost;

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Purchased ${data.levels_purchased} luck levels for ${data.total_spent} coins!`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Failed to buy max luck';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error buying max luck:', error);
        }
    });

    // Toggle luck functionality
    const toggleLuckButton = document.getElementById('toggle-luck-button');
    const luckStatusDisplay = document.getElementById('luck-status');

    toggleLuckButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/toggle-luck');
            const data = await response.json();

            if (response.ok) {
                // Update the luck display
                luckBonusDisplay.textContent = data.total_luck + 'x';
                luckStatusDisplay.textContent = data.luck_active ? 'ON' : 'OFF';
                luckStatusDisplay.className = data.luck_active ? 'badge bg-success' : 'badge bg-danger';

                // Show notification
                const notification = document.createElement('div');
                notification.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Luck ${data.luck_active ? 'activated' : 'deactivated'}! Current luck: ${data.total_luck}x`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                console.error('Failed to toggle luck:', data.error);
            }
        } catch (error) {
            console.error('Error toggling luck:', error);
        }
    });

    // Buy storage functionality
    const buyStorageButton = document.getElementById('buy-storage-button');
    const displayedCapacity = document.getElementById('displayed-capacity');
    const storageCostDisplay = document.getElementById('storage-cost');

    buyStorageButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/buy-storage');
            const data = await response.json();

            if (response.ok) {
                // Update displays
                coinCountDisplay.textContent = data.coins;
                displayedCapacity.textContent = data.inventory_capacity;
                storageCostDisplay.textContent = data.next_cost;

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = 'Storage upgraded successfully!';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Failed to upgrade storage';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error buying storage:', error);
        }
    });

    // Auto-sell toggle functionality
    autoSellToggles.forEach(button => {
        button.addEventListener('click', async function() {
            const rarity = this.dataset.rarity;
            try {
                const response = await fetch(`/toggle-auto-sell/${rarity}`);
                const data = await response.json();

                if (response.ok) {
                    // Update button appearance
                    if (data.auto_sell_enabled) {
                        this.classList.remove('btn-outline-secondary');
                        this.classList.add('btn-success');
                        this.innerHTML = '<i class="fas fa-check-circle"></i> ON';
                    } else {
                        this.classList.remove('btn-success');
                        this.classList.add('btn-outline-secondary');
                        this.innerHTML = '<i class="fas fa-times-circle"></i> OFF';
                    }

                    // Show notification
                    const notification = document.createElement('div');
                    notification.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = `Auto-sell for ${rarity} ${data.auto_sell_enabled ? 'enabled' : 'disabled'}`;
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                } else {
                    // Show error message
                    const notification = document.createElement('div');
                    notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = data.error || 'Failed to toggle auto-sell';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                }
            } catch (error) {
                console.error('Error toggling auto-sell:', error);
            }
        });
    });

    async function performRoll() {
        if (rollButton.disabled) return;

        // Disable button during roll
        rollButton.disabled = true;

        try {
            // Show spinner, hide result
            rarityText.classList.add('d-none');
            spinner.classList.remove('d-none');

            const response = await fetch('/roll');
            const data = await response.json();

            if (response.ok) {
                // Update displays 
                rollCountDisplay.textContent = data.roll_count;
                luckBonusDisplay.textContent = data.luck_bonus + 'x';
                updateInventoryDisplay(data.inventory);
                coinCountDisplay.textContent = data.coins;

                // Show the result
                rarityText.textContent = data.result;
                rarityText.style.color = data.color;
                rarityText.classList.remove('d-none');
                spinner.classList.add('d-none');

                // Show secret button only on uncommon rolls
                if (data.result === 'Uncommon') {
                    secretButton.classList.remove('d-none');
                } else {
                    secretButton.classList.add('d-none');
                }

                // Check for high-rarity rolls and apply special effects
                const highRarities = ['Divine', 'Mythical', 'Jack Attack', 'Ancient', 'Secret'];
                if (highRarities.includes(data.result)) {
                    // Create supernova effect
                    const supernova = document.createElement('div');
                    supernova.className = 'supernova';
                    supernova.style.background = `radial-gradient(circle, ${data.color}66 0%, ${data.color}33 50%, transparent 70%)`;
                    document.body.appendChild(supernova);

                    // Remove supernova after animation
                    setTimeout(() => {
                        supernova.remove();
                    }, 1000);

                    // Add mythic animation to the text
                    rarityText.classList.add('mythic-animation');

                    // Remove mythic animation after effect completes
                    setTimeout(() => {
                        rarityText.classList.remove('mythic-animation');
                    }, 2000);

                    // Play celebration sound
                    const audio = new Audio('data:audio/wav;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAA5TEFNRTMuMTAwA8MAAAAAAAAAABQgJAi4TQABzAAAAob6xLBzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==');
                    audio.play();
                }

                // Show auto-sell notification if applicable
                if (data.auto_sold) {
                    const notification = document.createElement('div');
                    notification.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = `Auto-sold ${data.result} for ${data.auto_sell_value} coins!`;
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                }

                // Add standard roll animation
                rarityText.classList.add('roll-animation');
            } else {
                throw new Error(data.error || 'Failed to roll');
            }

            // Remove standard animation class after it completes
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