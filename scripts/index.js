const container = document.getElementById('container');
const registerbtn = document.getElementById('register');
const loginbtn = document.getElementById('login');

let patientHover = true;
let staffHover = false;

document.addEventListener("DOMContentLoaded", function() {

    const passwordHide = document.getElementById("passwordHide");
    const passwordField = document.getElementById("signin-password");

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

function check() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const message = document.getElementById('message');

    if (password === "" || confirmPassword === "") {
        message.hidden = true;
    } else if (password.length < 6) {
        message.hidden = false;
        message.style.color = 'red';
        message.innerHTML = 'Password must be at least 6 characters';
    } else if (password === confirmPassword) {
        message.hidden = false;
        message.style.color = 'green';
        message.innerHTML = 'Passwords match';
    } else {
        message.hidden = false;
        message.style.color = 'red';
        message.innerHTML = 'Passwords do not match';
    }
}

document.getElementById('signup-password').addEventListener('input', check);
document.getElementById('confirm-password').addEventListener('input', check);