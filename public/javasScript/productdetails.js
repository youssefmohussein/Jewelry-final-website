document.addEventListener("DOMContentLoaded", function () {
    const decreaseBtn = document.querySelector('.decrease-btn');
    const increaseBtn = document.querySelector('.increase-btn');
    const quantityInput = document.querySelector('.quantity-input');
    const addToCartBtn = document.getElementById("addToCart");

    increaseBtn.addEventListener('click', () => quantityInput.value = parseInt(quantityInput.value) + 1);
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) quantityInput.value = currentValue - 1;
    });

    addToCartBtn.addEventListener("click", function () {
        const productName = document.querySelector(".pdetails h2").textContent.trim();
        const priceText = document.querySelector(".pdetails p").textContent.trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));
        const imageSrc = document.getElementById("productImage").getAttribute("src");
        const quantity = parseInt(quantityInput.value);

        if (quantity <= 0) {
            alert("Please select a quantity greater than 0.");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingIndex = cart.findIndex(p => p.name === productName);
        if (existingIndex !== -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({ name: productName, price: price, quantity: quantity, image: imageSrc });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.href = "../Add to cart/Add-to-cart.html";
    });
});
