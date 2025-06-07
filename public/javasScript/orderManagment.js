document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const statusFilter = document.getElementById("status-filter");
    const tableRows = document.querySelectorAll(".orders-table tbody tr");

    // Function to filter orders based on search input and status filter
    function filterOrders() {
        const searchText = searchInput.value.toLowerCase().trim();
        const selectedStatus = statusFilter.value.toLowerCase().trim();

        tableRows.forEach(row => {
            const cells = row.querySelectorAll("td");

            if (cells.length > 0) {
                const orderId = cells[0]?.textContent.toLowerCase().trim();
                const customerName = cells[1]?.textContent.toLowerCase().trim();
                const statusText = cells[5]?.textContent.toLowerCase().trim();

                const matchesSearch = orderId.includes(searchText) || customerName.includes(searchText);
                const matchesStatus = selectedStatus === "" || statusText === selectedStatus;

                row.style.display = matchesSearch && matchesStatus ? "" : "none";
            }
        });
    }

    // Function to cycle through order statuses on click
    function handleStatusClick(event) {
        const span = event.target;
        const statuses = ["pending", "shipped", "delivered"];
        const current = span.textContent.toLowerCase().trim();
        const nextIndex = (statuses.indexOf(current) + 1) % statuses.length;
        const next = statuses[nextIndex];

        // Update the span text and styling class
        span.textContent = next;
        statuses.forEach(status => span.classList.remove(`status-${status}`));
        span.classList.add(`status-${next}`);

        // Re-filter if necessary
        filterOrders();
    }

    // Bind input and dropdown change events to filtering
    searchInput.addEventListener("input", filterOrders);
    statusFilter.addEventListener("change", filterOrders);

    // Bind click event to each status cell to cycle status
    tableRows.forEach(row => {
        const statusSpan = row.querySelector("td:nth-child(6) span");
        if (statusSpan) {
            statusSpan.style.cursor = "pointer";
            statusSpan.addEventListener("click", handleStatusClick);
        }
    });
});
