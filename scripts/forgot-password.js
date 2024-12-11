import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

const supabaseUrl = 'https://ucspfnzhoepaxvpigvfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc3Bmbnpob2VwYXh2cGlndmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MzU4MDcsImV4cCI6MjA0ODIxMTgwN30.iw7m3PDLJByvFGZTXsmbEDPxkP28_RYkNh9egJ5BXY4';
const supabase = createClient(supabaseUrl, supabaseKey);

function showMessagePopup(message, reload = false, redirectUrl = null) {
    const overlay = document.getElementById('popup-overlay');
    const popupBox = document.getElementById('popup-box');
    const popupMessage = document.getElementById('popup-message');

    popupMessage.textContent = message;
    overlay.style.display = 'block';
    popupBox.style.display = 'block';

    setTimeout(() => {
        overlay.style.display = 'none';
        popupBox.style.display = 'none';
        if (reload) {
            window.location.reload();
        } else if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, 3000);
}

const forgotPass = document.getElementById('submit');
const errorMessage = document.getElementById('error-message');
forgotPass.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://toothease.vercel.app/views/resetpassword.html'
        });

        if (error) {
            throw error;
        }
        
        showMessagePopup('An email has been sent to reset your password.', false, '../index.html');
    } catch (error) {
        console.error('Error sending reset email:', error.message);
        errorMessage.hidden = false;
        errorMessage.style.color = 'red';
        errorMessage.innerHTML = 'Email is invalid or not found, please try again!';
    }
});
