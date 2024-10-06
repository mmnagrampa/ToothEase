document.addEventListener('DOMContentLoaded', function() {
    // Toggle profile dropdown
    const profileIcon = document.querySelector('.profile-icon');
    const profileDropdown = document.getElementById('subMenu');

    profileIcon.addEventListener('click', function() {
        profileDropdown.classList.toggle('active');
    });
});