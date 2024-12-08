import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC9gZqAF4RoCt1MOJNIYXmGo4FPWf7032U",
    authDomain: "tootheasee.firebaseapp.com",
    projectId: "tootheasee",
    storageBucket: "tootheasee.appspot.com",
    messagingSenderId: "370145091456",
    appId: "1:370145091456:web:06c42d2e543f68c4566b65",
    measurementId: "G-F3HRFTH29X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

function showMessagePopup(message, reload = false) {
    // Get popup elements
    const overlay = document.getElementById('popup-overlay');
    const popupBox = document.getElementById('popup-box');
    const popupMessage = document.getElementById('popup-message');

    // Set message and show elements
    popupMessage.textContent = message;
    overlay.style.display = 'block';
    popupBox.style.display = 'block';

    // Hide popup after 3 seconds
    setTimeout(() => {
        overlay.style.display = 'none';
        popupBox.style.display = 'none';
        if (reload) {
            window.location.reload(); // Reload the page
        }
    }, 3000);
}

// Signup Form Event Listener
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = signupForm['signup-name'].value;
    const email = signupForm['signup-email'].value;
    validate();
    const password = signupForm['signup-password'].value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log('User created:', user);
            if (!user || !user.uid) {
                throw new Error('User or user UID is undefined');
            }

            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                name: name,
                email: email
            });

            // Show popup and reload the page after signup
            showMessagePopup('Account created successfully!', true);
        })
        .catch((error) => {
            const eCode = error.code;
            const checkEmail = document.getElementById('check-email');
            if (eCode === 'auth/email-already-in-use') {
                checkEmail.hidden = false;
                checkEmail.style.color = 'red';
                checkEmail.innerHTML = 'Email is already in use!';
                e.preventDefault();
            } else if (eCode === 'auth/invalid-email') {
                checkEmail.hidden = false;
                checkEmail.style.color = 'red';
                checkEmail.innerHTML = 'Invalid email! Please try again!';
                e.preventDefault();
            } else {
                checkEmail.hidden = true;
                console.error("Error creating user: ", error);
            }
        });
});

// Sign-In Form Event Listener
const signinForm = document.querySelector('#signin-form');
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signinForm['signin-email'].value;
    const password = signinForm['signin-password'].value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Show popup without reloading for sign-in
            showMessagePopup('User logged in successfully!', false);

            // Redirect to homepage after popup
            setTimeout(() => {
                window.location.href = './views/homepage.html';
            }, 3000);
        })
        .catch((error) => {
            const eCode = error.code;
            const signInMessage = document.getElementById('error-message');
            if (eCode === 'auth/invalid-credential') {
                signInMessage.hidden = false;
                signInMessage.style.color = 'red';
                signInMessage.innerHTML = 'Incorrect email or password!';
                e.preventDefault();
            } else if (eCode === 'auth/invalid-email') {
                signInMessage.hidden = false;
                signInMessage.style.color = 'red';
                signInMessage.innerHTML = 'Invalid email! Please try again!';
                e.preventDefault();
            } else {
                signInMessage.style.color = 'red';
                signInMessage.innerHTML = 'Account does not exist!';
                console.error("Error creating user: ", error);
            }
        });
});
