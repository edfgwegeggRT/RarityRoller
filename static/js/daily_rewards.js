
document.addEventListener('DOMContentLoaded', function() {
    const claimButton = document.getElementById('claim-daily-reward');
    const dailyRewardStatus = document.getElementById('daily-reward-status');
    const dailyRewardResult = document.getElementById('daily-reward-result');
    const dailyRewardRarity = document.getElementById('daily-reward-rarity');
    const dailyRewardLuck = document.getElementById('daily-reward-luck');
    const dailyCountdown = document.getElementById('daily-countdown');
    
    // Handle daily reward claim
    if (claimButton) {
        claimButton.addEventListener('click', async function() {
            try {
                const response = await fetch('/claim-daily-reward');
                const data = await response.json();
                
                if (data.success) {
                    // Update UI to show result
                    dailyRewardRarity.textContent = data.result;
                    dailyRewardRarity.style.color = data.color;
                    dailyRewardLuck.textContent = data.luck_applied.toLocaleString();
                    
                    // Hide claim button, show result
                    dailyRewardStatus.innerHTML = '<p>Next reward available in 24h</p>';
                    dailyRewardResult.style.display = 'block';
                    
                    // Update inventory display if needed
                    if (window.updateInventoryDisplay) {
                        window.updateInventoryDisplay(data.inventory);
                    }
                    
                    // Show a notification
                    const notification = document.createElement('div');
                    notification.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                    notification.textContent = `🎁 Daily reward claimed! You got a ${data.result} rarity!`;
                    document.body.appendChild(notification);
                    
                    setTimeout(() => {
                        notification.remove();
                    }, 3000);
                    
                } else if (data.error) {
                    alert(data.error);
                }
            } catch (error) {
                console.error('Error claiming daily reward:', error);
            }
        });
    }
    
    // Update countdown timer if it exists
    if (dailyCountdown) {
        // Refresh countdown every minute
        setInterval(async function() {
            try {
                const response = await fetch('/check-daily-reward');
                const data = await response.json();
                
                if (data.can_claim) {
                    // User can now claim, refresh the page to show claim button
                    window.location.reload();
                } else {
                    // Update countdown
                    dailyCountdown.textContent = data.time_until_next;
                }
            } catch (error) {
                console.error('Error checking daily reward status:', error);
            }
        }, 60000); // Check every minute
    }
});
