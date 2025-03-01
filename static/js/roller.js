document.addEventListener('DOMContentLoaded', function() {
    const rollButton = document.getElementById('roll-button');
    const rarityText = document.getElementById('rarity-text');
    const spinner = document.getElementById('spinner');

    rollButton.addEventListener('click', async function() {
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

            // Remove animation class after it completes
            setTimeout(() => {
                rarityText.classList.remove('roll-animation');
            }, 500);

        } catch (error) {
            console.error('Error:', error);
            rarityText.textContent = 'Error occurred!';
            rarityText.style.color = 'red';
        }

        // Re-enable button
        setTimeout(() => {
            rollButton.disabled = false;
        }, 1000);
    });
});
