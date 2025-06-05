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
// The addProduct function you already have looks fine.

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

  formData.append("productNumber", document.getElementById("productNumber").value.trim().toUpperCase());
  formData.append("name", document.getElementById("productName").value.trim());
  formData.append("description", document.getElementById("description").value.trim());
  formData.append("category", document.getElementById("category").value.trim());
  formData.append("collection", document.getElementById("collection").value.trim());
  formData.append("stock", document.getElementById("stock").value);
  formData.append("price", document.getElementById("price").value);
  formData.append("totalSales", 0);

  const colors = document.getElementById("colors").value.trim().split(',').map(c => c.trim());
  formData.append("colors", JSON.stringify(colors));

  // taking images 
  const imageInput = document.getElementById("image");
  if (imageInput.files.length > 0) {
    formData.append("image", imageInput.files[0]);
  }

  try {
    const response = await fetch("/products", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      alert("Product added successfully!");
      closeProductForm();
    } else {
      alert(`Failed to add product: ${result.error || result.message || "Unknown error"}`);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong while adding the product.");
  }
}


