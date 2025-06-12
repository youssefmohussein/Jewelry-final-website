document.addEventListener("DOMContentLoaded", function () {
    const thumbnails = document.querySelectorAll(".thumb");
    const mainImage = document.getElementById("mainProductImage");

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener("click", function () {
            // Remove 'active' class from all thumbnails
            thumbnails.forEach(t => t.classList.remove("active"));
            this.classList.add("active");

            // Smooth image transition
            mainImage.style.opacity = "0";
            setTimeout(() => {
                mainImage.src = this.dataset.full;
                mainImage.style.opacity = "1";
            }, 200);
        });
    });
});
