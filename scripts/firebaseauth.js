import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
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
    .then(async (userCredential) => {
        const user = userCredential.user;
        console.log('User created:', user);
        if (!user || !user.uid) {
            throw new Error('User or user UID is undefined');
        }

        alert('Account created successfully!');

        const userDocRef = doc(db, 'users', user.uid); 
        await setDoc(userDocRef, {
            name: name,
            email: email
        });
        
        location.reload(); 
    })
        .catch((error) => {
            const eCode = error.code;
            const checkEmail = document.getElementById('check-email');
            if(eCode === 'auth/email-already-in-use') {
                checkEmail.hidden = false;
                checkEmail.style.color = 'red';
                checkEmail.innerHTML = 'Email is already in use!';
                e.preventDefault();
            } 
            else if(eCode === 'auth/invalid-email') {
                checkEmail.hidden = false;
                checkEmail.style.color = 'red';
                checkEmail.innerHTML = 'Invalid email! Please try again!';
                e.preventDefault();
            }
            else {
                checkEmail.hidden = true;
                console.error("Error creating user: ", error);
            }
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
            window.location.href = './views/homepage.html';
        })
        .catch((error) => {
            const eCode = error.code;
            const signInMessage = document.getElementById('error-message');
            if(eCode === 'auth/invalid-credential') {
                signInMessage.hidden = false;
                signInMessage.style.color = 'red';
                signInMessage.innerHTML = 'Incorrect email or password!';
                e.preventDefault();
            } else {
                signInMessage.style.color = 'red';
                signInMessage.innerHTML = 'Account does not exist!';
                console.error("Error creating user: ", error);
            }
        })
})