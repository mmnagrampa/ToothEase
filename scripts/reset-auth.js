import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

// Supabase credentials
const supabaseUrl = 'https://ucspfnzhoepaxvpigvfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc3Bmbnpob2VwYXh2cGlndmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MzU4MDcsImV4cCI6MjA0ODIxMTgwN30.iw7m3PDLJByvFGZTXsmbEDPxkP28_RYkNh9egJ5BXY4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Extract the access token from the query string
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');
console.log("Access Token:", accessToken);

// If no access token is present, show error and redirect
if (!accessToken) {
    alert("Invalid or expired reset token.");
    window.location.href = '../index.html';
}

// Validation for passwords
function validate(event) {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const message = document.getElementById('message');
    if (password !== confirmPassword) {
        message.hidden = false;
        message.style.color = 'red';
        message.innerHTML = 'Passwords do not match.';
        event.preventDefault();
    } else {
        message.hidden = true;
    }
}

// Show message popup
function showMessagePopup(message, redirectUrl = null) {
    const overlay = document.getElementById('popup-overlay');
    const popupBox = document.getElementById('popup-box');
    const popupMessage = document.getElementById('popup-message');

    popupMessage.textContent = message;
    overlay.style.display = 'block';
    popupBox.style.display = 'block';

    setTimeout(() => {
        overlay.style.display = 'none';
        popupBox.style.display = 'none';
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, 3000);
}

// Reset password on form submission
const resetSubmit = document.getElementById('submit');
resetSubmit.addEventListener('click', async (e) => {
    e.preventDefault();
    validate(e);

    const newPassword = document.getElementById('signup-password').value;

    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        }, {
            access_token: accessToken,
        });

        if (error) {
            console.error("Error resetting password:", error.message);
            showMessagePopup('Error resetting password.');
        } else {
            showMessagePopup('Password has been reset successfully!', '../index.html');
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        showMessagePopup('Unexpected error resetting password.');
    }
});
