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
    }
}

document.getElementById('signup-password').addEventListener('input', check);
document.getElementById('confirm-password').addEventListener('input', check);