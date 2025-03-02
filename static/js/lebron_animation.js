
// LEBRON Animation Effect
document.addEventListener('DOMContentLoaded', function() {
  // Function to create explosion effect
  function createExplosion(text, parentElement) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion-effect';
    explosion.textContent = text;
    
    // Random position within the result display area
    explosion.style.left = Math.random() * 80 + 10 + '%';
    explosion.style.top = Math.random() * 80 + 10 + '%';
    
    parentElement.appendChild(explosion);
    
    // Remove explosion after animation completes
    setTimeout(() => {
      explosion.remove();
    }, 1000);
  }
  
  // Add this function to the global scope so we can call it from roller.js
  window.playLebronAnimation = function(resultDisplay) {
    // Clear any existing content first
    const originalContent = resultDisplay.innerHTML;
    resultDisplay.innerHTML = '';
    
    // Initial LEBRON text
    const lebronText = document.createElement('h1');
    lebronText.className = 'lebron-text';
    lebronText.textContent = "LEBRONNNN";
    resultDisplay.appendChild(lebronText);
    
    // Create first explosion
    createExplosion("💥", resultDisplay);
    
    // Sequence of explosions with "boom" text
    setTimeout(() => {
      createExplosion("b 💥", resultDisplay);
      
      setTimeout(() => {
        createExplosion("b 💥", resultDisplay);
        
        setTimeout(() => {
          createExplosion("b 💥", resultDisplay);
          
          setTimeout(() => {
            // Final explosion with "boom!"
            createExplosion("boom! 💥", resultDisplay);
            
            // Reset display after animation
            setTimeout(() => {
              resultDisplay.innerHTML = originalContent;
              const rarityText = document.getElementById('rarity-text');
              if (rarityText) {
                rarityText.textContent = "LEBRON";
                rarityText.style.color = "#6A0DAD";
                rarityText.classList.add('lebron-animation');
              }
            }, 500);
          }, 200);
        }, 200);
      }, 200);
    }, 1000);
  };
});
