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
    const response = await fetch("/register", {
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
    const response = await fetch("/login", {
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
    const response = await fetch("/resetpassword", {
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

async function handleUserDelete(button) {
  const user = JSON.parse(button.getAttribute("data-user"));
  const email = encodeURIComponent(user.email);

  if (
    !confirm(`Are you sure you want to delete user with email: ${user.email}?`)
  ) {
    return;
  }

  try {
    const response = await fetch(`/users/email/${email}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      // Optionally remove the row from table without reload:
      button.closest("tr").remove();
    } else {
      alert(result.message || "Failed to delete user.");
    }
  } catch (error) {
    console.error(error);
    alert("Error deleting user.");
  }
}

function handleUserEdit(button) {
  const user = JSON.parse(button.getAttribute("data-user"));

  // Populate modal fields
  document.getElementById("editUserId").value = user._id; // hidden input for ID
  document.getElementById("editUserEmail").innerText = user.email;
  document.getElementById("editUserRole").value = user.role;

  // Show modal
  document.getElementById("editUserModal").style.display = "block";
}

// Function to close modal
function closeUserModal() {
  document.getElementById("editUserModal").style.display = "none";
}

// Function to submit the edit
async function submitUserEdit() {
  const userId = document.getElementById("editUserId").value;
  const newRole = document.getElementById("editUserRole").value;

  if (!userId || !newRole) {
    alert("Missing user ID or role.");
    return;
  }

  try {
    const response = await fetch(`/users/${userId}/edit-role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      // Reload to show updated data
      window.location.reload();
    } else {
      alert(result.message || "Failed to update role.");
    }
  } catch (error) {
    console.error(error);
    alert("Error updating role.");
  }
}
async function logout() {
  try {
    const response = await fetch("/logout", {
      method: "POST", // Sends a POST request
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
      window.location.href = "/"; // Redirects to the login page
    }
  } catch (err) {
    console.error("Error during logout:", err);
    alert("Something went wrong during logout.");
  }
}

function handleEmailEdit() {
  document.getElementById("editEmailModal").style.display = "block";
}

// Close modal when user clicks close button
function closeEmailModal() {
  document.getElementById("editEmailModal").style.display = "none";
}

// Submit email update
async function submitEmailEdit() {
  const userId = document.getElementById("editEmailUserId").value;
  const newEmail = document.getElementById("newEmail").value;

  if (!userId || !newEmail) {
    alert("Missing user ID or email.");
    return;
  }

  try {
    const response = await fetch(`/users/${userId}/edit-email`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail }),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      window.location.reload();
    } else {
      alert(result.message || "Failed to update email.");
    }
  } catch (error) {
    console.error(error);
    alert("Error updating email.");
  }
}

function searchTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const tableRows = document.querySelectorAll("tbody tr");

  tableRows.forEach((row) => {
    const productNumber = row.cells[0].textContent.toLowerCase();
    const productName = row.cells[1].textContent.toLowerCase();

    if (productNumber.includes(input) || productName.includes(input)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
