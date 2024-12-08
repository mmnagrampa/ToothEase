import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);

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
forgotPass.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            showMessagePopup('An email has been sent to reset your password.', false, '../index.html');
        })
        .catch((error) => {
            const eCode = error.code;
            if(eCode === 'auth/invalid-email') {
                errorMessage.hidden = false;
                errorMessage.style.color = 'red';
                errorMessage.innerHTML = 'Email is invalid, please try again!';
                e.preventDefault();
            }
        });
})