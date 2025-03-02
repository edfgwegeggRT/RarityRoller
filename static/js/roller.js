// Add event listener for mythical secret button
document.addEventListener('DOMContentLoaded', function() {
    const mythicalButton = document.getElementById('mythical-secret-button');
    if (mythicalButton) {
        mythicalButton.addEventListener('click', function() {
            // Hide the button after click
            this.classList.add('d-none');

            // Call the API to activate mythical luck
            fetch('/activate-mythical-luck')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show success notification
                        const notification = document.createElement('div');
                        notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                        notification.textContent = '🔥 x500000 Luck boost activated for 1 roll! 🔥';
                        document.body.appendChild(notification);
                        setTimeout(() => notification.remove(), 3000);
                    } else {
                        throw new Error(data.error);
                    }
                })
                .catch(error => {
                    // Show error notification
                    const notification = document.createElement('div');
                    notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = error.message || 'Failed to activate mythical luck';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 3000);
                });
        });
    }
});



document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const rollButton = document.getElementById('roll-button');
    const autoRollButton = document.getElementById('auto-roll-button');
    const rarityText = document.getElementById('rarity-text');
    const spinner = document.getElementById('spinner');
    const rollCountDisplay = document.getElementById('roll-count');
    const luckBonusDisplay = document.getElementById('luck-bonus');
    const inventoryContainer = document.getElementById('inventory-items');
    const inventoryCountDisplay = document.getElementById('inventory-count');
    const coinCountDisplay = document.getElementById('coin-count');
    const sellAllButton = document.getElementById('sell-all-button');
    const buyLuckButton = document.getElementById('buy-luck-button');
    const buyMaxLuckButton = document.getElementById('buy-max-luck-button');
    const luckCostDisplay = document.getElementById('luck-cost');
    const buyStorageButton = document.getElementById('buy-storage-button');
    const storageCostDisplay = document.getElementById('storage-cost');
    const capacityDisplay = document.getElementById('displayed-capacity');
    const unequipButton = document.getElementById('unequip-button');
    const toggleLuckButton = document.getElementById('toggle-luck-button');
    const luckStatusIndicator = document.getElementById('luck-status');

    // Secret buttons
    const secretButton = document.getElementById('secret-button');
    const goodSecretButton = document.getElementById('good-secret-button');
    const epicSecretButton = document.getElementById('epic-secret-button');
    const epicSecretButton2 = document.getElementById('epic-secret-button2');
    const divineSecretButton = document.getElementById('divine-secret-button');
    const divineSecretButton2 = document.getElementById('divine-secret-button2');
    const rareSecretButton = document.getElementById('rare-secret-button');
    const legendarySecretButton = document.getElementById('legendary-secret-button');
    const legendarySecretButton2 = document.getElementById('legendary-secret-button2');
    const mythicalSecretButton = document.getElementById('mythical-secret-button');

    // Variables
    let isRolling = false;
    let isAutoRolling = false;
    let inventory = [];
    let equippedRarity = null;

    // Initialize auto-sell toggle buttons
    document.querySelectorAll('.auto-sell-toggle').forEach(button => {
        button.addEventListener('click', function() {
            toggleAutoSell(this.dataset.rarity);
        });
    });

    // Fetch inventory on page load
    if (inventoryContainer) {
        const inventoryItems = inventoryContainer.querySelectorAll('.inventory-item');
        inventory = Array.from(inventoryItems).map(item => item.dataset.rarity);

        // Add click event listeners to sell buttons
        document.querySelectorAll('.sell-button').forEach(button => {
            button.addEventListener('click', () => sellItem(button.dataset.rarity));
        });

        // Add click event listeners to equip buttons
        document.querySelectorAll('.equip-button').forEach(button => {
            button.addEventListener('click', () => equipItem(button.dataset.rarity));
        });
    }

    // Roll button
    if (rollButton) {
        rollButton.addEventListener('click', async function() {
            if (isRolling) return;
            await roll();
        });
    }

    // Auto roll button
    if (autoRollButton) {
        autoRollButton.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;

            isAutoRolling = !isAutoRolling;

            if (isAutoRolling) {
                this.textContent = 'Stop Auto Roll';
                this.classList.remove('btn-secondary');
                this.classList.add('btn-danger');
                autoRoll();
            } else {
                this.textContent = 'Auto Roll';
                this.classList.remove('btn-danger');
                this.classList.add('btn-secondary');
            }
        });
    }

    // Sell All button
    if (sellAllButton) {
        sellAllButton.addEventListener('click', sellAll);
    }

    // Buy Luck button
    if (buyLuckButton) {
        buyLuckButton.addEventListener('click', buyLuck);
    }

    // Buy Max Luck button
    if (buyMaxLuckButton) {
        buyMaxLuckButton.addEventListener('click', buyMaxLuck);
    }

    // Buy Storage button
    if (buyStorageButton) {
        buyStorageButton.addEventListener('click', buyStorage);
    }

    // Toggle Luck button
    if (toggleLuckButton) {
        toggleLuckButton.addEventListener('click', toggleLuck);
    }

    // Unequip button
    if (unequipButton) {
        unequipButton.addEventListener('click', unequipItem);
    }

    // Secret buttons
    if (secretButton) {
        secretButton.addEventListener('click', function() {
            activateSuperLuck('uncommon');
        });
    }

    if (goodSecretButton) {
        goodSecretButton.addEventListener('click', function() {
            activateSuperLuck('good');
        });
    }

    if (epicSecretButton) {
        epicSecretButton.addEventListener('click', function() {
            activateSuperLuck('epic');
        });
    }

    if (epicSecretButton2) {
        epicSecretButton2.addEventListener('click', function() {
            activateSuperLuck('epic2');
        });
    }

    if (divineSecretButton) {
        divineSecretButton.addEventListener('click', function() {
            activateDivineLuck();
        });
    }

    if (divineSecretButton2) {
        divineSecretButton2.addEventListener('click', function() {
            activateDivineLuck2();
        });
    }

    if (rareSecretButton) {
        rareSecretButton.addEventListener('click', function() {
            activateRareLuck();
        });
    }

    if (legendarySecretButton) {
        legendarySecretButton.addEventListener('click', function() {
            activateLegendaryLuck();
        });
    }

    if (legendarySecretButton2) {
        legendarySecretButton2.addEventListener('click', function() {
            activateLegendaryLuck2();
        });
    }

    if (mythicalSecretButton) {
        mythicalSecretButton.addEventListener('click', function() {
            activateMythicalLuck();
        });
    }

    // Roll function
    async function roll() {
        if (isRolling) return;

        isRolling = true;
        spinner.classList.remove('d-none');
        rollButton.disabled = true;

        try {
            const response = await fetch('/roll');
            const data = await response.json();

            if (response.ok) {
                // Update UI
                rarityText.textContent = data.result;
                rarityText.style.color = data.color;
                rollCountDisplay.textContent = data.roll_count;
                luckBonusDisplay.textContent = `${data.luck_bonus}x`;
                coinCountDisplay.textContent = data.coins;

                // Show special effects for rare tiers
                showSpecialEffects(data.result);

                // Show secret buttons based on result
                revealSecretButtons(data.result);

                // Update auto roll button if needed
                if (data.can_auto_roll && autoRollButton.classList.contains('disabled')) {
                    autoRollButton.classList.remove('disabled');
                    autoRollButton.disabled = false;
                    autoRollButton.textContent = 'Auto Roll';
                }

                // Update inventory
                inventory = data.inventory;
                updateInventoryDisplay();

                if (data.auto_sold) {
                    const notification = document.createElement('div');
                    notification.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = `Auto-sold ${data.result} for ${data.auto_sell_value} coins!`;
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 2000);
                }
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error rolling';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error rolling:', error);
        } finally {
            spinner.classList.add('d-none');
            rollButton.disabled = false;
            isRolling = false;
        }
    }

    // Auto roll function
    async function autoRoll() {
        if (!isAutoRolling) return;

        await roll();

        if (isAutoRolling) {
            setTimeout(autoRoll, 100);
        }
    }

    // Function to show special effects for rare tiers
    function showSpecialEffects(rarity) {
        // Remove any existing effects
        const existingHaxEffect = document.querySelector('.hax-effect');
        if (existingHaxEffect) {
            existingHaxEffect.remove();
        }

        const existingSpecialEffect = document.querySelector('.special-effect');
        if (existingSpecialEffect) {
            existingSpecialEffect.remove();
        }

        // Add effects based on rarity
        if (rarity === 'Hax') {
            const effect = document.createElement('div');
            effect.className = 'hax-effect';
            const inner = document.createElement('div');
            inner.className = 'hax-inner';
            effect.appendChild(inner);
            document.body.appendChild(effect);

            setTimeout(() => {
                effect.remove();
            }, 3000);
        } else if (rarity === 'Special') {
            const effect = document.createElement('div');
            effect.className = 'special-effect';
            const inner = document.createElement('div');
            inner.className = 'special-inner';
            effect.appendChild(inner);
            document.body.appendChild(effect);

            setTimeout(() => {
                effect.remove();
            }, 3000);
        }
    }

    // Function to reveal secret buttons
    function revealSecretButtons(rarity) {
        // Hide all secret buttons first
        [secretButton, goodSecretButton, epicSecretButton, epicSecretButton2, 
         divineSecretButton, divineSecretButton2, rareSecretButton, 
         legendarySecretButton, legendarySecretButton2, mythicalSecretButton].forEach(btn => {
            if (btn) btn.classList.add('d-none');
        });

        // Reveal button based on rarity
        if (rarity === 'Secret') {
            if (secretButton) secretButton.classList.remove('d-none');
        } else if (rarity === 'Good') {
            if (goodSecretButton) goodSecretButton.classList.remove('d-none');
        } else if (rarity === 'Epic') {
            if (epicSecretButton) epicSecretButton.classList.remove('d-none');
            if (epicSecretButton2) epicSecretButton2.classList.remove('d-none');
        } else if (rarity === 'Divine') {
            if (divineSecretButton) divineSecretButton.classList.remove('d-none');
            if (divineSecretButton2) divineSecretButton2.classList.remove('d-none');
        } else if (rarity === 'Rare') {
            if (rareSecretButton) rareSecretButton.classList.remove('d-none');
        } else if (rarity === 'Legendary') {
            if (legendarySecretButton) legendarySecretButton.classList.remove('d-none');
            if (legendarySecretButton2) legendarySecretButton2.classList.remove('d-none');
        } else if (rarity === 'Mythical') {
            if (mythicalSecretButton) mythicalSecretButton.classList.remove('d-none');
        }
    }

    // Function to sell an item
    async function sellItem(rarity) {
        try {
            const response = await fetch(`/sell/${rarity}`);
            const data = await response.json();

            if (response.ok) {
                // Update UI
                coinCountDisplay.textContent = data.coins;
                inventory = data.inventory;
                updateInventoryDisplay();

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Sold ${rarity} for ${data.value} coins!`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error selling item';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error selling item:', error);
        }
    }

    // Function to sell all items
    async function sellAll() {
        if (inventory.length === 0) {
            // Show error message
            const notification = document.createElement('div');
            notification.className = 'alert alert-warning position-fixed top-0 start-50 translate-middle-x mt-3';
            notification.textContent = 'No items to sell!';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 2000);
            return;
        }

        try {
            const response = await fetch('/sell-all');
            const data = await response.json();

            if (response.ok) {
                // Update UI
                coinCountDisplay.textContent = data.coins;
                inventory = data.inventory;
                updateInventoryDisplay();

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
                notification.textContent = data.error || 'Error selling all items';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error selling all items:', error);
        }
    }

    // Function to buy luck
    async function buyLuck() {
        try {
            const response = await fetch('/buy-luck');
            const data = await response.json();

            if (response.ok) {
                // Update UI
                coinCountDisplay.textContent = data.coins;
                luckBonusDisplay.textContent = `${data.total_luck}x`;
                luckCostDisplay.textContent = data.next_cost;

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Bought luck boost! New luck: ${data.total_luck}x`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error buying luck';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error buying luck:', error);
        }
    }

    // Function to buy max luck
    async function buyMaxLuck() {
        try {
            const response = await fetch('/buy-max-luck');
            const data = await response.json();

            if (response.ok) {
                // Update UI
                coinCountDisplay.textContent = data.coins;
                luckBonusDisplay.textContent = `${data.total_luck}x`;
                luckCostDisplay.textContent = data.next_cost;

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Bought ${data.levels_purchased} luck boosts for ${data.total_spent} coins! New luck: ${data.total_luck}x`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error buying max luck';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error buying max luck:', error);
        }
    }

    // Function to toggle luck
    async function toggleLuck() {
        try {
            const response = await fetch('/toggle-luck');
            const data = await response.json();

            if (response.ok) {
                // Update UI
                luckBonusDisplay.textContent = `${data.total_luck}x`;

                if (data.luck_active) {
                    luckStatusIndicator.textContent = 'ON';
                    luckStatusIndicator.className = 'badge bg-success';
                } else {
                    luckStatusIndicator.textContent = 'OFF';
                    luckStatusIndicator.className = 'badge bg-danger';
                }

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Luck is now ${data.luck_active ? 'ON' : 'OFF'}`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error toggling luck';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error toggling luck:', error);
        }
    }

    // Function to buy storage
    async function buyStorage() {
        try {
            const response = await fetch('/buy-storage');
            const data = await response.json();

            if (response.ok) {
                // Update UI
                coinCountDisplay.textContent = data.coins;
                capacityDisplay.textContent = data.inventory_capacity;
                storageCostDisplay.textContent = data.next_cost;
                document.getElementById('inventory-capacity').textContent = data.inventory_capacity;

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Bought storage upgrade! New capacity: ${data.inventory_capacity} slots`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error buying storage';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error buying storage:', error);
        }
    }

    // Function to toggle auto-sell for a rarity
    async function toggleAutoSell(rarity) {
        try {
            const response = await fetch(`/toggle-auto-sell/${rarity}`);
            const data = await response.json();

            if (response.ok) {
                // Update button appearance
                document.querySelectorAll(`.auto-sell-toggle[data-rarity="${rarity}"]`).forEach(button => {
                    if (data.auto_sell_enabled) {
                        button.classList.remove('btn-outline-secondary');
                        button.classList.add('btn-success');
                        button.innerHTML = '<i class="fas fa-check-circle"></i> ON';
                    } else {
                        button.classList.remove('btn-success');
                        button.classList.add('btn-outline-secondary');
                        button.innerHTML = '<i class="fas fa-times-circle"></i> OFF';
                    }
                });

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-info position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Auto-sell for ${rarity} is now ${data.auto_sell_enabled ? 'ON' : 'OFF'}`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error toggling auto-sell';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error toggling auto-sell:', error);
        }
    }

    // Function to activate super luck
    async function activateSuperLuck(buttonType) {
        try {
            const response = await fetch(`/activate-super-luck/${buttonType}`);
            const data = await response.json();

            if (response.ok) {
                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Super luck activated! (100x multiplier for 10 seconds)`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);

                // Hide the button
                if (buttonType === 'uncommon') {
                    secretButton.classList.add('d-none');
                } else if (buttonType === 'good') {
                    goodSecretButton.classList.add('d-none');
                } else if (buttonType === 'epic') {
                    epicSecretButton.classList.add('d-none');
                } else if (buttonType === 'epic2') {
                    epicSecretButton2.classList.add('d-none');
                }
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error activating super luck';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error activating super luck:', error);
        }
    }

    // Function to activate divine luck
    async function activateDivineLuck() {
        try {
            const response = await fetch('/activate-divine-luck');
            const data = await response.json();

            if (response.ok) {
                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Divine luck activated! (+50 permanent luck)`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);

                // Hide the button
                divineSecretButton.classList.add('d-none');

                // Refresh page to update luck display
                setTimeout(() => location.reload(), 1000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error activating divine luck';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error activating divine luck:', error);
        }
    }

    // Function to activate divine luck 2
    async function activateDivineLuck2() {
        try {
            const response = await fetch('/activate-divine-luck2');
            const data = await response.json();

            if (response.ok) {
                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Divine luck 2 activated! (+75 permanent luck)`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);

                // Hide the button
                divineSecretButton2.classList.add('d-none');

                // Refresh page to update luck display
                setTimeout(() => location.reload(), 1000);
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error activating divine luck 2';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error activating divine luck 2:', error);
        }
    }

    // Function to activate rare luck
    async function activateRareLuck() {
        try {
            const response = await fetch('/activate-rare-luck');
            const data = await response.json();

            if (response.ok) {
                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Rare luck activated! (2500x multiplier for next roll)`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);

                // Hide the button
                rareSecretButton.classList.add('d-none');
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error activating rare luck';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error activating rare luck:', error);
        }
    }

    // Function to activate legendary luck
    async function activateLegendaryLuck() {
        try {
            const response = await fetch('/activate-legendary-luck');
            const data = await response.json();

            if (response.ok) {
                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Legendary luck activated! (10000x multiplier for next roll)`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);

                // Hide the button
                legendarySecretButton.classList.add('d-none');
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error activating legendary luck';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error activating legendary luck:', error);
        }
    }

    // Function to activate legendary luck 2
    async function activateLegendaryLuck2() {
        try {
            const response = await fetch('/activate-legendary-luck2');
            const data = await response.json();

            if (response.ok) {
                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Legendary luck 2 activated! (15000x multiplier for next roll)`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);

                // Hide the button
                legendarySecretButton2.classList.add('d-none');
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error activating legendary luck 2';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error activating legendary luck 2:', error);
        }
    }

    // Function to activate mythical luck
    async function activateMythicalLuck() {
        try {
            const response = await fetch('/activate-mythical-luck');
            const data = await response.json();

            if (response.ok) {
                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Mythical luck activated! (500000x multiplier for next roll)`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);

                // Hide the button
                mythicalSecretButton.classList.add('d-none');
            } else {
                // Show error message
                const notification = document.createElement('div');
                notification.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = data.error || 'Error activating mythical luck';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            }
        } catch (error) {
            console.error('Error activating mythical luck:', error);
        }
    }

    // Function to update inventory display
    function updateInventoryDisplay() {
        if (!inventoryContainer) return;

        inventoryCountDisplay.textContent = inventory.length;
        inventoryContainer.innerHTML = '';

        const inventoryCapacity = parseInt(document.getElementById('inventory-capacity').textContent, 10);
        const capacityPercentage = (inventory.length / inventoryCapacity) * 100;

        // Add warning class if inventory is getting full
        if (capacityPercentage >= 90) {
            inventoryCountDisplay.classList.add('text-danger');
        } else if (capacityPercentage >= 70) {
            inventoryCountDisplay.classList.add('text-warning');
            inventoryCountDisplay.classList.remove('text-danger');
        } else {
            inventoryCountDisplay.classList.remove('text-warning', 'text-danger');
        }

        // Create inventory items
        inventory.forEach(rarity => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.dataset.rarity = rarity;

            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.style.backgroundColor = rarityColors[rarity];
            badge.textContent = rarity;

            // Add equipped indicator if this item is equipped
            if (equippedRarity === rarity) {
                const equippedIndicator = document.createElement('span');
                equippedIndicator.className = 'equipped-indicator';
                equippedIndicator.textContent = '✓';
                badge.appendChild(equippedIndicator);
            }

            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'd-flex gap-1';

            const equipButton = document.createElement('button');
            equipButton.className = 'btn btn-sm btn-outline-primary equip-button';
            equipButton.dataset.rarity = rarity;
            equipButton.textContent = equippedRarity === rarity ? 'Equipped' : 'Equip';
            if (equippedRarity === rarity) {
                equipButton.disabled = true;
            }
            equipButton.addEventListener('click', () => equipItem(rarity));

            const sellButton = document.createElement('button');
            sellButton.className = 'btn btn-sm btn-outline-warning sell-button';
            sellButton.dataset.rarity = rarity;
            sellButton.dataset.value = rarityValues[rarity];
            sellButton.innerHTML = `Sell (${rarityValues[rarity]} <i class="fas fa-coins"></i>)`;
            if (equippedRarity === rarity) {
                sellButton.disabled = true;
            }
            sellButton.addEventListener('click', () => sellItem(rarity));

            buttonContainer.appendChild(equipButton);
            buttonContainer.appendChild(sellButton);

            itemDiv.appendChild(badge);
            itemDiv.appendChild(buttonContainer);

            inventoryContainer.appendChild(itemDiv);
        });
    }

    // Function to equip an item
    async function equipItem(rarity) {
        try {
            const response = await fetch(`/equip/${rarity}`);
            const data = await response.json();

            if (response.ok) {
                // Set equipped rarity
                equippedRarity = rarity;

                // Show unequip button
                if (unequipButton) {
                    unequipButton.classList.remove('d-none');
                }

                // Apply visual effect based on rarity
                applyEquippedEffect(rarity);

                // Update inventory display to show equipped status
                updateInventoryDisplay();

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = `Equipped ${rarity}!`;
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                console.error('Failed to equip item:', data.error);
            }
        } catch (error) {
            console.error('Error equipping item:', error);
        }
    }

    // Function to apply visual effect for equipped rarity
    function applyEquippedEffect(rarity) {
        // Remove any existing animations first
        removeEquippedAnimations();

        // Get the rarity color from the rarity tiers data
        let rarityColor = '#cccccc'; // Default color

        // Find all badge elements and match the one for our rarity
        const badges = document.querySelectorAll('.badge');
        badges.forEach(badge => {
            if (badge.textContent.trim() === rarity) {
                rarityColor = window.getComputedStyle(badge).backgroundColor;
            }
        });

        // Create a simple overlay with the rarity color
        const overlay = document.createElement('div');
        overlay.className = 'rarity-overlay';
        overlay.id = 'rarity-overlay';
        overlay.style.backgroundColor = rarityColor;
        overlay.style.opacity = '0.5';
        document.body.appendChild(overlay);
    }

    function removeEquippedAnimations() {
        const animation = document.getElementById('current-equipped-animation');
        if (animation) {
            animation.remove();
        }

        // Remove screen color overlay
        const overlay = document.getElementById('rarity-overlay');
        if (overlay) {
            overlay.remove();
        }

        document.body.classList.remove('special-effect-body');
    }

    async function unequipItem() {
        try {
            const response = await fetch('/unequip');
            const data = await response.json();

            if (response.ok) {
                // Hide unequip button
                const unequipButton = document.getElementById('unequip-button');
                if (unequipButton) {
                    unequipButton.classList.add('d-none');
                }

                // Clear equipped status
                equippedRarity = null;

                // Remove animation
                removeEquippedAnimations();

                // Update inventory display
                updateInventoryDisplay();

                // Show success message
                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = 'Item unequipped!';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 2000);
            } else {
                console.error('Failed to unequip item:', data.error);
            }
        } catch (error) {
            console.error('Error unequipping item:', error);
        }
    }
});

// Placeholder for rarity colors and values (replace with your actual data)
const rarityColors = {
    'Uncommon': 'lightblue',
    'Good': 'lightgreen',
    'Epic': 'purple',
    'Divine': 'gold',
    'Legendary': 'orange',
    'Mythical': 'pink',
    'Jack Attack': 'red',
    'Ancient': 'brown',
    'Secret': 'gray',
    'Hax': 'teal',
    'Special': 'lime',
    'Chill': 'cyan',
    'Hyperpigmentation': 'magenta'
};

const rarityValues = {
    'Uncommon': 10,
    'Good': 50,
    'Epic': 250,
    'Divine': 1250,
    'Legendary': 6250,
    'Mythical': 31250,
    'Jack Attack': 100000,
    'Ancient': 500000,
    'Secret': 2500000,
    'Hax': 10000000,
    'Special': 50000000,
    'Chill': 250000000,
    'Hyperpigmentation': 1000000000
};