document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const statusFilter = document.getElementById("status-filter");
  const tableBody = document.querySelector(".orders-table tbody");

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

  // Delete handler function
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

  // Open edit modal & populate form
  const editOrderModal = document.getElementById("editOrderModal");
  const closeModalBtn = document.getElementById("closeModal");
  const editOrderForm = document.getElementById("editOrderForm");

  function openEditOrderForm(orderRow) {
    editOrderModal.style.display = "block";

    document.getElementById("orderId").value = orderRow.dataset.orderId || "";
    document.getElementById("orderIDInput").value = orderRow.querySelector("td:nth-child(1)").innerText || "";
    document.getElementById("userNameInput").value = orderRow.querySelector("td:nth-child(2)").innerText || "";
    document.getElementById("phoneInput").value = orderRow.dataset.phone || "";
    document.getElementById("productsInput").value = orderRow.querySelector("td:nth-child(3)").innerText || "";

    const orderDateText = orderRow.querySelector("td:nth-child(4)").innerText;
    const orderDate = new Date(orderDateText);
    document.getElementById("orderDateInput").value = orderDate.toISOString().slice(0, 10) || "";

    document.getElementById("quantityInput").value = orderRow.dataset.quantity || "";
    document.getElementById("totalPriceInput").value = parseFloat(orderRow.querySelector("td:nth-child(5)").innerText.replace("$", "")) || "";

    document.getElementById("addressInput").value = orderRow.dataset.address || "";
    document.getElementById("cityInput").value = orderRow.dataset.city || "";
    document.getElementById("stateInput").value = orderRow.dataset.state || "";
    document.getElementById("postalCodeInput").value = orderRow.dataset.postalcode || "";
    document.getElementById("countryInput").value = orderRow.dataset.country || "";

    const statusSpan = orderRow.querySelector("td:nth-child(6) span");
    document.getElementById("statusInput").value = statusSpan ? statusSpan.innerText.toLowerCase() : "";

    document.getElementById("paymentMethodInput").value = orderRow.dataset.payment_method || "";
  }

  function closeEditOrderForm() {
    editOrderModal.style.display = "none";
  }

  closeModalBtn.addEventListener("click", closeEditOrderForm);
  window.addEventListener("click", (e) => {
    if (e.target === editOrderModal) closeEditOrderForm();
  });

  editOrderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Collect form data
    const updatedOrder = {
      orderId: document.getElementById("orderIDInput").value.trim(),
      userName: document.getElementById("userNameInput").value.trim(),
      phone: document.getElementById("phoneInput").value.trim(),
      products: document.getElementById("productsInput").value.trim()
        .split(",").map(p => p.trim()).filter(Boolean),
      orderDate: document.getElementById("orderDateInput").value,
      quantity: parseInt(document.getElementById("quantityInput").value, 10),
      total_price: parseFloat(document.getElementById("totalPriceInput").value),
      shippingAddress: {
        address: document.getElementById("addressInput").value.trim(),
        city: document.getElementById("cityInput").value.trim(),
        state: document.getElementById("stateInput").value.trim(),
        postalCode: document.getElementById("postalCodeInput").value.trim(),
        country: document.getElementById("countryInput").value.trim(),
      },
      status: document.getElementById("statusInput").value,
      Payment_method: document.getElementById("paymentMethodInput").value
    };

    const orderId = document.getElementById("orderId").value;

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
      // Find the row in the table and update it with new values
      const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
      if (!row) return;

      row.querySelector("td:nth-child(1)").innerText = updatedData.orderId || updatedOrder.orderId;
      row.querySelector("td:nth-child(2)").innerText = updatedOrder.userName;
      row.dataset.phone = updatedOrder.phone;
      row.querySelector("td:nth-child(3)").innerText = updatedOrder.products.join(", ");
      row.querySelector("td:nth-child(4)").innerText = new Date(updatedOrder.orderDate).toDateString();
      row.dataset.quantity = updatedOrder.quantity;
      row.querySelector("td:nth-child(5)").innerText = `$${updatedOrder.total_price.toFixed(2)}`;
      row.querySelector("td:nth-child(6) span").innerText = updatedOrder.status.charAt(0).toUpperCase() + updatedOrder.status.slice(1);
      row.querySelector("td:nth-child(6) span").className = `status-${updatedOrder.status.toLowerCase()}`;

      row.dataset.address = updatedOrder.shippingAddress.address;
      row.dataset.city = updatedOrder.shippingAddress.city;
      row.dataset.state = updatedOrder.shippingAddress.state;
      row.dataset.postalcode = updatedOrder.shippingAddress.postalCode;
      row.dataset.country = updatedOrder.shippingAddress.country;
      row.dataset.payment_method = updatedOrder.Payment_method;

      closeEditOrderForm();
    })
    .catch(err => {
      alert(err.message || "Error updating order.");
      console.error(err);
    });
  });

  // Attach event listeners for Edit and Delete buttons dynamically
  function attachListeners() {
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const orderRow = e.target.closest("tr");
        if (!orderRow) return;
        openEditOrderForm(orderRow);
      });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", handleDeleteClick);
    });
  }

  attachListeners();
});
