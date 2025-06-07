document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const statusFilter = document.getElementById("status-filter");
  const tableBody = document.querySelector(".orders-table tbody");

  // Filter orders by search and status
  function filterOrders() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value.toLowerCase().trim();

    [...tableBody.rows].forEach(row => {
      if (row.cells.length === 0) return;
      const orderId = row.cells[0].textContent.toLowerCase();
      const customerName = row.cells[1].textContent.toLowerCase();
      const statusText = row.cells[5].textContent.toLowerCase();

      const matchesSearch = orderId.includes(searchText) || customerName.includes(searchText);
      const matchesStatus = !selectedStatus || statusText === selectedStatus;

      row.style.display = matchesSearch && matchesStatus ? "" : "none";
    });
  }

  searchInput.addEventListener("input", filterOrders);
  statusFilter.addEventListener("change", filterOrders);

  // Delete order handler
  function handleDeleteClick(event) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    const btn = event.currentTarget;
    const row = btn.closest("tr");
    const orderId = row.dataset.orderId;

    fetch(`/orders/${orderId}`, { method: "DELETE" })
      .then(res => {
        if (res.ok) {
          row.remove();
        } else {
          alert("Failed to delete order.");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error deleting order.");
      });
  }

  // Modal and form elements
  const editOrderModal = document.getElementById("editOrderModal");
  const editOrderForm = document.getElementById("editOrderForm");

  // Open the edit modal and populate form fields
  function openEditOrderForm(orderRow) {
    editOrderModal.style.display = "block";

    document.getElementById("editOrderId").value = orderRow.querySelector("td:nth-child(1)").innerText || "";
    document.getElementById("editCustomerName").value = orderRow.querySelector("td:nth-child(2)").innerText || "";
    document.getElementById("editProducts").value = orderRow.querySelector("td:nth-child(3)").innerText || "";
    document.getElementById("editQuantity").value = orderRow.dataset.quantity || "";
    document.getElementById("editTotalPrice").value = parseFloat(orderRow.querySelector("td:nth-child(5)").innerText.replace("$", "")) || "";
    document.getElementById("editStatus").value = orderRow.querySelector("td:nth-child(6) span").innerText.toLowerCase() || "";
    document.getElementById("editAddress").value = orderRow.dataset.address || "";
    document.getElementById("editCity").value = orderRow.dataset.city || "";
    document.getElementById("editState").value = orderRow.dataset.state || "";
    document.getElementById("editPostalCode").value = orderRow.dataset.postalcode || "";
    document.getElementById("editCountry").value = orderRow.dataset.country || "";
    document.getElementById("editPhone").value = orderRow.dataset.phone || "";
    document.getElementById("editPaymentMethod").value = orderRow.dataset.payment_method || "";

    // Save order id to form dataset for submission reference
    editOrderForm.dataset.orderId = orderRow.dataset.orderId;
  }

  // Close modal function
  window.closeEditOrderForm = function () {
    editOrderModal.style.display = "none";
    editOrderForm.dataset.orderId = "";
    editOrderForm.reset();
  };

  // Close modal on clicking outside or cancel button
  window.addEventListener("click", (e) => {
    if (e.target === editOrderModal) window.closeEditOrderForm();
  });

  // Handle form submission to update order
  editOrderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const orderId = editOrderForm.dataset.orderId;
    if (!orderId) {
      alert("Invalid order ID.");
      return;
    }

    const updatedOrder = {
      orderId: document.getElementById("editOrderId").value.trim(),
      userName: document.getElementById("editCustomerName").value.trim(),
      products: document.getElementById("editProducts").value.trim()
        .split(",").map(p => p.trim()).filter(Boolean),
      quantity: parseInt(document.getElementById("editQuantity").value, 10),
      total_price: parseFloat(document.getElementById("editTotalPrice").value),
      status: document.getElementById("editStatus").value.toLowerCase(),
      shippingAddress: {
        address: document.getElementById("editAddress").value.trim(),
        city: document.getElementById("editCity").value.trim(),
        state: document.getElementById("editState").value.trim(),
        postalCode: document.getElementById("editPostalCode").value.trim(),
        country: document.getElementById("editCountry").value.trim(),
      },
      phone: document.getElementById("editPhone").value.trim(),
      payment_method: document.getElementById("editPaymentMethod").value.trim()
    };

    fetch(`/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedOrder)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update order");
        return res.json();
      })
      .then(updatedData => {
        const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
        if (!row) return;

        row.querySelector("td:nth-child(1)").innerText = updatedData.orderId || updatedOrder.orderId;
        row.querySelector("td:nth-child(2)").innerText = updatedOrder.userName;
        row.querySelector("td:nth-child(3)").innerText = updatedOrder.products.join(", ");
        row.querySelector("td:nth-child(6) span").innerText = updatedOrder.status.charAt(0).toUpperCase() + updatedOrder.status.slice(1);
        row.querySelector("td:nth-child(6) span").className = `status-${updatedOrder.status}`;

        // Update dataset attributes
        row.dataset.address = updatedOrder.shippingAddress.address;
        row.dataset.city = updatedOrder.shippingAddress.city;
        row.dataset.state = updatedOrder.shippingAddress.state;
        row.dataset.postalcode = updatedOrder.shippingAddress.postalCode;
        row.dataset.country = updatedOrder.shippingAddress.country;
        row.dataset.phone = updatedOrder.phone;
        row.dataset.payment_method = updatedOrder.payment_method;
        row.dataset.quantity = updatedOrder.quantity;

        // Update amount
        row.querySelector("td:nth-child(5)").innerText = `$${updatedOrder.total_price.toFixed(2)}`;

        window.closeEditOrderForm();
      })
      .catch(err => {
        alert(err.message);
      });
  });

  // Attach event listeners for edit and delete buttons
  function attachActionButtons() {
    document.querySelectorAll(".edit-btn").forEach(button => {
      button.addEventListener("click", e => {
        const row = e.target.closest("tr");
        openEditOrderForm(row);
      });
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", handleDeleteClick);
    });
  }

  attachActionButtons();
});

function logout() {
  // Redirect to login page
  window.location.href = "/login";

}
