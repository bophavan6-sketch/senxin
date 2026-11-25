
// ======================================
// SEN XIN - PRODUCT MANAGEMENT
// ======================================

const productForm = document.getElementById("productForm");
const productTableBody = document.getElementById("productTableBody");
const searchProductInput = document.getElementById("searchProduct");

const productNameInput = document.getElementById("productName");
const productCategoryInput = document.getElementById("productCategory");
const productBrandInput = document.getElementById("productBrand");
const productPriceInput = document.getElementById("productPrice");
const productStockInput = document.getElementById("productStock");
const productImageInput = document.getElementById("productImage");

const imageDropArea = document.getElementById("imageDropArea");
const imagePreview = document.getElementById("imagePreview");
const uploadMessage = document.getElementById("uploadMessage");
const chooseImageBtn = document.getElementById("chooseImageBtn");
const removeImageBtn = document.getElementById("removeImageBtn");

let selectedImage = "";
let editingProductId = null;


// ======================================
// IMAGE PREVIEW
// ======================================

function showImagePreview(image) {
    selectedImage = image || "";

    if (selectedImage) {
        imagePreview.src = selectedImage;
        imagePreview.style.display = "block";
        uploadMessage.style.display = "none";
        removeImageBtn.style.display = "inline-block";
    } else {
        imagePreview.removeAttribute("src");
        imagePreview.style.display = "none";
        uploadMessage.style.display = "block";
        removeImageBtn.style.display = "none";
    }
}


// ======================================
// READ SELECTED IMAGE
// ======================================

function loadSelectedImage(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }

    if (file.size > 1024 * 1024) {
        alert("Image is too large. Please choose an image under 1 MB.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        showImagePreview(event.target.result);
    };

    reader.onerror = function() {
        alert("Unable to read this image.");
    };

    reader.readAsDataURL(file);
}


// ======================================
// CHOOSE IMAGE
// ======================================

chooseImageBtn.addEventListener("click", function() {
    productImageInput.click();
});

imageDropArea.addEventListener("click", function(event) {
    if (event.target.closest("button")) return;
    productImageInput.click();
});

productImageInput.addEventListener("change", function() {
    loadSelectedImage(this.files[0]);
});


// ======================================
// DRAG & DROP
// ======================================

imageDropArea.addEventListener("dragover", function(event) {
    event.preventDefault();
    imageDropArea.classList.add("drag-over");
});

imageDropArea.addEventListener("dragleave", function() {
    imageDropArea.classList.remove("drag-over");
});

imageDropArea.addEventListener("drop", function(event) {
    event.preventDefault();
    imageDropArea.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];
    loadSelectedImage(file);
});


// ======================================
// REMOVE IMAGE
// ======================================

removeImageBtn.addEventListener("click", function() {
    showImagePreview("");
    productImageInput.value = "";
});


// ======================================
// CANCEL EDIT BUTTON
// ======================================

const cancelEditButton = document.createElement("button");

cancelEditButton.type = "button";
cancelEditButton.textContent = "Cancel Edit";
cancelEditButton.style.cssText = `
    display: none;
    background: #64748B;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    cursor: pointer;
`;

productForm.appendChild(cancelEditButton);


// ======================================
// LOAD PRODUCTS
// ======================================

function getProducts() {
    try {
        const products = JSON.parse(
            localStorage.getItem("senXinProducts")
        );

        return Array.isArray(products) ? products : [];

    } catch (error) {
        console.error("Error loading products:", error);
        return [];
    }
}


// ======================================
// SAVE PRODUCTS
// ======================================

function saveProducts(products) {
    try {
        localStorage.setItem(
            "senXinProducts",
            JSON.stringify(products)
        );

        return true;

    } catch (error) {
        console.error("Error saving products:", error);
        alert("Unable to save. Browser storage may be full.");
        return false;
    }
}


// ======================================
// DISPLAY PRODUCTS
// ======================================

