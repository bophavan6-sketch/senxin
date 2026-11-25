// ==============================
// 1. SHOW / HIDE PASSWORD
// ==============================

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "Show";
    }

});


// ==============================
// 2. LOGIN AUTHENTICATION
// ==============================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

// Demo account only — not secure for real use
const adminUsername = "admin";
const adminPassword = "123456";

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = passwordInput.value;

    if (
        username === adminUsername &&
        password === adminPassword
    ) {

        loginMessage.textContent = "Login successful!";
        loginMessage.style.color = "green";

       sessionStorage.setItem("senXinAdminLoggedIn", "true");

window.location.href = "admin.html";

    } else {

        loginMessage.textContent = "Invalid username or password.";
        loginMessage.style.color = "red";

    }

});