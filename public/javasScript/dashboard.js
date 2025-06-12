document.addEventListener("DOMContentLoaded", () => {
  const refreshButton = document.getElementById("refreshButton");

  if (refreshButton) {
    refreshButton.addEventListener("click", () => {
      alert("Refreshing data... (Page will reload)");
      window.location.reload();
    });
  }
});

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
