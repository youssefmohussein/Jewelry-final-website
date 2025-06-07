
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

    // Delete handler
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

    // Modal elements
    const editOrderModal = document.getElementById("editOrderModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const editOrderForm = document.getElementById("editOrderForm");

    // Open edit modal & populate form
    function openEditOrderForm(orderRow) {
      editOrderModal.style.display = "block";

      document.getElementById("editOrderId").value = orderRow.querySelector("td:nth-child(1)").innerText || "";
      document.getElementById("editCustomerName").value = orderRow.querySelector("td:nth-child(2)").innerText || "";
      document.getElementById("editProducts").value = orderRow.querySelector("td:nth-child(3)").innerText || "";
      document.getElementById("editQuantity").value = orderRow.dataset.quantity || "";
      document.getElementById("editTotalPrice").value = parseFloat(orderRow.querySelector("td:nth-child(5)").innerText.replace("$", "")) || "";
      document.getElementById("editStatus").value = orderRow.querySelector("td:nth-child(6) span").innerText || "";
      document.getElementById("editAddress").value = orderRow.dataset.address || "";
      
      // Save order id to form dataset for submission reference
      editOrderForm.dataset.orderId = orderRow.dataset.orderId;
    }

    function closeEditOrderForm() {
      editOrderModal.style.display = "none";
      editOrderForm.dataset.orderId = "";
      editOrderForm.reset();
    }

    closeModalBtn.addEventListener("click", closeEditOrderForm);
    window.addEventListener("click", (e) => {
      if (e.target === editOrderModal) closeEditOrderForm();
    });

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
        status: document.getElementById("editStatus").value,
        shippingAddress: {
          address: document.getElementById("editAddress").value.trim()
        }
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
          // Keep existing date & amount cells if needed or add more inputs to edit them
          row.querySelector("td:nth-child(6) span").innerText = updatedOrder.status;
          row.querySelector("td:nth-child(6) span").className = `status-${updatedOrder.status.toLowerCase()}`;

          row.dataset.address = updatedOrder.shippingAddress.address;

          closeEditOrderForm();
        })
        .catch(err => {
          console.error(err);
          alert("Error updating order.");
        });
    });

    // Setup event listeners on existing Edit/Delete buttons
    function setupButtons() {
      document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const orderRow = e.currentTarget.closest("tr");
          openEditOrderForm(orderRow);
        });
      });

      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", handleDeleteClick);
      });
    }

    setupButtons();
