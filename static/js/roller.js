document.addEventListener('DOMContentLoaded', function() {
    const rollButton = document.getElementById('roll-button');
    const autoRollButton = document.getElementById('auto-roll-button');
    const rarityText = document.getElementById('rarity-text');
    const spinner = document.getElementById('spinner');
    const rollCountDisplay = document.getElementById('roll-count');
    const luckBonusDisplay = document.getElementById('luck-bonus');

    let isAutoRolling = false;
    let autoRollInterval;

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