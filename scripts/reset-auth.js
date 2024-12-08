import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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

const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get('oobCode');
console.log("oobCode:", oobCode);

verifyPasswordResetCode(auth, oobCode)
    .then((email) => {
        console.log("Valid code for email:", email);
    })
    .catch((error) => {
        console.error("Error verifying code:", error);
        alert("Invalid or expired code.");
        window.location.href = '../index.html';
    });

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

    confirmPasswordReset(auth, oobCode, newPassword)
        .then(() => {
            showMessagePopup('Password has been reset successfully!', '../index.html');
        })
        .catch((error) => {
            console.error("Error resetting password:", error);
            showMessagePopup('Error resetting password.');
        });
});
