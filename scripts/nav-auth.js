import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

// Supabase credentials
const supabaseUrl = 'https://ucspfnzhoepaxvpigvfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc3Bmbnpob2VwYXh2cGlndmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MzU4MDcsImV4cCI6MjA0ODIxMTgwN30.iw7m3PDLJByvFGZTXsmbEDPxkP28_RYkNh9egJ5BXY4';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

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

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error retrieving session:', error.message);
            showMessagePopup('Error retrieving session. Please try again.');
            return;
        }

        const user = session?.user;

        // Check if user exists
        if (!user || !user.user_id) {
            console.log("No user session found or user_id is missing.");
            showMessagePopup('No user session found. Please log in.');
            return;
        }

        console.log('User info:', user);
        const userID = user.user_id;

        // Fetch user data from Supabase
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('name')
            .eq('user_id', userID)
            .single();

        if (fetchError) {
            console.error('Error fetching user data:', fetchError.message);
            showMessagePopup('Error fetching user data. Please try again.');
            return;
        }

        if (userData) {
            const welcome = document.getElementById('welcome-message');
            welcome.innerText = `Welcome, ${userData.name}!`;
        }
    } catch (err) {
        console.error('Unexpected error:', err);
        showMessagePopup('An unexpected error occurred. Please try again.');
    }
});

const logout = document.querySelector('#logout');
logout.addEventListener('click', async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Error during logout:', error.message);
        showMessagePopup('Error logging out. Please try again.');
    } else {
        showMessagePopup('User successfully signed out!', false, '../index.html');
    }
});
