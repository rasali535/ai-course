/**
 * LearnFlow Header Helper
 * Dynamically updates the header based on authentication state.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // We assume auth.js is loaded before this script
    if (typeof auth === 'undefined') {
        console.warn('auth.js not loaded. Header will remain static.');
        return;
    }

    const user = await auth.getMe();
    if (user) {
        updatePublicHeader(user);
    }
});

function updatePublicHeader(user) {
    // Find the auth buttons container in the header
    // In most pages, it's the last div in the header's container
    const header = document.querySelector('header .max-w-7xl');
    if (!header) return;

    const authContainer = header.querySelector('.flex.items-center.space-x-4');
    if (!authContainer) return;

    // Check if we are on a page that already has a dashboard button (like course-builder)
    if (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('course-builder.html')) {
        return;
    }

    // Replace "Sign in" and "Start free trial" with "Dashboard" and profile initial
    authContainer.innerHTML = `
        <a href="dashboard.html" class="text-sm font-bold text-gray-700 hover:text-blue-600 transition">Dashboard</a>
        <div class="w-10 h-10 rounded-full gradient-border flex items-center justify-center text-white font-bold cursor-pointer" onclick="window.location.href='dashboard.html'">
            ${user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
        </div>
    `;
}
