document.addEventListener('DOMContentLoaded', function() {
    const rollButton = document.getElementById('roll-button');
    const autoRollButton = document.getElementById('auto-roll-button');
    const rarityText = document.getElementById('rarity-text');
    const spinner = document.getElementById('spinner');
    const rollCountDisplay = document.getElementById('roll-count');
    const luckBonusDisplay = document.getElementById('luck-bonus');
    const secretButton = document.getElementById('secret-button');

    let isAutoRolling = false;
    let autoRollInterval;

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

    async function performRoll() {
        // Disable button and show spinner
        rollButton.disabled = true;
        rarityText.classList.add('d-none');
        spinner.classList.remove('d-none');

        try {
            const response = await fetch('/roll');
            const data = await response.json();

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
                // Add a temporary visual indicator
                const notification = document.createElement('div');
                notification.className = 'alert alert-warning position-fixed top-0 start-50 translate-middle-x mt-3';
                notification.textContent = '🎯 Secret button appeared above the Uncommon text!';
                document.body.appendChild(notification);
                setTimeout(() => {
                    notification.remove();
                }, 3000);
            } else {
                secretButton.classList.add('d-none');
            }

            // Update stats
            rollCountDisplay.textContent = data.roll_count;
            luckBonusDisplay.textContent = data.luck_bonus + 'x';

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
            rarityText.textContent = 'Error occurred!';
            rarityText.style.color = 'red';
            stopAutoRoll();
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