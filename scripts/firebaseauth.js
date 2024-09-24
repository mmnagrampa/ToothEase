import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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
const db = getFirestore(app);

function validate(event) {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (password != confirmPassword) 
        event.preventDefault();
}

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = signupForm['signup-name'].value;
    const email = signupForm['signup-email'].value;
    validate();
    const password = signupForm['signup-password'].value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert('Account created successfully!');
            window.location.href = 'homepage.html';
        })
})

const signinForm = document.querySelector('#signin-form');
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signinForm['signin-email'].value;
    const password = signinForm['signin-password'].value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert('User logged in successfully!');
            window.location.href = 'homepage.html';
        })
})

// function assignUserType() {
//     var type = document.querySelector('input[name="user-options"]:checked').value;
//     if (type == 'patient') {
//         return "patient";
//     } else {
//         return "staff";
//     }
// }

// const signupbtn = document.getElementById('signUp');
// signupbtn.addEventListener("click", async (event) => {
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('signUpPassword').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;
//     const userType = assignUserType();

//     if (password != confirmPassword) {
//         event.preventDefault();
//     }

//     try {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         console.log("User created:", user);

//             const userData = {
//                     name: name,
//                     email: email,
//                     user_type: userType
//                 };

//                 const docRef = doc(db, "users", user.uid);
//                 await setDoc(docRef, userData);

//                 alert('Account created successfully!');
//                 window.location.href = 'index.html';

//             } catch (error) {
//                 console.error("Error creating user:", error.message);
//                 alert('An error occurred: ' + error.message);
//             }
// });