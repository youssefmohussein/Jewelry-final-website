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
                    // --- NEW LOGIC: Handle login requirement ---
                    if (result.message && result.message.includes("log in")) {
                        alert(result.message); // Show the "Please log in" message
                        window.location.href = '/login'; // Redirect to the login page
                    } else {
                        alert("Failed to add to cart: " + (result.message || "Unknown error."));
                    }
                    // --- END NEW LOGIC ---
                }
            } catch (error) {
                console.error("Error adding to cart:", error);
                alert("Login to add to cart."); // More specific error message
            }
        });
    }
});
