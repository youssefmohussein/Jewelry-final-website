document.addEventListener("DOMContentLoaded", async function () {
  
});

async function removeFromCart(itemId) {
  try {
    const response = await fetch(`/cart/api/${itemId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      window.location.reload();
    } else {
      const result = await response.json();
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error('Error removing item:', error);
  }
}


async function updateQuantity(itemId, change) {
  try {
    const response = await fetch(`/cart/api/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ change })
    });

    if (response.ok) {
      window.location.reload();
    } else {
      const result = await response.json();
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
  }
}


