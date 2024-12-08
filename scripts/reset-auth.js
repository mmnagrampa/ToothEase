import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

// Supabase credentials
const supabaseUrl = 'https://ucspfnzhoepaxvpigvfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc3Bmbnpob2VwYXh2cGlndmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MzU4MDcsImV4cCI6MjA0ODIxMTgwN30.iw7m3PDLJByvFGZTXsmbEDPxkP28_RYkNh9egJ5BXY4';
const supabase = createClient(supabaseUrl, supabaseKey);

// Extract the access token from the URL
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('token');

// Validate the token
if (!accessToken) {
    showMessagePopup('Invalid or expired reset token.', '../index.html');
}

console.log("Access Token:", accessToken);

function validate(event) {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const message = document.getElementById('message');
    if (password !== confirmPassword) {
        message.hidden = false;
        message.style.color = 'red';
        message.innerHTML = 'Passwords do not match';
        event.preventDefault();
    } else {
        message.hidden = true;
        return;
    }
}

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

const resetSubmit = document.getElementById('submit');
resetSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    validate();
    const newPassword = document.getElementById('signup-password').value;

    // Verify the password reset token
    supabase.auth
        .verifyPasswordResetToken(accessToken)
        .then(({ data, error }) => {
            if (error) {
                showMessagePopup('Invalid or expired reset token.', '../index.html');
            } else {
                // Proceed with password reset
                supabase.auth
                    .updateUser({ password: newPassword })
                    .then(() => {
                        showMessagePopup('Password has been reset successfully!', '../index.html');
                    })
                    .catch((error) => {
                        console.error("Error resetting password:", error);
                        showMessagePopup('Error resetting password.');
                    });
            }
        });
}); 