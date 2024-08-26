// gameHistory.js


  const gameHistory = document.getElementById('game-history');
  const gameHistoryButton = document.getElementById('toggle-game-history');
  
  // Load game history from localStorage
  function loadGameHistory() {
      const history = JSON.parse(localStorage.getItem('gameHistory')) || [];
      const tableBody = gameHistory.querySelector('tbody');
      tableBody.innerHTML = ''; // Clear existing entries

      history.forEach((entry) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${entry.difficulty}</td>
              <td>${entry.params.pileOrdering}, ${entry.params.numberOfPiles}, ${entry.params.suitOrdering}, ${entry.params.timed}</td>
          `;
          tableBody.appendChild(row);
      });
  }

  // Toggle game history visibility
  gameHistoryButton.addEventListener('click', () => {
      gameHistory.classList.toggle('hidden');
  });

  // Initialize
  loadGameHistory();


// Updated function to add a game to history
function addGameToHistory(difficultyName, params) {
    const history = JSON.parse(localStorage.getItem('gameHistory')) || [];
    history.push({ difficulty: difficultyName, params });
    localStorage.setItem('gameHistory', JSON.stringify(history));
    // Update the table
    loadGameHistory();
}
