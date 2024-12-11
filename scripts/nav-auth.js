import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

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

        if (!user || !user.id) {
            console.log("No user session found or user_id is missing.");
            showMessagePopup('No user session found. Please log in.');
            return;
        }

        console.log('User info:', user);
        const userID = user.id;

        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('name, is_admin')
            .eq('user_id', userID)
            .single();

        if (fetchError) {
            console.error('Error fetching user data:', fetchError.message);
            showMessagePopup('Error fetching user data. Please try again.');
            return;
        }

        if (userData) {
            const welcome = document.getElementById('welcome-message');
            if (userData.is_admin) {
                welcome.innerText = `Welcome, Admin ${userData.name}!`;
            } else {
                welcome.innerText = `Welcome, ${userData.name}!`;
            }

            const editProfileBtn = document.getElementById('editProfile');
            if (editProfileBtn) {
                editProfileBtn.addEventListener('click', async () => {
                    const newName = prompt("Enter your new name:");

                    if (newName) {
                        const welcome = document.getElementById('welcome-message');
                        
                        welcome.innerText = `Updating your profile...`;
                
                        try {
                            const { error } = await supabase
                                .from('users')
                                .update({ name: newName })
                                .eq('user_id', userID);
                
                            if (error) {
                                console.error('Error updating profile:', error.message);
                                showMessagePopup('Error updating profile. Please try again.');
                            } else {
                                welcome.innerText = `Welcome, ${newName}!`;
                                showMessagePopup('Profile updated successfully!', true);
                            }
                        } catch (err) {
                            console.error('Unexpected error during profile update:', err);
                            showMessagePopup('An unexpected error occurred. Please try again.');
                        }
                    }
                });
            }
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
