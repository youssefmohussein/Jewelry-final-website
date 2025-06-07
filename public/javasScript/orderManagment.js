document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const statusFilter = document.getElementById("status-filter");
  const tableBody = document.querySelector(".orders-table tbody");

  // Filter function (reuse your logic)
  function filterOrders() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value.toLowerCase().trim();

    [...tableBody.rows].forEach(row => {
      const cells = row.cells;
      if (cells.length === 0) return;
      const orderId = cells[0].textContent.toLowerCase();
      const customerName = cells[1].textContent.toLowerCase();
      const statusText = cells[5].textContent.toLowerCase();

      const matchesSearch = orderId.includes(searchText) || customerName.includes(searchText);
      const matchesStatus = !selectedStatus || statusText === selectedStatus;

      row.style.display = matchesSearch && matchesStatus ? "" : "none";
    });
  }

  // Attach filter events
  searchInput.addEventListener("input", filterOrders);
  statusFilter.addEventListener("change", filterOrders);

// Define and immediately attach event listeners to delete buttons
document.querySelectorAll(".btn.delete-btn").forEach(button => {
  button.addEventListener("click", function(event) {
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
  });
});




  // Handle Edit order - open inline form for status only (you can extend for more fields)
  function openEditForm(row) {
    // Prevent multiple edits simultaneously
    if (row.querySelector(".edit-form")) return;

    const cells = row.cells;
    const currentStatus = cells[5].textContent.trim().toLowerCase();

    // Create form element inline inside Status cell
    const form = document.createElement("form");
    form.className = "edit-form";

    const statusSelect = document.createElement("select");
    ["pending", "shipped", "delivered"].forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
      if (status === currentStatus) option.selected = true;
      statusSelect.appendChild(option);
    });

    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.textContent = "Save";
    saveBtn.className = "btn save";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "btn cancel";

    form.appendChild(statusSelect);
    form.appendChild(saveBtn);
    form.appendChild(cancelBtn);

    // Replace status cell content with form
    cells[5].textContent = "";
    cells[5].appendChild(form);

    // Disable Edit & Delete buttons while editing
    cells[6].querySelector(".edit-btn").disabled = true;
    cells[6].querySelector(".delete-btn").disabled = true;

    // Cancel handler - restore original status display
    cancelBtn.addEventListener("click", () => {
      cells[5].textContent = currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1);
      cells[6].querySelector(".edit-btn").disabled = false;
      cells[6].querySelector(".delete-btn").disabled = false;
    });

    // Submit handler - save changes to DB
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newStatus = statusSelect.value;

      if (newStatus === currentStatus) {
        cancelBtn.click(); // No changes, cancel edit
        return;
      }

      const orderId = row.dataset.orderId;

      try {
        const res = await fetch(`/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (res.ok) {
          // Update UI
          cells[5].textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
          cells[5].className = `status-${newStatus}`;
          cells[6].querySelector(".edit-btn").disabled = false;
          cells[6].querySelector(".delete-btn").disabled = false;
          filterOrders(); // Re-filter in case status filter active
        } else {
          alert("Failed to update order status.");
        }
      } catch (err) {
        console.error(err);
        alert("Error updating order status.");
      }
    });
  }

  // Attach event listeners on buttons
  function attachListeners() {
    tableBody.querySelectorAll(".delete-btn").forEach(btn => {
      btn.onclick = () => handleDelete(btn);
    });

    tableBody.querySelectorAll(".edit-btn").forEach(btn => {
      btn.onclick = () => {
        const row = btn.closest("tr");
        openEditForm(row);
      };
    });
  }

  attachListeners();
});
