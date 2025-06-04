// Toggle login/signup animation
const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");

registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});
loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Sign Up
const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim(); // changed to match backend
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
    return alert("All fields are required!");
  }

  if (password !== confirmPassword) {
    return alert("Passwords do not match!");
  }

  const isValid =
    password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
  if (!isValid) {
    return alert(
      "Password must be at least 8 characters and include both letters and numbers."
    );
  }

  try {
    const response = await fetch("/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }), // FIXED key names
    });

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
      container.classList.remove("active"); // Switch to login form
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong during registration.");
  }
});

// Login
const signInForm = document.getElementById("signInForm");
signInForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    return alert("Email and password are required!");
  }

  try {
    const response = await fetch("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // FIXED key names
    });

    const result = await response.json();
    if (response.ok) {
      alert("Login successful!");

      // Redirect based on role
      if (result.role === "customer") {
        window.location.href = "/home";
      } else if (result.role === "admin") {
        window.location.href = "/customers-dashboard";
      } else {
        alert("Unknown role, please contact support.");
      }
    } else {
      alert(result.message || "Invalid login credentials.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong during login.");
  }
});

// Reset Password
const resetForm = document.getElementById("resetPasswordForm");
resetForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("resetEmail").value.trim(); // ID changed to avoid conflict
  const password = document.getElementById("resetPassword").value;
  const confirmPassword = document.getElementById("resetConfirmPassword").value;

  if (!email || !password || !confirmPassword) {
    return alert("All fields are required!");
  }

  if (password !== confirmPassword) {
    return alert("Passwords do not match!");
  }

  try {
    const response = await fetch("/users/resetpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword }), // FIXED key names
    });

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
      window.location.href = "/login";
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong during password reset.");
  }
});
