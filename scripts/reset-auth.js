import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Extract oobCode from URL
const urlParams = new URLSearchParams(window.location.search);
const oobCode = urlParams.get('oobCode');
console.log("oobCode:", oobCode);

// Verify the oobCode
verifyPasswordResetCode(auth, oobCode)
    .then((email) => {
        console.log("Valid code for email:", email);
    })
    .catch((error) => {
        console.error("Error verifying code:", error);
        alert("Invalid or expired code.");
        window.location.href = '../index.html';
    });

// Validate function for password match
function validate(event) {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (password != confirmPassword) 
        event.preventDefault();
}

// Handle form submission
const resetSubmit = document.getElementById('submit');
resetSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    
    validate();

    const newPassword = document.getElementById('signup-password').value;

    // Reset the password
    confirmPasswordReset(auth, oobCode, newPassword)
        .then(() => {
            alert("Password has been reset successfully!");
            window.location.href = '../index.html'; // Redirect to the desired page
        })
        .catch((error) => {
            console.error("Error resetting password:", error);
            alert("Error resetting password: " + error.message);
        });
});
