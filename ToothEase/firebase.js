import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, setDoc, doc, getdoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
const db = getFirestore(app);

const signupbtn = document.getElementById('signUp');
const signinbtn = document.getElementById('signIn');
const container = document.getElementById('container');
const registerbtn = document.getElementById('register');
const loginbtn = document.getElementById('login');
const patient = document.getElementById('patientbtn');
const staffbtn = document.getElementById('staffbtn');

let patientHover = true;
let staffHover = false;

document.addEventListener("DOMContentLoaded", function() {

    const passwordHide = document.getElementById("passwordHide");
    const passwordField = document.getElementById("password");

    passwordHide.addEventListener("click", function() {

        if (passwordHide.classList.contains("bxs-hide")) {
            passwordHide.classList.remove("bxs-hide");
            passwordHide.classList.add("bxs-show");
            passwordField.type = 'text';
        } else {
            passwordHide.classList.remove("bxs-show");
            passwordHide.classList.add("bxs-hide");
            passwordField.type = 'password';
        }
    });

});

registerbtn.addEventListener("click", () => {
    container.classList.add("active");
});

loginbtn.addEventListener("click", () => {
    container.classList.remove("active");
});

patient.addEventListener("click", ()=> {
    patient.style.backgroundColor = "#0578a5";
    patient.style.color = "white";
    patient.style.borderColor = "white";
    staffbtn.style.backgroundColor = "white";
    staffbtn.style.color = "black";
    staffbtn.style.border = "1px solid black";
});

staffbtn.addEventListener("click", ()=> {
    staffbtn.style.backgroundColor = "#0578a5";
    staffbtn.style.color = "white";
    staffbtn.style.borderColor = "white";
    patient.style.backgroundColor = "white";
    patient.style.color = "black";
    patient.style.borderColor = "black";
});

function check() {
    const password = document.getElementById('signUpPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const message = document.getElementById('message');

    if (password === "" || confirmPassword === "") {
        message.hidden = true;
    } else if (password === confirmPassword) {
        message.hidden = false;
        message.style.color = 'green';
        message.innerHTML = 'Passwords match';
        var passCheck = true;
    } else {
        message.hidden = false;
        message.style.color = 'red';
        message.innerHTML = 'Passwords do not match';
        var passCheck = false;
    }
}

document.getElementById('signUpPassword').addEventListener('input', check);
document.getElementById('confirmPassword').addEventListener('input', check);

function signUp() {
    
}
/*

function assignUserType() {
    var uType = document.getElementsByClassName('user-type').value;
    if (uType = 'patient') {
        const uType = true;
        return uType;
    } else {
        const uType = false;
        return uType;
    }
}

signupbtn.addEventListener("click", () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const userType = assignUserType();

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
*/