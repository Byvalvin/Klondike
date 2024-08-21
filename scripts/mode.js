//mode.js

const themeToggleButton = document.getElementById('theme-toggle');

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
