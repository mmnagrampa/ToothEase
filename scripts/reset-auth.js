import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.19.0/+esm';


// Supabase credentials
const supabaseUrl = 'https://ucspfnzhoepaxvpigvfm.supabase.co';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Extract the reset token from the URL
const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token'); // Use `access_token` from the URL
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
        // Use the access_token directly to reset the password
        const { data, error } = await supabase.auth.verifyOTP({
            type: 'recovery',
            token: accessToken, // The access token from the URL
            password: newPassword, // The new password to set
        });

        if (error) {
            console.error('Error resetting password:', error);

            // Check for specific error about reusing the same password
            if (error.message.includes('New password should be different from the old password')) {
                showMessagePopup('The new password cannot be the same as the old password. Please choose a different password.');
            } else {
                showMessagePopup('Error resetting password. Please try again.');
            }

            // Prevent further processing due to error
            return; // Exit the function early
        }

        // If no error, proceed to success handling
        console.log('Password reset successful:', data);
        showMessagePopup('Password has been reset successfully!', '../index.html');

    } catch (error) {
        console.error('Unexpected error during password reset:', error);
        showMessagePopup('An unexpected error occurred. Please try again.', '../index.html');
    }
});
