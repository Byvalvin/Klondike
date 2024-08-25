// mode.js

const themeButtonID = 'card-logo';

// Create and style a card element for the logo
const logoContainer = document.getElementById(themeButtonID);
const cardElement = document.createElement('div');
cardElement.className = 'card'; // Use the same class as for cards
cardElement.innerHTML = `
    <div class="card-symbol s">♠</div>
    <div class="card-content">A</div>
`;
logoContainer.appendChild(cardElement);

// Light or Dark Mode
function applyThemeBasedOnTime() {
    const currentHour = new Date().getHours();
    console.log(`Current Hour: ${currentHour}`); // Debugging line

    // Use more specific times for theme changes if desired
    if (currentHour >= 17) { // After 5 PM
        console.log('Setting dark theme'); // Debugging line
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        console.log('Setting light theme'); // Debugging line
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }
}

// Apply theme based on the time of day
applyThemeBasedOnTime();

// Toggle theme manually
const themeToggleButton = document.getElementById(themeButtonID);
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        let currentTheme = document.body.getAttribute('data-theme');
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Optional: Add visual feedback or animation here
        console.log(`Theme toggled to: ${newTheme}`); // Debugging line
    });
} else {
    console.warn('Theme toggle button not found.');
}

