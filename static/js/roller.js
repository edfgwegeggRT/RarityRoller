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
                updateInventoryDisplay(data.inventory, data.locked_items);

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Sold all unlocked items for ${data.value} coins!`;
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

    function updateInventoryDisplay(inventory, lockedItems = []) {
        inventoryContainer.innerHTML = '';
        inventoryCountDisplay.textContent = inventory.length;

        inventory.forEach((item, index) => {
            const itemIdentifier = `${index}:${item}`;
            const isLocked = lockedItems.includes(itemIdentifier);

            const itemElement = document.createElement('div');
            itemElement.className = `inventory-item${isLocked ? ' locked-item' : ''}`;
            itemElement.dataset.rarity = item;
            itemElement.dataset.index = index;

            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.style.backgroundColor = rarityColors[item];
            badge.textContent = item;

            if (isLocked) {
                const lockIcon = document.createElement('i');
                lockIcon.className = 'fas fa-lock text-warning ms-1';
                badge.appendChild(lockIcon);
            }

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'btn-group w-100';

            const sellButton = document.createElement('button');
            sellButton.className = 'btn btn-sm btn-outline-warning sell-button';
            sellButton.dataset.rarity = item;
            sellButton.dataset.index = index;
            sellButton.dataset.value = rarityValues[item];
            sellButton.innerHTML = `Sell (${rarityValues[item]} <i class="fas fa-coins"></i>)`;

            if (isLocked) {
                sellButton.disabled = true;
            }

            const lockButton = document.createElement('button');
            lockButton.className = `btn btn-sm ${isLocked ? 'btn-warning' : 'btn-outline-secondary'} lock-button`;
            lockButton.dataset.index = index;
            lockButton.innerHTML = `<i class="fas ${isLocked ? 'fa-unlock' : 'fa-lock'}"></i>`;

            // Add event listener to new sell button
            sellButton.addEventListener('click', async function() {
                try {
                    const response = await fetch(`/sell/${item}/${index}`);
                    const data = await response.json();

                    if (response.ok) {
                        // Update displays
                        coinCountDisplay.textContent = data.coins;
                        updateInventoryDisplay(data.inventory, data.locked_items);

                        // Show success message
                        const notification = document.createElement('div');
                        notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                        notification.textContent = `Sold ${item} for ${data.value} coins!`;
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 2000);
                    } else {
                        // Show error message
                        const notification = document.createElement('div');
                        notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                        notification.textContent = data.error || 'Failed to sell item';
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 2000);
                    }
                } catch (error) {
                    console.error('Error selling item:', error);
                }
            });

            // Add event listener to lock button
            lockButton.addEventListener('click', async function() {
                try {
                    const response = await fetch(`/toggle-lock/${index}`);
                    const data = await response.json();

                    if (response.ok) {
                        // Update the inventory display to reflect the lock status change
                        const currentItems = Array.from(document.querySelectorAll('.inventory-item')).map(el => el.dataset.rarity);
                        const lockedItemsList = Array.from(document.querySelectorAll('.locked-item')).map(el => `${el.dataset.index}:${el.dataset.rarity}`);

                        // Toggle the locked status for this item
                        if (data.is_locked) {
                            lockedItemsList.push(`${index}:${item}`);
                        } else {
                            const itemToRemove = `${index}:${item}`;
                            const itemIndex = lockedItemsList.indexOf(itemToRemove);
                            if (itemIndex !== -1) {
                                lockedItemsList.splice(itemIndex, 1);
                            }
                        }

                        updateInventoryDisplay(currentItems, lockedItemsList);

                        // Show success message
                        const notification = document.createElement('div');
                        notification.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
                        notification.textContent = `Item ${data.is_locked ? 'locked' : 'unlocked'}!`;
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 2000);
                    } else {
                        // Show error message
                        const notification = document.createElement('div');
                        notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                        notification.textContent = data.error || 'Failed to toggle lock';
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 2000);
                    }
                } catch (error) {
                    console.error('Error toggling lock:', error);
                }
            });

            buttonGroup.appendChild(sellButton);
            buttonGroup.appendChild(lockButton);

            itemElement.appendChild(badge);
            itemElement.appendChild(buttonGroup);
            inventoryContainer.appendChild(itemElement);
        });
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
                // Update roll count and luck bonus
                rollCountDisplay.textContent = data.roll_count;
                luckBonusDisplay.textContent = data.luck_bonus + 'x';

                // Enable auto-roll if roll count is high enough
                if (data.can_auto_roll && autoRollButton.classList.contains('disabled')) {
                    autoRollButton.classList.remove('disabled');
                    autoRollButton.disabled = false;
                }

                // Update the inventory display
                const lockedItems = Array.from(document.querySelectorAll('.locked-item')).map(el => `${el.dataset.index}:${el.dataset.rarity}`);
                updateInventoryDisplay(data.inventory, lockedItems);
                coinCountDisplay.textContent = data.coins;

                // Show the result
                rarityText.textContent = data.result;
                rarityText.style.color = data.color;
                rarityText.classList.remove('d-none');
                spinner.classList.add('d-none');

                // Show auto-sell notification if applicable
                if (data.auto_sold) {
                    const notification = document.createElement('div');
                    notification.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = `Auto-sold ${data.result} for ${data.auto_sell_value} coins!`;
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                }

                // Add animation class
                rarityText.classList.add('roll-animation');
            } else {
                throw new Error(data.error || 'Failed to roll');
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