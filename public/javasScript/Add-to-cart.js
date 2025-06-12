// /javasScript/cart.js
document.addEventListener("DOMContentLoaded", function () {
    // Function to update cart item quantity on the server
    async function updateCartItemQuantity(productId, newQuantity) {
        try {
            const response = await fetch('/cart/update-quantity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, quantity: newQuantity })
            });
            const result = await response.json();
            if (result.success) {
                // Reload the page to reflect updated totals and cart state from the server
                window.location.reload();
            } else {
                alert('Failed to update quantity: ' + (result.message || 'Unknown error.'));
            }
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            alert('Server error while updating quantity.');
        }
    }

    // Function to remove cart item from the server
    async function removeCartItem(productId) {
        try {
            const response = await fetch('/cart/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId })
            });
            const result = await response.json();
            if (result.success) {
                // Reload the page to reflect changes
                window.location.reload();
            } else {
                alert('Failed to remove item: ' + (result.message || 'Unknown error.'));
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
            alert('Server error while removing item.');
        }
    }

    // Event listeners for quantity changes
    document.querySelectorAll(".cart-quantity-input").forEach(input => {
        input.addEventListener("change", function () {
            const productId = this.dataset.productId;
            const newQuantity = parseInt(this.value);
            if (isNaN(newQuantity) || newQuantity < 0) {
                this.value = 1; // Reset to 1 if invalid
                alert("Quantity must be a positive number.");
                return;
            }
            updateCartItemQuantity(productId, newQuantity);
        });
    });

    // Event listeners for remove buttons
    document.querySelectorAll(".remove-item-btn").forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.dataset.productId;
            if (confirm("Are you sure you want to remove this item from your cart?")) {
                removeCartItem(productId);
            }
        });
    });
});