function displayProducts(products) {
    productTableBody.innerHTML = "";

    if (products.length === 0) {
        productTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No products found.
                </td>
            </tr>
        `;
        return;
    }

    products.forEach((product, index) => {
        const row = document.createElement("tr");

        const values = [
            index + 1,
            product.name,
            product.category,
            product.brand || "Other",
            "$" + Number(product.price).toFixed(2),
            product.stock
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");

        // EDIT BUTTON
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.style.cssText = `
            background: #2563EB;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 6px;
        `;

        editButton.addEventListener("click", function() {
            editProduct(product.id);
        });

        // DELETE BUTTON
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.style.cssText = `
            background: #DC2626;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
        `;

        deleteButton.addEventListener("click", function() {
            deleteProduct(product.id);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);
        productTableBody.appendChild(row);
    });
}


// ======================================
// RESET FORM
// ======================================

function resetProductForm() {
    productForm.reset();

    editingProductId = null;

    productImageInput.value = "";
    showImagePreview("");

    const submitButton = productForm.querySelector(
        'button[type="submit"]'
    );

    submitButton.textContent = "Add Product";
    cancelEditButton.style.display = "none";
}


// ======================================
// EDIT PRODUCT
// ======================================

function editProduct(productId) {
    const products = getProducts();

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    editingProductId = productId;

    productNameInput.value = product.name;
    productCategoryInput.value = product.category;
    productBrandInput.value = product.brand || "Other";
    productPriceInput.value = product.price;
    productStockInput.value = product.stock;

    // Keep the existing image when editing
    productImageInput.value = "";
    showImagePreview(product.image || "");

    const submitButton = productForm.querySelector(
        'button[type="submit"]'
    );

    submitButton.textContent = "Update Product";
    cancelEditButton.style.display = "inline-block";

    productForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// ======================================
// CANCEL EDIT
// ======================================

cancelEditButton.addEventListener("click", function() {
    resetProductForm();
});


// ======================================
// ADD / UPDATE PRODUCT
// ======================================

productForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = productNameInput.value.trim();
    const category = productCategoryInput.value;
    const price = Number(productPriceInput.value);
    const stock = Number(productStockInput.value);
    const brand = productBrandInput.value;

    if (
        !name ||
        !category ||
        !brand ||
        productPriceInput.value.trim() === "" ||
        productStockInput.value.trim() === "" ||
        price < 0 ||
        stock < 0 ||
        !Number.isFinite(price) ||
        !Number.isInteger(stock)
    ) {
        alert("Please enter valid product information.");
        return;
    }

    const products = getProducts();

    // UPDATE EXISTING PRODUCT
    if (editingProductId !== null) {
        const productIndex = products.findIndex(
            product => product.id === editingProductId
        );

        if (productIndex === -1) {
            alert("Product not found.");
            resetProductForm();
            return;
        }

        products[productIndex] = {
                ...products[productIndex],
                name: name,
                category: category,
                brand: brand,
                price: price,
                stock: stock,
                image: selectedImage
            };

        if (!saveProducts(products)) return;

        displayProducts(products);
        resetProductForm();

        alert("Product updated successfully!");
        return;
    }

    // ADD NEW PRODUCT
    const newProduct = {
        id: "SX-PROD-" + Date.now(),
        name: name,
        category: category,
        price: price,
        stock: stock,
        image: selectedImage
    };

    products.push(newProduct);

    if (!saveProducts(products)) return;

    displayProducts(products);
    resetProductForm();

    alert("Product added successfully!");
});


// ======================================
// DELETE PRODUCT
// ======================================

function deleteProduct(productId) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    const products = getProducts();

    const updatedProducts = products.filter(
        product => product.id !== productId
    );

    if (!saveProducts(updatedProducts)) return;

    displayProducts(updatedProducts);

    if (editingProductId === productId) {
        resetProductForm();
    }

    alert("Product deleted successfully!");
}


// ======================================
// SEARCH PRODUCTS
// ======================================

function searchProducts() {
    const keyword = searchProductInput.value.trim().toLowerCase();

    const products = getProducts();

    const filteredProducts = products.filter(product =>
        (product.name || "").toLowerCase().includes(keyword) ||
        (product.category || "").toLowerCase().includes(keyword) ||
        (product.brand || "").toLowerCase().includes(keyword)
    );

    displayProducts(filteredProducts);
}

searchProductInput.addEventListener("input", searchProducts);


// ======================================
// INITIALIZE
// ======================================

displayProducts(getProducts());

console.log("SEN XIN Product Management Loaded!");
