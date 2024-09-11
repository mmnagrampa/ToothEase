import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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

const signupbtn = document.getElementById('signUp');
const patientbtn = document.getElementById('patientbtn');
const staffbtn = document.getElementById('staffbtn');

function assignUserType() {
    var type = document.querySelector('input[name="user-options"]:checked').value;
    if (type == 'patient') {
        alert('i am a patient');
        return true;
    } else {
        alert('i am staff');
        return false;
    }
}

signupbtn.addEventListener("click", (event) => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const signUpPassword = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = assignUserType();
    if (signUpPassword != confirmPassword) {
        event.preventDefault();
    } else {
    alert('i will create a user');
    }
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                name: name,
                email: email,
                user_type: userType
            };
            alert('Account created successfully!');
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                    alert('Unable to save user data');
                })
        })
        .catch((error) => {
            console.error("Error creating user: ", error);
        })
});
