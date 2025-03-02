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
    const goodSecretButton = document.getElementById('good-secret-button');
    const epicSecretButton = document.getElementById('epic-secret-button');
    const epicSecretButton2 = document.getElementById('epic-secret-button2');
    const divineSecretButton = document.getElementById('divine-secret-button');
    const divineSecretButton2 = document.getElementById('divine-secret-button2');
    const rareSecretButton = document.getElementById('rare-secret-button'); 
    const legendarySecretButton = document.getElementById('legendary-secret-button');
    const legendarySecretButton2 = document.getElementById('legendary-secret-button2'); 
    const secretRarityButton = document.getElementById('secret-rarity-button'); // Added

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
                const response = await fetch('/activate-super-luck/uncommon');
                const data = await response.json();

                if (response.ok) {
                    secretButton.disabled = true;
                    secretButton.style.display = 'none';

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

    if (goodSecretButton) {
        goodSecretButton.addEventListener('click', async function() {
            try {
                const response = await fetch('/activate-super-luck/good');
                const data = await response.json();

                if (response.ok) {
                    goodSecretButton.disabled = true;
                    goodSecretButton.style.display = 'none';

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

    if (epicSecretButton) {
        epicSecretButton.addEventListener('click', async function() {
            try {
                const response = await fetch('/activate-super-luck/epic');
                const data = await response.json();

                if (response.ok) {
                    epicSecretButton.disabled = true;
                    epicSecretButton.style.display = 'none';

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

    if (epicSecretButton2) {
        epicSecretButton2.addEventListener('click', async function() {
            try {
                const response = await fetch('/activate-super-luck/epic2');
                const data = await response.json();

                if (response.ok) {
                    epicSecretButton2.disabled = true;
                    epicSecretButton2.style.display = 'none';

                    const notification = document.createElement('div');
                    notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = '🌟 300x Luck activated for 15 seconds! 🌟';
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

    if (divineSecretButton) {
        divineSecretButton.addEventListener('click', async function() {
            try {
                const response = await fetch('/activate-divine-luck');
                const data = await response.json();

                if (response.ok) {
                    divineSecretButton.disabled = true;
                    divineSecretButton.style.display = 'none';

                    const notification = document.createElement('div');
                    notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = '🌟 Permanent +50 luck bonus activated! 🌟';
                    document.body.appendChild(notification);

                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                } else {
                    console.error('Failed to activate divine luck:', data.error);
                }
            } catch (error) {
                console.error('Error activating divine luck:', error);
            }
        });
    }

    if (divineSecretButton2) {
        divineSecretButton2.addEventListener('click', async function() {
            try {
                const response = await fetch('/activate-divine-luck2'); // Added new route
                const data = await response.json();

                if (response.ok) {
                    divineSecretButton2.disabled = true;
                    divineSecretButton2.style.display = 'none';

                    const notification = document.createElement('div');
                    notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = '🌟 Permanent +75 luck bonus activated! 🌟'; // Different bonus
                    document.body.appendChild(notification);

                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                } else {
                    console.error('Failed to activate divine luck 2:', data.error);
                }
            } catch (error) {
                console.error('Error activating divine luck 2:', error);
            }
        });
    }

    if (rareSecretButton) {
        rareSecretButton.addEventListener('click', async function() {
            try {
                const response = await fetch('/activate-rare-luck');
                const data = await response.json();

                if (response.ok) {
                    rareSecretButton.disabled = true;
                    rareSecretButton.style.display = 'none';

                    const notification = document.createElement('div');
                    notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = '🌟 x2500 luck for 1 roll activated! 🌟';
                    document.body.appendChild(notification);

                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                } else {
                    console.error('Failed to activate rare luck:', data.error);
                }
            } catch (error) {
                console.error('Error activating rare luck:', error);
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

                // Handle secret buttons based on rarity
                secretButton.classList.add('d-none');
                goodSecretButton.classList.add('d-none');
                epicSecretButton.classList.add('d-none');
                epicSecretButton2.classList.add('d-none');
                divineSecretButton.classList.add('d-none');
                divineSecretButton2.classList.add('d-none');
                rareSecretButton.classList.add('d-none'); 
                legendarySecretButton.classList.add('d-none');
                legendarySecretButton2.classList.add('d-none');
                secretRarityButton.classList.add('d-none'); // Added

                if (data.result === 'Uncommon') {
                    secretButton.classList.remove('d-none');
                    // Position the button over the first character
                    secretButton.style.left = '30%';
                    secretButton.style.top = '20px';
                } else if (data.result === 'Good') {
                    goodSecretButton.classList.remove('d-none');
                    // Position the button over the 'g' of Good
                    goodSecretButton.style.left = '40%';
                    goodSecretButton.style.top = '20px';
                } else if (data.result === 'Epic') {
                    epicSecretButton.classList.remove('d-none');
                    epicSecretButton2.classList.remove('d-none');
                    // Position the buttons over the 'c' of Epic
                    epicSecretButton.style.left = '50%';
                    epicSecretButton.style.top = '20px';
                    epicSecretButton2.style.left = '60%';
                    epicSecretButton2.style.top = '20px';
                } else if (data.result === 'Divine') {
                    divineSecretButton.classList.remove('d-none');
                    divineSecretButton2.classList.remove('d-none');
                    // Position the buttons on either side of Divine
                    divineSecretButton.style.left = '40%';
                    divineSecretButton.style.top = '20px';
                    divineSecretButton2.style.left = '60%';
                    divineSecretButton2.style.top = '20px';
                } else if (data.result === 'Legendary') {
                    legendarySecretButton.classList.remove('d-none');
                    legendarySecretButton2.classList.remove('d-none');
                    // Position the buttons on either side of Legendary
                    legendarySecretButton.style.left = '35%';
                    legendarySecretButton.style.top = '20px';
                    legendarySecretButton2.style.left = '65%';
                    legendarySecretButton2.style.top = '20px';
                } else if (data.result === 'Rare') {
                    rareSecretButton.classList.remove('d-none');
                    // Position the button over the 'i' of Divine
                    rareSecretButton.style.left = '45%';
                    rareSecretButton.style.top = '20px';
                } else if (data.result === 'Secret') { // Added
                    secretRarityButton.classList.remove('d-none');
                    // Position the button appropriately
                    secretRarityButton.style.left = '45%';
                    secretRarityButton.style.top = '20px';
                }

                // Check for high-rarity rolls and apply special effects
                const highRarities = ['Hyperpigmentation', 'Divine', 'Mythical', 'Jack Attack', 'Ancient', 'Secret', 'Hax', 'Special', 'Chill']; 
                if (highRarities.includes(data.result)) {
                    // Create supernova effect
                    const supernova = document.createElement('div');
                    supernova.className = 'supernova';

                    // If the color is a gradient, handle it specially
                    if (data.color.startsWith('linear-gradient')) {
                        supernova.style.background = data.color;
                    } else {
                        supernova.style.background = `radial-gradient(circle, ${data.color}66 0%, ${data.color}33 50%, transparent 70%)`;
                    }

                    document.body.appendChild(supernova);

                    // Create special animation for Hyperpigmentation rarity
                    if (data.result === 'Hyperpigmentation') {
                        // Create main effect
                        const hyperEffect = document.createElement('div');
                        hyperEffect.className = 'hyperpigmentation-effect';

                        const hyperInner = document.createElement('div');
                        hyperInner.className = 'hyperpigmentation-inner';
                        hyperEffect.appendChild(hyperInner);

                        // Add particles for enhanced effect
                        const particlesContainer = document.createElement('div');
                        particlesContainer.className = 'hyperpigmentation-particles';

                        // Create multiple particles with random positions and animations
                        for (let i = 0; i < 20; i++) {
                            const particle = document.createElement('div');
                            particle.className = 'hyperpigmentation-particle';

                            // Random position
                            const randomX = Math.random() * 100;
                            const randomY = Math.random() * 100;
                            particle.style.left = `${randomX}%`;
                            particle.style.top = `${randomY}%`;

                            // Random size
                            const randomSize = Math.random() * 15 + 5;
                            particle.style.width = `${randomSize}px`;
                            particle.style.height = `${randomSize}px`;

                            // Random animation
                            const randomDuration = Math.random() * 3 + 2;
                            const randomDelay = Math.random() * 2;
                            particle.style.animation = `hyperpigmentation-pulse ${randomDuration}s infinite ${randomDelay}s`;

                            particlesContainer.appendChild(particle);
                        }

                        hyperEffect.appendChild(particlesContainer);
                        document.body.appendChild(hyperEffect);

                        // Add text flash effect
                        rarityText.style.textShadow = `0 0 15px ${data.color}, 0 0 25px ${data.color}, 0 0 35px ${data.color}`;

                        // Remove effect after animation
                        setTimeout(() => {
                            hyperEffect.remove();
                            rarityText.style.textShadow = '';
                        }, 5000); // Longer duration for this special effect
                    }
                    // Create special animation for Hax rarity
                    else if (data.result === 'Hax') {
                        const haxEffect = document.createElement('div');
                        haxEffect.className = 'hax-effect';

                        const haxInner = document.createElement('div');
                        haxInner.className = 'hax-inner';

                        haxEffect.appendChild(haxInner);
                        document.body.appendChild(haxEffect);

                        // Remove effect after animation
                        setTimeout(() => {
                            haxEffect.remove();
                        }, 3000);
                    }
                    // Create special animation for Special rarity
                    else if (data.result === 'Special') {
                        const specialEffect = document.createElement('div');
                        specialEffect.className = 'special-effect';

                        const specialInner = document.createElement('div');
                        specialInner.className = 'special-inner';

                        specialEffect.appendChild(specialInner);
                        document.body.appendChild(specialEffect);

                        // Remove effect after animation
                        setTimeout(() => {
                            specialEffect.remove();
                        }, 3000);
                    }
                    // Create special animation for Chill rarity
                    else if (data.result === 'Chill') {
                        const chillEffect = document.createElement('div');
                        chillEffect.className = 'chill-effect';

                        const chillInner = document.createElement('div');
                        chillInner.className = 'chill-inner';

                        chillEffect.appendChild(chillInner);
                        document.body.appendChild(chillEffect);

                        // Remove effect after animation
                        setTimeout(() => {
                            chillEffect.remove();
                        }, 3000);
                    }
                    // Create rotating star effect for Ancient or better rarities
                    else if (['Divine', 'Mythical', 'Jack Attack', 'Ancient', 'Secret'].includes(data.result)) {
                        const star = document.createElement('div');
                        star.className = 'star-effect';

                        const starInner = document.createElement('div');
                        starInner.className = 'star-inner';
                        starInner.style.backgroundColor = data.color;

                        star.appendChild(starInner);
                        document.body.appendChild(star);

                        // Remove star after animation
                        setTimeout(() => {
                            star.remove();
                        }, 2000);
                    }

                    // Remove supernova after animation
                    setTimeout(() => {
                        supernova.remove();
                    }, 2000); 

                    // Check if the result is LEBRON to trigger special animation
                    if (data.result === 'LEBRON') {
                        // Play the LEBRON animation
                        if (window.playLebronAnimation) {
                            window.playLebronAnimation(document.getElementById('result-display'));
                        }
                    } else {
                        // Add mythic animation to the text for other results
                        rarityText.classList.add('mythic-animation');
                    }

                    // Check if the result is Mythical to show the secret button
                    if (data.result === 'Mythical') {
                        // Show the mythical secret button
                        const mythicalButton = document.getElementById('mythical-secret-button');
                        if (mythicalButton) {
                            mythicalButton.classList.remove('d-none');
                        }
                    }

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

    // Handle rarity result text
    function updateRarityDisplay(result, color) {
        // Reset secret buttons
        secretButton.classList.add('d-none');
        goodSecretButton.classList.add('d-none');
        epicSecretButton.classList.add('d-none');
        epicSecretButton2.classList.add('d-none');
        divineSecretButton.classList.add('d-none');
        divineSecretButton2.classList.add('d-none');
        rareSecretButton.classList.add('d-none');
        legendarySecretButton.classList.add('d-none');
        legendarySecretButton2.classList.add('d-none');
        secretRarityButton.classList.add('d-none'); // Added

        rarityText.textContent = result;
        rarityText.style.color = color;

        // Show special buttons based on rarity
        if (result === 'Secret') {
            secretRarityButton.classList.remove('d-none');
        } else if (result === 'Good') {
            goodSecretButton.classList.remove('d-none');
        } else if (result === 'Epic') {
            epicSecretButton.classList.remove('d-none');
            epicSecretButton2.classList.remove('d-none');
        } else if (result === 'Divine') {
            divineSecretButton.classList.remove('d-none');
            divineSecretButton2.classList.remove('d-none');
        } else if (result === 'Legendary') {
            legendarySecretButton.classList.remove('d-none');
            legendarySecretButton2.classList.remove('d-none');
        } else if (result === 'Rare') {
            rareSecretButton.classList.remove('d-none');
        }
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

    // Legendary Button Functionality
    legendarySecretButton.addEventListener('click', async function() {
        try {
            const response = await fetch('/activate-legendary-luck');
            const data = await response.json();

            if (response.ok) {
                legendarySecretButton.disabled = true;
                legendarySecretButton.style.display = 'none';

                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = '🌟 10,000x luck bonus for next roll activated! 🌟';
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.remove();
                }, 3000);
            } else {
                console.error('Failed to activate legendary luck:', data.error);
            }
        } catch (error) {
            console.error('Error activating legendary luck:', error);
        }
    });

    legendarySecretButton2.addEventListener('click', async function() {
        try {
            const response = await fetch('/activate-legendary-luck2');
            const data = await response.json();

            if (response.ok) {
                legendarySecretButton2.disabled = true;
                legendarySecretButton2.style.display = 'none';

                const notification = document.createElement('div');
                notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = '⚡ 15,000x luck bonus for next roll activated! ⚡';
                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.remove();
                }, 3000);
            } else {
                console.error('Failed to activate legendary luck 2:', data.error);
            }
        } catch (error) {
            console.error('Error activating legendary luck 2:', error);
        }
    });

    //Secret Rarity Button Functionality
    if (secretRarityButton) {
        secretRarityButton.addEventListener('click', async function() {
            try {
                const response = await fetch('/activate-secret-luck');
                const data = await response.json();

                if (response.ok) {
                    secretRarityButton.disabled = true;
                    secretRarityButton.style.display = 'none';

                    const notification = document.createElement('div');
                    notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = '🍀 x500000 Luck boost activated for 1 roll! 🍀';
                    document.body.appendChild(notification);

                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                } else {
                    console.error('Failed to activate secret luck:', data.error);
                }
            } catch (error) {
                console.error('Error activating secret luck:', error);
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const rollButton = document.getElementById('roll-button');
    const autoRollButton = document.getElementById('auto-roll-button');
    const resultDisplay = document.getElementById('result-display');
    const rarityText = document.getElementById('rarity-text');
    const rollCountElement = document.getElementById('roll-count');
    const luckBonusElement = document.getElementById('luck-bonus');
    const spinnerElement = document.getElementById('spinner');
    const inventoryContainer = document.getElementById('inventory-items');
    const inventoryCountElement = document.getElementById('inventory-count');
    const coinCountElement = document.getElementById('coin-count');
    const sellAllButton = document.getElementById('sell-all-button');
    const buyLuckButton = document.getElementById('buy-luck-button');
    const buyMaxLuckButton = document.getElementById('buy-max-luck-button');
    const luckCostElement = document.getElementById('luck-cost');
    const toggleLuckButton = document.getElementById('toggle-luck-button');
    const luckStatusElement = document.getElementById('luck-status');
    const buyStorageButton = document.getElementById('buy-storage-button');
    const storageCostElement = document.getElementById('storage-cost');
    const inventoryCapacityElement = document.getElementById('inventory-capacity');
    const displayedCapacityElement = document.getElementById('displayed-capacity');
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
    const secretRarityButton = document.getElementById('secret-rarity-button');

    // State variables
    let isRolling = false;
    let autoRollInterval = null;

    // Add event listener for roll button
    if (rollButton) {
        rollButton.addEventListener('click', performRoll);
    }

    // Add event listener for auto roll button
    if (autoRollButton) {
        autoRollButton.addEventListener('click', toggleAutoRoll);
    }

    // Add event listener for sell all button
    if (sellAllButton) {
        sellAllButton.addEventListener('click', sellAllItems);
    }

    // Add event listener for buy luck button
    if (buyLuckButton) {
        buyLuckButton.addEventListener('click', buyLuck);
    }

    // Add event listener for buy max luck button
    if (buyMaxLuckButton) {
        buyMaxLuckButton.addEventListener('click', buyMaxLuck);
    }

    // Add event listener for toggle luck button
    if (toggleLuckButton) {
        toggleLuckButton.addEventListener('click', toggleLuck);
    }

    // Add event listener for buy storage button
    if (buyStorageButton) {
        buyStorageButton.addEventListener('click', buyStorage);
    }

    // Add event listeners to all auto-sell toggle buttons
    document.querySelectorAll('.auto-sell-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const rarity = this.getAttribute('data-rarity');
            toggleAutoSell(rarity, this);
        });
    });

    // Add event listeners to dynamic secret buttons
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

    if (secretRarityButton) {
        secretRarityButton.addEventListener('click', function() {
            activateSecretLuck();
        });
    }

    // Function to activate Secret luck
    function activateSecretLuck() {
        // Disable all secret buttons temporarily to prevent multiple activations
        const secretButtons = document.querySelectorAll('.secret-button');
        secretButtons.forEach(btn => {
            btn.disabled = true;
        });

        fetch('/activate-secret-luck')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    secretRarityButton.style.display = 'none';

                    const notification = document.createElement('div');
                    notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = '🍀 x500000 Luck boost activated for 1 roll!';
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 3000);
                } else {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error activating Secret luck:', error);
                alert('Failed to activate Secret luck');
            });
    }

    // Function to handle the roll
    function performRoll() {
        if (isRolling) return;

        isRolling = true;
        rarityText.textContent = 'Rolling...';
        rarityText.style.color = '';
        rarityText.className = '';
        spinnerElement.classList.remove('d-none');

        fetch('/roll')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    // Display error message
                    rarityText.textContent = data.error;
                    rarityText.style.color = 'red';
                    isRolling = false;
                    spinnerElement.classList.add('d-none');
                    return;
                }

                // Update roll count and luck bonus
                rollCountElement.textContent = data.roll_count;
                luckBonusElement.textContent = data.luck_bonus + 'x';

                // Enable auto roll if roll count >= 50
                if (autoRollButton && data.can_auto_roll) {
                    autoRollButton.classList.remove('disabled');
                    autoRollButton.disabled = false;
                    autoRollButton.innerHTML = '<i class="fas fa-sync-alt me-2"></i>Auto Roll';
                }

                // Update coins if auto-sold
                if (data.auto_sold) {
                    coinCountElement.textContent = data.coins;

                    // Show auto-sell message
                    rarityText.textContent = `${data.result} (Auto-Sold for ${data.auto_sell_value} coins)`;
                    rarityText.style.color = data.color;

                    // Apply visual effect after a delay
                    setTimeout(() => {
                        spinnerElement.classList.add('d-none');
                        playRarityAnimation(data.result, data.color);
                        isRolling = false;
                    }, 500);

                    return;
                }

                // Update inventory display with the new item
                updateInventory(data.inventory);

                // Show rarity result after a delay
                setTimeout(() => {
                    spinnerElement.classList.add('d-none');

                    // Special LEBRON animation
                    if (data.result === 'LEBRON' && window.playLebronAnimation) {
                        window.playLebronAnimation(resultDisplay);
                    } else {
                        // Regular rarity display
                        rarityText.textContent = data.result;
                        rarityText.style.color = data.color;
                        playRarityAnimation(data.result, data.color);
                    }

                    isRolling = false;
                }, 500);

                // Show secret buttons based on rarity
                showSecretButton(data.result);
            })
            .catch(error => {
                console.error('Error rolling:', error);
                rarityText.textContent = 'Error! Try again.';
                rarityText.style.color = 'red';
                isRolling = false;
                spinnerElement.classList.add('d-none');
            });
    }

    // Function to toggle auto rolling
    function toggleAutoRoll() {
        if (autoRollInterval) {
            // Stop auto rolling
            clearInterval(autoRollInterval);
            autoRollInterval = null;
            autoRollButton.textContent = 'Start Auto Roll';
            autoRollButton.classList.remove('btn-danger');
            autoRollButton.classList.add('btn-secondary');
        } else {
            // Start auto rolling
            autoRollButton.textContent = 'Stop Auto Roll';
            autoRollButton.classList.remove('btn-secondary');
            autoRollButton.classList.add('btn-danger');

            // Perform first roll immediately
            if (!isRolling) performRoll();

            // Set interval for continuous rolling (every 2 seconds)
            autoRollInterval = setInterval(() => {
                if (!isRolling) performRoll();
            }, 2000);
        }
    }

    // Function to update the inventory display
    function updateInventory(inventory) {
        // Clear current inventory
        inventoryContainer.innerHTML = '';

        // Update inventory count
        inventoryCountElement.textContent = inventory.length;

        // Add each item to the inventory display
        inventory.forEach(rarity => {
            const value = rarityValues[rarity] || 0;

            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.setAttribute('data-rarity', rarity);

            itemElement.innerHTML = `
                <span class="badge" style="background-color: ${rarityColors[rarity] || '#000'}">
                    ${rarity}
                </span>
                <button class="btn btn-sm btn-outline-warning sell-button" data-rarity="${rarity}" data-value="${value}">
                    Sell (${value} <i class="fas fa-coins"></i>)
                </button>
            `;

            inventoryContainer.appendChild(itemElement);

            // Add event listener for the sell button
            const sellButton = itemElement.querySelector('.sell-button');
            sellButton.addEventListener('click', function() {
                const rarity = this.getAttribute('data-rarity');
                sellItem(rarity);
            });
        });
    }

    // Function to sell an item
    function sellItem(rarity) {
        fetch(`/sell/${rarity}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Update coins
                coinCountElement.textContent = data.coins;

                // Update inventory
                updateInventory(data.inventory);

                // Show success message
                showMessage(`Sold ${rarity} for ${data.value} coins!`, 'success');
            })
            .catch(error => {
                console.error('Error selling item:', error);
                alert('Failed to sell item');
            });
    }

    // Function to sell all items
    function sellAllItems() {
        fetch('/sell-all')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Update coins
                coinCountElement.textContent = data.coins;

                // Update inventory
                updateInventory(data.inventory);

                // Show success message
                showMessage(`Sold all items for ${data.value} coins!`, 'success');
            })
            .catch(error => {
                console.error('Error selling all items:', error);
                alert('Failed to sell all items');
            });
    }

    // Function to buy luck
    function buyLuck() {
        fetch('/buy-luck')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Update coins
                coinCountElement.textContent = data.coins;

                // Update luck display
                luckBonusElement.textContent = data.total_luck + 'x';

                // Update cost for next purchase
                luckCostElement.textContent = data.next_cost;

                // Show success message
                showMessage(`Purchased luck boost! New luck: ${data.total_luck}x`, 'success');
            })
            .catch(error => {
                console.error('Error buying luck:', error);
                alert('Failed to buy luck');
            });
    }

    // Function to buy max luck
    function buyMaxLuck() {
        fetch('/buy-max-luck')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Update coins
                coinCountElement.textContent = data.coins;

                // Update luck display
                luckBonusElement.textContent = data.total_luck + 'x';

                // Update cost for next purchase
                luckCostElement.textContent = data.next_cost;

                // Show success message
                showMessage(`Purchased ${data.levels_purchased} luck levels for ${data.total_spent} coins! New luck: ${data.total_luck}x`, 'success');
            })
            .catch(error => {
                console.error('Error buying max luck:', error);
                alert('Failed to buy max luck');
            });
    }

    // Function to toggle luck
    function toggleLuck() {
        fetch('/toggle-luck')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Update luck display
                luckBonusElement.textContent = data.total_luck + 'x';

                // Update status badge
                if (data.luck_active) {
                    luckStatusElement.textContent = 'ON';
                    luckStatusElement.className = 'badge bg-success';
                } else {
                    luckStatusElement.textContent = 'OFF';
                    luckStatusElement.className = 'badge bg-danger';
                }
            })
            .catch(error => {
                console.error('Error toggling luck:', error);
                alert('Failed to toggle luck');
            });
    }

    // Function to buy storage upgrade
    function buyStorage() {
        fetch('/buy-storage')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Update coins
                coinCountElement.textContent = data.coins;

                // Update inventory capacity display
                inventoryCapacityElement.textContent = data.inventory_capacity;
                displayedCapacityElement.textContent = data.inventory_capacity;

                // Update cost for next purchase
                storageCostElement.textContent = data.next_cost;

                // Show success message
                showMessage(`Purchased storage upgrade! New capacity: ${data.inventory_capacity} slots`, 'success');
            })
            .catch(error => {
                console.error('Error buying storage:', error);
                alert('Failed to buy storage');
            });
    }

    // Function to toggle auto-sell for a specific rarity
    function toggleAutoSell(rarity, button) {
        fetch(`/toggle-auto-sell/${rarity}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    return;
                }

                // Update button appearance
                if (data.auto_sell_enabled) {
                    button.classList.remove('btn-outline-secondary');
                    button.classList.add('btn-success');
                    button.innerHTML = '<i class="fas fa-check-circle"></i> ON';
                } else {
                    button.classList.remove('btn-success');
                    button.classList.add('btn-outline-secondary');
                    button.innerHTML = '<i class="fas fa-times-circle"></i> OFF';
                }
            })
            .catch(error => {
                console.error('Error toggling auto-sell:', error);
                alert('Failed to toggle auto-sell');
            });
    }

    // Function to show secret button based on rarity
    function showSecretButton(rarity) {
        if (rarity === 'Uncommon') {
            secretButton.classList.remove('d-none');
        } else if (rarity === 'Good') {
            goodSecretButton.classList.remove('d-none');
        } else if (rarity === 'Epic') {
            epicSecretButton.classList.remove('d-none');
            epicSecretButton2.classList.remove('d-none');
        } else if (rarity === 'Divine') {
            divineSecretButton.classList.remove('d-none');
            divineSecretButton2.classList.remove('d-none');
        } else if (rarity === 'Rare') {
            rareSecretButton.classList.remove('d-none');
        } else if (rarity === 'Legendary') {
            legendarySecretButton.classList.remove('d-none');
            legendarySecretButton2.classList.remove('d-none');
        } else if (rarity === 'Mythical') {
            mythicalSecretButton.classList.remove('d-none');
        } else if (rarity === 'Secret') {
            secretRarityButton.classList.remove('d-none');
        }
    }

    // Function to activate super luck button
    function activateSuperLuck(buttonType) {
        fetch(`/activate-super-luck/${buttonType}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(`Super luck activated for ${buttonType}! Your luck will be multiplied for the next 10 seconds!`);
                    if (buttonType === 'uncommon') {
                        secretButton.classList.add('d-none');
                    } else if (buttonType === 'good') {
                        goodSecretButton.classList.add('d-none');
                    } else if (buttonType === 'epic') {
                        epicSecretButton.classList.add('d-none');
                    } else if (buttonType === 'epic2') {
                        epicSecretButton2.classList.add('d-none');
                    }
                }
            })
            .catch(error => {
                console.error('Error activating super luck:', error);
                alert('Failed to activate super luck');
            });
    }

    // Function to activate divine luck
    function activateDivineLuck() {
        fetch('/activate-divine-luck')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Divine Luck activated! Your luck has been permanently increased by 50!');
                    divineSecretButton.classList.add('d-none');
                }
            })
            .catch(error => {
                console.error('Error activating divine luck:', error);
                alert('Failed to activate divine luck');
            });
    }

    // Function to activate divine luck 2
    function activateDivineLuck2() {
        fetch('/activate-divine-luck2')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Divine Luck 2 activated! Your luck has been permanently increased by 75!');
                    divineSecretButton2.classList.add('d-none');
                }
            })
            .catch(error => {
                console.error('Error activating divine luck 2:', error);
                alert('Failed to activate divine luck 2');
            });
    }

    // Function to activate rare luck
    function activateRareLuck() {
        fetch('/activate-rare-luck')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Rare Luck activated! Your next roll will have a x2500 luck bonus!');
                    rareSecretButton.classList.add('d-none');
                }
            })
            .catch(error => {
                console.error('Error activating rare luck:', error);
                alert('Failed to activate rare luck');
            });
    }

    // Function to activate legendary luck
    function activateLegendaryLuck() {
        fetch('/activate-legendary-luck')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Legendary Luck activated! Your next roll will have a x10000 luck bonus!');
                    legendarySecretButton.classList.add('d-none');
                }
            })
            .catch(error => {
                console.error('Error activating legendary luck:', error);
                alert('Failed to activate legendary luck');
            });
    }

    // Function to activate legendary luck 2
    function activateLegendaryLuck2() {
        fetch('/activate-legendary-luck2')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Legendary Luck 2 activated! Your next roll will have a x15000 luck bonus!');
                    legendarySecretButton2.classList.add('d-none');
                }
            })
            .catch(error => {
                console.error('Error activating legendary luck 2:', error);
                alert('Failed to activate legendary luck 2');
            });
    }

    // Function to activate mythical luck
    function activateMythicalLuck() {
        fetch('/activate-mythical-luck')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Mythical Luck activated! Your next roll will have a x500000 luck bonus!');
                    mythicalSecretButton.classList.add('d-none');
                }
            })
            .catch(error => {
                console.error('Error activating mythical luck:', error);
                alert('Failed to activate mythical luck');
            });
    }

    // Helper function to show a message
    function showMessage(message, type = 'info') {
        const alertEl = document.createElement('div');
        alertEl.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
        alertEl.textContent = message;
        document.body.appendChild(alertEl);

        // Remove after 3 seconds
        setTimeout(() => {
            alertEl.remove();
        }, 3000);
    }

    // Function to play animations based on rarity
    function playRarityAnimation(rarity, color) {
        // Add flash effect for high-tier rarities
        if (['Ancient', 'Jack Attack', 'Special', 'Secret', 'Hax', 'Hyperpigmentation', 'LEBRON'].includes(rarity)) {
            const flash = document.createElement('div');
            flash.className = 'screen-flash';
            document.body.appendChild(flash);

            setTimeout(() => {
                flash.remove();
            }, 500);
        }

        // Add appropriate animation class
        if (['Mythical', 'Divine', 'Legendary'].includes(rarity)) {
            rarityText.classList.add('mythic-animation');

            // Create the star effect for these rarities
            const starEffect = document.createElement('div');
            starEffect.className = 'star-effect';

            const starInner = document.createElement('div');
            starInner.className = 'star-inner';
            starInner.style.backgroundColor = color;

            starEffect.appendChild(starInner);
            document.body.appendChild(starEffect);

            // Remove effect after animation
            setTimeout(() => {
                starEffect.remove();
            }, 3000);
        } else {
            rarityText.classList.add('roll-animation');
        }
    }
});