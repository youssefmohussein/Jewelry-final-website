  // function openEmailModal() {
  //   document.getElementById('editEmailModal').style.display = 'flex';
  //   document.getElementById('newEmail').value = '<%= user.Email %>';
  // }

  // function closeEmailModal() {
  //   document.getElementById('editEmailModal').style.display = 'none';
  // }
// orderProfile.js

// Example: Fetch and display user's past orders on profile page
async function fetchUserOrders() {
  try {
    const response = await fetch(`/users/${userId}/edit-role`); // Adjust URL to your API route
    if (!response.ok) throw new Error('Failed to fetch orders');
    const orders = await response.json();

    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = ''; // Clear previous content

    if (orders.length === 0) {
      ordersContainer.innerHTML = '<p>No orders found.</p>';
      return;
    }

    orders.forEach(order => {
      const orderElem = document.createElement('div');
      orderElem.classList.add('order-item');
      orderElem.innerHTML = `
        <h3>Order #${order.orderId}</h3>
        <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Status: ${order.status}</p>
        <p>Total: LE ${order.totalPrice.toFixed(2)}</p>
        <button onclick="viewOrderDetails('${order._id}')">View Details</button>
      `;
      ordersContainer.appendChild(orderElem);
    });
  } catch (error) {
    console.error('Error loading orders:', error);
    alert('Could not load your orders. Please try again later.');
  }
}

// Example: Show detailed order info in a modal or alert
async function viewOrderDetails(orderId) {
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch order details');
    const order = await response.json();

    let details = `Order #${order.orderId}\nDate: ${new Date(order.createdAt).toLocaleString()}\nStatus: ${order.status}\nItems:\n`;

    order.items.forEach(item => {
      details += `- ${item.productName} x${item.quantity} - LE ${item.price.toFixed(2)} each\n`;
    });
    details += `Total: LE ${order.totalPrice.toFixed(2)}`;

    alert(details);
  } catch (error) {
    console.error('Error fetching order details:', error);
    alert('Could not load order details.');
  }
}

// Call fetchUserOrders on page load to show orders if on profile page
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('ordersContainer')) {
    fetchUserOrders();
  }
  // orderManagment.js
    searchInput.addEventListener("keyup", function (event) {
        fetchAndRenderOrders(); // <--- THIS CALLS THE SEARCH FUNCTION
    });
});

