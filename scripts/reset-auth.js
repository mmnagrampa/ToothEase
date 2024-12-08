import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

// Supabase credentials
const supabaseUrl = 'https://ucspfnzhoepaxvpigvfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc3Bmbnpob2VwYXh2cGlndmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MzU4MDcsImV4cCI6MjA0ODIxMTgwN30.iw7m3PDLJByvFGZTXsmbEDPxkP28_RYkNh9egJ5BXY4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Extract the reset token from the URL
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token'); // Use access_token as per the URL
console.log('Access Token:', accessToken); // Debugging

// Function to display messages
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

// Function to validate password and confirmation
function validate() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const message = document.getElementById('message');
    if (password !== confirmPassword) {
        message.hidden = false;
        message.style.color = 'red';
        message.innerHTML = 'Passwords do not match';
        return false; // Prevents further processing
    } else {
        message.hidden = true;
        return true;
    }
}

// Submit button event listener
const resetSubmit = document.getElementById('submit');
resetSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    // Validate the password confirmation
    if (!validate()) return;

    const newPassword = document.getElementById('signup-password').value;

    if (!accessToken) {
        showMessagePopup('Invalid or expired access token.', '../index.html');
        return;
    }

    try {
        // Set the session using the access token
        const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: null, // Pass null as refresh_token is not available
        });

        if (sessionError) {
            console.error('Error setting session:', sessionError);
            showMessagePopup('Failed to authenticate. Please try again.', '../index.html');
            return;
        }

        // Update the user password
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            console.error('Error resetting password:', error);
            showMessagePopup('Error resetting password. Please try again.');
        } else {
            console.log('Password reset successful:', data);
            showMessagePopup('Password has been reset successfully!', '../index.html');
        }
    } catch (error) {
        console.error('Unexpected error during password reset:', error);
        showMessagePopup('An unexpected error occurred. Please try again.', '../index.html');
    }
});
