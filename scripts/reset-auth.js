import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

const supabaseUrl = 'https://ucspfnzhoepaxvpigvfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc3Bmbnpob2VwYXh2cGlndmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MzU4MDcsImV4cCI6MjA0ODIxMTgwN30.iw7m3PDLJByvFGZTXsmbEDPxkP28_RYkNh9egJ5BXY4'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

const urlParams = new URLSearchParams(window.location.search);
const accessToken = urlParams.get('access_token');
const email = urlParams.get('email'); 
console.log('Access Token:', accessToken); 
console.log('Email:', email); 

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

function validate() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const message = document.getElementById('message');
    if (password !== confirmPassword) {
        message.hidden = false;
        message.style.color = 'red';
        message.innerHTML = 'Passwords do not match';
        return false;
    } else {
        message.hidden = true;
        return true;
    }
}

const resetSubmit = document.getElementById('submit');
resetSubmit.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const newPassword = document.getElementById('signup-password').value;

    if (!accessToken) {
        showMessagePopup('Invalid or expired access token.', '../index.html');
        return;
    }

   try {

        const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            token: accessToken, 
            type: 'email', 
            email: email, 
        });

        if (verifyError) {
            console.error('Error verifying OTP:', verifyError);
            showMessagePopup('Invalid or expired token. Please try again.');
            return;
        }

        console.log('OTP verified successfully:', verifyData);

        const { user, error: updateError } = await supabase.auth.updateUser({
            password: newPassword, 
        });

        if (updateError) {
            console.error('Error updating password:', updateError);
            showMessagePopup('Error resetting password. Please try again.');
        } else {
            console.log('Password updated successfully:', user);
            showMessagePopup('Password has been reset successfully!', '../index.html');
        }

    } catch (error) {
        console.error('Unexpected error during password reset:', error);
        showMessagePopup('An unexpected error occurred. Please try again.', '../index.html');
    }
});
