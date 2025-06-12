document.addEventListener("DOMContentLoaded", function () {
    const productImage = document.getElementById("mainProductImage");
    const colorSwatches = document.querySelectorAll(".color-swatch");
    const thumbnails = document.querySelectorAll(".thumb");
    const imagePaths = {
        // oval buckle
        "WOBR": "../collections/minmal images/oval buckle/white.png",
        "BLOBR": "../collections/minmal images/oval buckle/blue.png",
        "BOBR": "../collections/minmal images/oval buckle/black.png",
        // lane
        "Wlane": "../collections/minmal images/lane bracelete/Lane Light white.png",
        "Plane": "../collections/minmal images/lane bracelete/Lane Light Pink.png",
        "Blane": "../collections/minmal images/lane bracelete/Lane Light Black.png",
        "BLlane": "../collections/minmal images/lane bracelete/Lane Light Blue.png",

    };

    colorSwatches.forEach(swatch => {
        swatch.addEventListener("click", function () {
            let selectedColor = this.dataset.color;

            // Remove 'active' class from all swatches
            colorSwatches.forEach(s => s.classList.remove("active"));
            this.classList.add("active");

            // Smooth fade-out and change image
            productImage.style.opacity = "0";
            setTimeout(() => {
                productImage.src = imagePaths[selectedColor];
                productImage.style.opacity = "1";
            }, 300);
            thumbnails.forEach(t => t.style.display = "none");

            // Show only thumbnails that match the selected color
            thumbnails.forEach(thumbnail => {
                if (thumbnail.dataset.color === selectedColor || thumbnail.dataset.color === "none") {
                    thumbnail.style.display = "block"; // Show only related thumbnails
                }
            });
        });
    });
});
