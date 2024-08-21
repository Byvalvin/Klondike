
//mode.js

const themeButtonID = 'card-logo';
//logo
const logoContainer = document.getElementById(themeButtonID);

// Create a card element
const cardElement = document.createElement('div');
cardElement.className = 'card'; // Use the same class as for cards

// Set inner HTML for the card
cardElement.innerHTML = `
    <div class="card-symbol s">♠</div>
    <div class="card-content">A</div>
`;
logoContainer.appendChild(cardElement); // Add the card element to the logo container


const themeToggleButton = document.getElementById(themeButtonID);

function applyThemeBasedOnTime() {
    const currentHour = new Date().getHours();
    console.log(`Current Hour: ${currentHour}`); // Debugging line
    if (currentHour >= 17) { // 17 represents 5 PM
        console.log('Setting dark theme'); // Debugging line
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        console.log('Setting light theme'); // Debugging line
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }
}


// Apply theme based on time
applyThemeBasedOnTime();

// Toggle theme manually
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        let currentTheme = document.body.getAttribute('data-theme');
        console.log(`Current Theme: ${currentTheme}`); // Debugging line
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        console.log(`New Theme: ${newTheme}`); // Debugging line
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
} else {
    console.warn('Theme toggle button not found.');
}
