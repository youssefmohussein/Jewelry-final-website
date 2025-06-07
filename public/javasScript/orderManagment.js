document.addEventListener("DOMContentLoaded", () => {
  const editOrderModal = document.getElementById("editOrderModal");
  const editOrderForm = document.getElementById("editOrderForm");

  function openEditOrderForm(orderRow) {
    editOrderModal.style.display = "block";

    document.getElementById("editOrderId").value = orderRow.querySelector("td:nth-child(1)").innerText || "";
    document.getElementById("editCustomerName").value = orderRow.querySelector("td:nth-child(2)").innerText || "";
    document.getElementById("editProducts").value = orderRow.querySelector("td:nth-child(3)").innerText || "";
    document.getElementById("editTotalPrice").value = orderRow.querySelector("td:nth-child(5)").innerText || "";

    // Combine shipping address fields into one textarea
    const addressParts = [
      orderRow.dataset.address,
      orderRow.dataset.city,
      orderRow.dataset.state,
      orderRow.dataset.postalcode,
      orderRow.dataset.country,
    ].filter(Boolean);

    document.getElementById("editShippingAddress").value = addressParts.join(", ");

    // Set status dropdown, only allow "shipped" or "delivered"
    let currentStatus = orderRow.querySelector("td:nth-child(6) span").innerText.toLowerCase();
    if (currentStatus !== "shipped" && currentStatus !== "delivered") {
      currentStatus = "shipped"; // default if not shipped/delivered
    }
    document.getElementById("editStatus").value = currentStatus;

    editOrderForm.dataset.orderId = orderRow.dataset.orderId;
  }

  window.closeEditOrderForm = function () {
    editOrderModal.style.display = "none";
    editOrderForm.dataset.orderId = "";
    editOrderForm.reset();
  };

  window.addEventListener("click", (e) => {
    if (e.target === editOrderModal) window.closeEditOrderForm();
  });

  editOrderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const orderId = editOrderForm.dataset.orderId;
    if (!orderId) {
      alert("Invalid order ID.");
      return;
    }

    const updatedStatus = document.getElementById("editStatus").value;

    fetch(`/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: updatedStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update order status");
        return res.json();
      })
      .then((updatedData) => {
        const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
        if (!row) return;

        row.querySelector("td:nth-child(6) span").innerText =
          updatedStatus.charAt(0).toUpperCase() + updatedStatus.slice(1);
        row.querySelector("td:nth-child(6) span").className = `status-${updatedStatus}`;

        window.closeEditOrderForm();
      })
      .catch((err) => {
        alert(err.message);
      });
  });

  // Attach edit button event listeners (you should add this part in your existing JS)
  function attachEditButtons() {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        openEditOrderForm(row);
      });
    });
  }

  attachEditButtons();
});
function logout() {
  // Redirect to login page
  window.location.href = "/login";
}