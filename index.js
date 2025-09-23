// Script to initialize Typed.js
document.addEventListener("DOMContentLoaded", function() {
    new Typed('#typed-element', {
        strings: ['Python Developer', 'Data Analyst', 'AI/ML Enthusiast'],
        typeSpeed: 60,
        loop: true,
        backDelay: 1500,
        backSpeed: 40,
    });
});

// Script for Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Function to set the theme and store it in local storage
function setTheme(theme) {
    if (theme === 'dark') {
        // Add dark class to html and body, and save preference
        htmlElement.classList.add('dark');
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        // Remove dark class, add light, and save preference
        htmlElement.classList.remove('dark');
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        localStorage.setItem('theme', 'light');
    }
}

// Function to update the icons based on the current theme
function updateIcons() {
    const isDark = htmlElement.classList.contains('dark');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    // Toggle icon visibility based on the theme
    if (isDark) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

// Check for saved theme preference or system preference on page load
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');



// Set the initial theme and update icons
setTheme(initialTheme);
updateIcons();

// Event listener for the theme toggle button
themeToggle.addEventListener('click', () => {
    // Determine the new theme by toggling the current one
    const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
    setTheme(newTheme);
    updateIcons();
});

function changeTheme(theme) {
    setTheme(theme);
    updateIcons();
}
// Script for Smooth Scrolling and Mobile Menu Toggle
// Smooth Scrolling Script
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Close the mobile menu if it's open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
        }

        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mobile Menu Toggle Script
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});
