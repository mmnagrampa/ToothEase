import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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

const forgotPass = document.getElementById('submit');
const errorMessage = document.getElementById('error-message');
forgotPass.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('An email has been sent to reset your password.');
            window.location.href = '../index.html';
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