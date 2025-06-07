// Managing Product in Dahsboard
function openForm() {
  document.getElementById("collectionModal").style.display = "block";
}

function closeForm() {
  document.getElementById("collectionModal").style.display = "none";
}

async function addCollection() {
  const collectionName = document.getElementById("collectionName").value;
  const collectionImage = document.getElementById("collectionImage").value;

  // Validate the fields
  if (!collectionName || !collectionImage) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    // Send a POST request to create the collection
    const response = await fetch("/collections/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: collectionName,
        image: collectionImage,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Collection added successfully!");
      closeForm();
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error("Error adding collection:", error);
    alert("There was an error adding the collection.");
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

// Optional: Close modal when clicking outside of it
window.onclick = function (event) {
  const productModal = document.getElementById("productModal");
  const collectionModal = document.getElementById("collectionModal");

  if (event.target == productModal) {
    productModal.style.display = "none";
  }

  if (event.target == collectionModal) {
    collectionModal.style.display = "none";
  }
};

// Add Collection function
function addCollection() {
  const name = document.getElementById("collectionName").value;
  const image = document.getElementById("collectionImage").value;

  // Basic validation
  if (!name || !image) {
    alert("Please provide both Collection Name and Image URL.");
    return;
  }

  // Send POST request to the server
  fetch("/admin/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, image }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Collection created successfully") {
        alert("Collection added successfully!");
        closeCollectionForm(); // Close modal after successful creation
        // Optionally, refresh or update the page content
      } else {
        alert("Something went wrong. Try again.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to add collection.");
    });
}
// The addProduct function without img

/*async function addProduct() {
  const product = {
    productNumber: document
      .getElementById("productNumber")
      .value.trim()
      .toUpperCase(),
    name: document.getElementById("productName").value.trim(),
    description: document.getElementById("description").value.trim(),
    colors: document
      .getElementById("colors")
      .value.trim()
      .split(",")
      .map((c) => c.trim()),
    category: document.getElementById("category").value.trim(),
    collection: document.getElementById("collection").value.trim(),
    stock: parseInt(document.getElementById("stock").value),
    price: parseFloat(document.getElementById("price").value),
    image: document
      .getElementById("imageUrls")
      .value.trim()
      .split(",")
      .map((url) => url.trim()),
    totalSales: 0,
  };

  try {
    const response = await fetch("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
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
    console.error("Error submitting product:", err);
    alert("An error occurred while adding the product.");
  }
}*/

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

  // taking images
  const imageInput = document.getElementById("image");
  if (imageInput.files.length > 0) {
    formData.append("image", imageInput.files[0]);
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
  const orderData = button.getAttribute("data-order");

  try {
    const order = JSON.parse(orderData);
    openEditOrderForm(order);
  } catch (error) {
    console.error("Error parsing order data:", error);
  }
}

function openEditOrderForm(order) {
  const modal = document.getElementById("editOrderModal");
  modal.style.display = "block";

  document.getElementById("editOrderId").value = order.orderId || "";
  document.getElementById("editUserName").value = order.user?.name || "";
  document.getElementById("editPhone").value = order.phone || "";
  document.getElementById("editProducts").value = Array.isArray(
    order.product_ids
  )
    ? order.product_ids.map((p) => p.name || p).join(", ")
    : "";
  document.getElementById("editOrderDate").value = order.orderDate
    ? new Date(order.orderDate).toISOString().slice(0, 10)
    : "";
  document.getElementById("editQuantity").value = order.quantity || "";
  document.getElementById("editTotalPrice").value = order.total_price || "";
  document.getElementById("editStatus").value = order.status || "";
  document.getElementById("editPaymentMethod").value =
    order.Payment_method || "";

  // Shipping address fields
  if (order.shippingAddress) {
    document.getElementById("editAddress").value =
      order.shippingAddress.address || "";
    document.getElementById("editCity").value =
      order.shippingAddress.city || "";
    document.getElementById("editState").value =
      order.shippingAddress.state || "";
    document.getElementById("editPostalCode").value =
      order.shippingAddress.postalCode || "";
    document.getElementById("editCountry").value =
      order.shippingAddress.country || "";
  } else {
    document.getElementById("editAddress").value = "";
    document.getElementById("editCity").value = "";
    document.getElementById("editState").value = "";
    document.getElementById("editPostalCode").value = "";
    document.getElementById("editCountry").value = "";
  }
}

function closeEditOrderForm() {
  document.getElementById("editOrderModal").style.display = "none";
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

function logout() {
  // Redirect to login page
  window.location.href = "/login";
}
