import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.0.0/+esm';

// Supabase credentials
const supabaseUrl = 'https://ucspfnzhoepaxvpigvfm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjc3Bmbnpob2VwYXh2cGlndmZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjYzNTgwNywiZXhwIjoyMDQ4MjExODA3fQ.nVge6wNQ9SR6seed-nPp8PYchdttzcSlUrogwd2m-qU';
const supabase = createClient(supabaseUrl, supabaseKey);

function validate(event) {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const message = document.getElementById('message');
    if (password !== confirmPassword) {
        message.hidden = false;
        message.style.color = 'red';
        message.innerHTML = 'Passwords do not match';
        event.preventDefault();
        return false; // Prevent form submission
    } else {
        message.hidden = true;
        return true; // Allow form submission
    }
}

function showMessagePopup(message, reload = false) {
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
            window.location.reload();  // Reload the page after successful signup
        }
    }, 3000);
}

// Signup Form Event Listener
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = signupForm['signup-name'].value;
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // Validate the form
    const isValid = validate(e);
    if (!isValid) return;

    // Validate email and password
    if (!email || !password || password.length < 6) {
        showMessagePopup("Invalid email or password", false);
        return;
    }

    try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

        if (signUpError) {
            console.error("Sign-up Error:", signUpError.message);
            showMessagePopup("Error creating user: " + signUpError.message, false);
            return;
        }

        if (!signUpData || !signUpData.user) {
            console.error("No user data returned from sign-up.");
            showMessagePopup("An unexpected error occurred. Please try again.", false);
            return;
        }

        const userId = signUpData.user.user_id;

        // Check if user already exists
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('user_id')
            .eq('user_id', userId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "row not found" errors
            console.error('Fetch Error:', fetchError.message);
            showMessagePopup('Error checking user existence. Please try again.', false);
            return;
        }

        // Insert user data if not exists
        if (!existingUser) {
            const { data: insertData, error: insertError } = await supabase
                .from('users')
                .insert([{ user_id: userId, name, email }]);

            if (insertError) {
                console.error('Insert Error:', insertError.message);
                showMessagePopup('Error creating account. Please try again.', false);
                return;
            }

            console.log('Inserted Data:', insertData);
            showMessagePopup('Account created successfully!', true);
        } else {
            console.log('User already exists in the users table');
            showMessagePopup('User already exists.', false);
        }
    } catch (error) {
        console.error("Unexpected Error:", error.message);
        showMessagePopup('An unexpected error occurred. Please try again.', false);
    }
});


// Sign-In Form Event Listener
const signinForm = document.querySelector('#signin-form');
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signinForm['signin-email'].value;
    const password = signinForm['signin-password'].value;

    supabase.auth.signInWithPassword({ email, password })
        .then(({ user, error }) => {
            if (error) {
                const signInMessage = document.getElementById('error-message');
                signInMessage.hidden = false;
                signInMessage.style.color = 'red';
                signInMessage.innerHTML = 'Incorrect email or password!';
                e.preventDefault();
                return;
            }

            console.log('User logged in:', user);
            showMessagePopup('User logged in successfully!', false);

            setTimeout(() => {
                window.location.href = './views/homepage.html';
            }, 3000);
        })
        .catch((error) => {
            console.error("Error signing in: ", error);
            showMessagePopup('Error signing in. Please try again.', false);
        });
});
