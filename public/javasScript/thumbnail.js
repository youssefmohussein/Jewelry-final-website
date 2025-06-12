document.addEventListener("DOMContentLoaded", function () {
  const mainImage = document.getElementById("mainProductImage");

  if (mainImage) {
    mainImage.addEventListener("mouseenter", function () {
      const hoverSrc = this.getAttribute("data-hover");
      if (hoverSrc) {
        this.src = hoverSrc;
      }
    });

    mainImage.addEventListener("mouseleave", function () {
      const defaultSrc = this.getAttribute("data-default");
      if (defaultSrc) {
        this.src = defaultSrc;
      }
    });
  }

  const thumbnails = document.querySelectorAll(".thumb");
  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener("click", function () {
      thumbnails.forEach(t => t.classList.remove("active"));
      this.classList.add("active");

      const fullSrc = this.getAttribute("src").replace("thumb", "full");
      if (mainImage) {
        mainImage.style.opacity = "0";
        setTimeout(() => {
          mainImage.src = fullSrc;
          mainImage.setAttribute("data-default", fullSrc);
          mainImage.style.opacity = "1";
        }, 200);
      }
    });
  });
});
