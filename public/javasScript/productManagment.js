// Managing Product in Dahsboard
function openForm() {
  document.getElementById("collectionModal").style.display = "block";
}

function closeForm() {
  document.getElementById("collectionModal").style.display = "none";
}

async function addCollection() {

  const formData = new FormData();

  const collectionName = document.getElementById("collectionName").value.trim();
  const collectionImageInput = document.getElementById("collectionImage");

  if (!collectionName || collectionImageInput.files.length === 0) {
    alert("Please enter a collection name and select an image.");
    return;
  }

  formData.append("name", collectionName);
  formData.append("collectionImage", collectionImageInput.files[0]);

  try {
    const response = await fetch("/create", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert("Collection added successfully!");
      closeForm();
    } else {
      alert(`Failed to add collection: ${data.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error adding collection:", error);
    alert("Something went wrong while adding the collection.");
  }
}

function openProductForm() {
  document.getElementById("productModal").style.display = "block";
}

function closeProductForm() {
  document.getElementById("productModal").style.display = "none";
}

function openCollectionForm() {
  document.getElementById("collectionModal").style.display = "block";
}

function closeCollectionForm() {
  document.getElementById("collectionModal").style.display = "none";
}


//--------------------------------------------delete collection------------------------------//

function openDeleteCollectionModal() {
  document.getElementById("deleteCollectionModal").style.display = "block";
}

function closeDeleteCollectionModal() {
  document.getElementById("deleteCollectionModal").style.display = "none";
}

window.onclick = function (event) {
  const modal = document.getElementById("deleteCollectionModal");
  if (event.target === modal) {
    closeDeleteCollectionModal();
  }
};

function handleDeleteCollection() {
  const collectionName = document.getElementById("deleteCollectionName").value;
  if (!collectionName) {
    alert("Please select a collection to delete.");
    return;
  }
  if (
    confirm(
      `Are you sure you want to delete the collection: ${collectionName}?`
    )
  ) {
    fetch(`/collections/${encodeURIComponent(collectionName)}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Collection deleted successfully");
          location.reload();
        } else {
          response.json().then((data) => {
            alert(data.message || "Failed to delete the collection");
          });
        }
      })
      .catch((error) => {
        console.error("Error deleting collection:", error);
        alert("An error occurred while deleting the collection");
      });
  }
}

document
  .getElementById("deleteCollectionForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    handleDeleteCollection();
  });

//----------------------------------end of delete collection---------------//

async function addProduct() {
  const formData = new FormData();

  formData.append(
    "productNumber",
    document.getElementById("productNumber").value.trim().toUpperCase()
  );
  formData.append("name", document.getElementById("productName").value.trim());
  formData.append(
    "description",
    document.getElementById("description").value.trim()
  );
  formData.append("category", document.getElementById("category").value.trim());
  formData.append(
    "collection",
    document.getElementById("collection").value.trim()
  );
  formData.append("stock", document.getElementById("stock").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("totalSales", 0);

  const colors = document
    .getElementById("colors")
    .value.trim()
    .split(",")
    .map((c) => c.trim());
  formData.append("colors", JSON.stringify(colors));

  // Append main image
  const mainImageInput = document.getElementById("image");
  if (mainImageInput.files.length > 0) {
    formData.append("image", mainImageInput.files[0]);
  } else {
    alert("Main image is required.");
    return;
  }

  // Append hover image (optional)
  const hoverImageInput = document.getElementById("hoverImage");
  if (hoverImageInput && hoverImageInput.files.length > 0) {
    formData.append("hoverImage", hoverImageInput.files[0]);
  }

  try {
    const response = await fetch("/products", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert("Product added successfully!");
      closeProductForm();
    } else {
      alert(
        `Failed to add product: ${
          result.error || result.message || "Unknown error"
        }`
      );
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong while adding the product.");
  }
}

//----------------------------------------updata button----------------------------------------
// for opening the edit form

function handleEditClick(button) {
  const productData = button.getAttribute("data-product");

  try {
    const product = JSON.parse(productData);
    openEditForm(product);
  } catch (error) {
    console.error("Error parsing product data:", error);
  }
}
// update button fourm

function openEditForm(product) {
  const modal = document.getElementById("editProductModal");
  modal.style.display = "block";

  document.getElementById("editProductNumber").value = product.productNumber;
  document.getElementById("editProductName").value = product.name;
  document.getElementById("editDescription").value = product.description || "";
  document.getElementById("editColors").value = Array.isArray(product.colors)
    ? product.colors.join(", ")
    : product.colors;
  document.getElementById("editCategory").value = product.category;
  document.getElementById("editCollection").value = product.collection;
  document.getElementById("editStock").value = product.stock;
  document.getElementById("editPrice").value = product.price;
}
function closeEditProductForm() {
  document.getElementById("editProductModal").style.display = "none";
}

function submitEditProduct() {
  const formData = new FormData();

  const productNumber = document.getElementById("editProductNumber").value;
  formData.append("name", document.getElementById("editProductName").value);
  formData.append(
    "description",
    document.getElementById("editDescription").value
  );
  formData.append("colors", document.getElementById("editColors").value);
  formData.append("category", document.getElementById("editCategory").value);
  formData.append(
    "collection",
    document.getElementById("editCollection").value
  );
  formData.append("stock", document.getElementById("editStock").value);
  formData.append("price", document.getElementById("editPrice").value);

  const imageFile = document.getElementById("editImage").files[0];
  if (imageFile) {
    formData.append("image", imageFile);
  }

  fetch(`/products/${productNumber}`, {
    method: "PUT",
    body: formData,
  })
    .then((res) => {
      if (res.ok) {
        alert("Product updated successfully");
        location.reload();
      } else {
        alert("Failed to update product");
      }
    })
    .catch((err) => {
      console.error("Update error:", err);
    });
}

//----------------------------------------------------end---------------------------------
//---------------------------------------delete product -------------------------
function handleDeleteClick(button) {
  const product = JSON.parse(button.getAttribute("data-product"));
  if (
    confirm(`Are you sure you want to delete the product: ${product.name}?`)
  ) {
    fetch(`/products/${product.productNumber}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          alert("Product deleted successfully");
          location.reload();
        } else {
          alert("Failed to delete the product");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while deleting");
      });
  }
}

//----------------------------------------------------end---------------------------------

async function logout() {
  try {
    const response = await fetch("/logout", {
      method: "POST", // Sends a POST request
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    alert(result.message);

    if (response.ok) {
      window.location.href = "/"; // Redirects to the login page
    }
  } catch (err) {
    console.error("Error during logout:", err);
    alert("Something went wrong during logout.");
  }
}

function searchTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const tableRows = document.querySelectorAll("tbody tr");

  tableRows.forEach((row) => {
    const productNumber = row.cells[0].textContent.toLowerCase();
    const productName = row.cells[1].textContent.toLowerCase();

    if (productNumber.includes(input) || productName.includes(input)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
