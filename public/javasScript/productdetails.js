// This is your client-side JavaScript file, e.g., 'productDetail.js'
document.addEventListener("DOMContentLoaded", function () {
    const decreaseBtn = document.querySelector('.decrease-btn');
    const increaseBtn = document.querySelector('.increase-btn');
    const quantityInput = document.querySelector('.quantity-input');
    const addToCartBtn = document.getElementById("addToCart");

    // Ensure elements exist before adding event listeners
    if (increaseBtn) {
        increaseBtn.addEventListener('click', () => {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        });
    }

    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) quantityInput.value = currentValue - 1;
        });
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", async function () {
            // Get productId from a data attribute on the button
            const productId = this.dataset.productId;
            const quantity = parseInt(quantityInput.value);

            if (quantity <= 0) {
                alert("Please select a quantity greater than 0.");
                return;
            }

            try {
                const response = await fetch("/cart/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ productId, quantity })
                });

                const result = await response.json();
                if (result.success) {
                    // Redirect to cart page after successful addition
                    window.location.href = "/cart";
                } else {
                    alert("Failed to add to cart.");
                }
            } catch (error) {
                console.error("Error adding to cart:", error);
                alert("Server error.");
            }
        });
    }
});
