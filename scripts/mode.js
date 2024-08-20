//mode.js

const themeToggleButton = document.getElementById('theme-toggle');

function applyThemeBasedOnTime() {
    const currentHour = new Date().getHours();
    if (currentHour >= 17) { // 17 represents 5 PM
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

// Apply theme based on time
applyThemeBasedOnTime();

// Toggle theme manually
themeToggleButton.addEventListener('click', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});
