document.addEventListener("DOMContentLoaded", () => {
  const editOrderModal = document.getElementById("editOrderModal");
  const editOrderForm = document.getElementById("editOrderForm");
  const statusFilter = document.getElementById("statusFilter");

  function openEditOrderForm(orderRow) {
    editOrderModal.style.display = "block";

    document.getElementById("editOrderId").value =
      orderRow.querySelector("td:nth-child(1)")?.innerText || "";
    document.getElementById("editCustomerName").value =
      orderRow.querySelector("td:nth-child(2)")?.innerText || "";
    document.getElementById("editProducts").value =
      orderRow.querySelector("td:nth-child(3)")?.innerText || "";
    document.getElementById("editTotalPrice").value =
      orderRow.querySelector("td:nth-child(5)")?.innerText || "";

    const addressParts = [
      orderRow.dataset.address,
      orderRow.dataset.city,
      orderRow.dataset.state,
      orderRow.dataset.postalcode,
      orderRow.dataset.country,
    ].filter(Boolean);

    document.getElementById("editShippingAddress").value =
      addressParts.join(", ");

    let currentStatus =
      orderRow.querySelector("td:nth-child(6) span")?.innerText.toLowerCase() ||
      "shipped";

    if (!["shipped", "delivered"].includes(currentStatus)) {
      currentStatus = "shipped";
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
      .then(() => {
        const row = document.querySelector(`tr[data-order-id="${orderId}"]`);
        if (!row) return;

        const span = row.querySelector("td:nth-child(6) span");
        if (span) {
          span.innerText =
            updatedStatus.charAt(0).toUpperCase() + updatedStatus.slice(1);
          span.className = `status-${updatedStatus}`;
        }

        window.closeEditOrderForm();
        applyStatusFilter(); // Refresh table visibility based on new status
      })
      .catch((err) => {
        alert(err.message);
      });
  });

  function attachEditButtons() {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        openEditOrderForm(row);
      });
    });
  }

  function attachDeleteButtons() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        const orderId = row.dataset.orderId;

        if (!orderId) {
          alert("Invalid order ID.");
          return;
        }

        const confirmDelete = confirm(
          "Are you sure you want to delete this order?"
        );
        if (!confirmDelete) return;

        fetch(`/orders/${orderId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to delete order");
            return res.json();
          })
          .then(() => {
            row.remove();
            applyStatusFilter(); // Refresh table visibility
          })
          .catch((err) => {
            alert(err.message);
          });
      });
    });
  }

  // ✅ Status Filter Logic
  function applyStatusFilter() {
    const selected = statusFilter.value.toLowerCase();
    const rows = document.querySelectorAll("table tbody tr");

    rows.forEach((row) => {
      const statusText =
        row.querySelector("td:nth-child(6) span")?.innerText.toLowerCase() ||
        "";
      const visible = selected === "all" || statusText === selected;
      row.style.display = visible ? "" : "none";
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", applyStatusFilter);
  }

  attachEditButtons();
  attachDeleteButtons();
  applyStatusFilter(); // Initial load
});

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
