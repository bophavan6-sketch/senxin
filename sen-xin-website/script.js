
// =====================================
// 1. PRODUCT DATA
// =====================================

// Original products
const defaultProducts = [
    {
        id: 1,
        nameKey: "iphoneProduct",
        descriptionKey: "iphoneProductDesc",
        price: 5.00,
        image: "images/iphone-case.jpg"
    },
    {
        id: 2,
        nameKey: "samsungProduct",
        descriptionKey: "samsungProductDesc",
        price: 4.00,
        image: "images/samsung-case.png"
    },
    {
        id: 3,
        nameKey: "macbookProduct",
        descriptionKey: "macbookProductDesc",
        price: 25.00,
        image: "images/macbook-charger.jpg"
    }
];

// Load products added from Admin Dashboard
function getAdminProducts() {
    try {
        const savedProducts = JSON.parse(
            localStorage.getItem("senXinProducts")
        );

        return Array.isArray(savedProducts) ? savedProducts : [];
    } catch (error) {
        console.error("Error loading admin products:", error);
        return [];
    }
}

// Combine original and admin products
const products = [
    ...defaultProducts,
    ...getAdminProducts().map(function(product) {
        return {
            id: product.id,
            name: product.name,
            description: product.category,
            price: Number(product.price),
            image: product.image || "",
            nameKey: null,
            descriptionKey: null
        };
    })
];

// Escape text before inserting it into HTML
function escapeProductHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function(char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

// Display all products
function displayProducts() {
    const container = document.getElementById("productContainer");

    if (!container) return;

    container.innerHTML = products.map(function(product) {
        const name = product.nameKey
            ? translations[currentLanguage]?.[product.nameKey] || product.nameKey
            : product.name;

        const description = product.descriptionKey
            ? translations[currentLanguage]?.[product.descriptionKey] || ""
            : product.description || "";

        const image = product.image
    ? escapeProductHTML(product.image)
    : "";

        return `
            <div class="product-card" data-product-id="${product.id}">
                ${image
    ? `<img src="${image}" alt="${escapeProductHTML(name)}">`
    : `<div class="no-product-image">No Image Available</div>`
}

                <h3>${escapeProductHTML(name)}</h3>

                <p>${escapeProductHTML(description)}</p>

                <p class="price">$${Number(product.price).toFixed(2)}</p>

                <button type="button" class="view-details">
                    ${translations[currentLanguage].viewDetails}
                </button>

                <button type="button" class="add-to-cart">
                    ${translations[currentLanguage].addToCart}
                </button>

                <a href="https://t.me/LYMENG_157"
                   target="_blank"
                   rel="noopener noreferrer">
                    ${translations[currentLanguage].contactUs}
                </a>
            </div>
        `;
    }).join("");
}





// =====================================
// 2. LANGUAGE TRANSLATIONS
// =====================================

const translations = {
    en: {
        contactTitle: "Contact SEN XIN",
        contactSubtitle: "We are ready to serve you. Contact us today!",
        chatWithUs: "Chat With Us",
        businessType: "Business Type",
        wholesaleRetail: "Wholesale & Retail",
        businessProducts: "Phone & Computer Accessories",

        home: "Home",
        categories: "Categories",
        products: "Products",
        contact: "Contact",

        welcome: "Welcome to SEN XIN Store",
        tagline: "Your Trusted Mobile Accessories Store",
        wholesale: "Wholesale and Retail Mobile Accessories",
        quality: "Quality Products at Competitive Prices",
        explore: "Explore Products",

        shopCategory: "Shop By Category",
        exploreCategory: "Explore our product categories",
        iphone: "iPhone Accessories",
        iphoneDesc: "Cases, Chargers, Cables and More.",
        samsung: "Samsung Accessories",
        samsungDesc: "Cases, Chargers, Screen Protectors and More.",
        macbook: "MacBook Accessories",
        macbookDesc: "Chargers and Charging Cables.",

        bestSellers: "Our Best Sellers",
        popularProducts: "Discover our popular products",
        searchProducts: "Search products...",
        iphoneProduct: "Premium iPhone Case",
        iphoneProductDesc: "Stylish and durable protection for your iPhone.",
        samsungProduct: "Samsung Case",
        samsungProductDesc: "Durable protection for Samsung smartphones.",
        macbookProduct: "MacBook Charger",
        macbookProductDesc: "Reliable charging adapter for MacBook devices.",
        viewDetails: "View Details",
        addToCart: "Add to Cart",
        contactUs: "Contact Us",

        shoppingCart: "Shopping Cart",
        totalItems: "Total Items:",
        clearCart: "Clear Cart",
        checkout: "Checkout",

        customerInfo: "Customer Information",
        orderSummary: "Order Summary",
        totalPrice: "Total Price: $",
        fullName: "Full Name",
        phoneNumber: "Phone Number",
        deliveryAddress: "Delivery Address",
        paymentMethod: "Payment Method",
        selectPayment: "Select Payment Method",
        cashOnDelivery: "Cash on Delivery",
        orderNotes: "Order Notes",
        placeOrder: "Place Order",
        enterFullName: "Enter your full name",
        enterPhone: "Enter your phone number",
        enterAddress: "Enter your delivery address",
        additionalInfo: "Additional information",

        footerDescription: "Wholesale & Retail Mobile Accessories",
        copyright: "© 2026 SEN XIN. All Rights Reserved."
    },

    km: {
        contactTitle: "ទាក់ទង SEN XIN",
        contactSubtitle: "យើងត្រៀមខ្លួនរួចជាស្រេចក្នុងការបម្រើអ្នក។ សូមទាក់ទងមកយើងថ្ងៃនេះ!",
        chatWithUs: "ជជែកជាមួយយើង",
        businessType: "ប្រភេទអាជីវកម្ម",
        wholesaleRetail: "លក់ដុំ និងលក់រាយ",
        businessProducts: "គ្រឿងបន្លាស់ទូរស័ព្ទ និងកុំព្យូទ័រ",

        home: "ទំព័រដើម",
        categories: "ប្រភេទផលិតផល",
        products: "ផលិតផល",
        contact: "ទំនាក់ទំនង",

        welcome: "សូមស្វាគមន៍មកកាន់ហាង SEN XIN",
        tagline: "ហាងលក់គ្រឿងបន្លាស់ទូរស័ព្ទដែលអ្នកទុកចិត្ត",
        wholesale: "លក់ដុំ និងលក់រាយគ្រឿងបន្លាស់ទូរស័ព្ទ",
        quality: "ផលិតផលមានគុណភាព តម្លៃសមរម្យ",
        explore: "មើលផលិតផល",

        shopCategory: "ជ្រើសរើសតាមប្រភេទផលិតផល",
        exploreCategory: "ស្វែងយល់ពីប្រភេទផលិតផលរបស់យើង",
        iphone: "គ្រឿងបន្លាស់ iPhone",
        iphoneDesc: "ស្រោមទូរស័ព្ទ ឆ្នាំងសាក ខ្សែសាក និងផ្សេងៗទៀត",
        samsung: "គ្រឿងបន្លាស់ Samsung",
        samsungDesc: "ស្រោមទូរស័ព្ទ ឆ្នាំងសាក កញ្ចក់ការពារ និងផ្សេងៗទៀត",
        macbook: "គ្រឿងបន្លាស់ MacBook",
        macbookDesc: "ឆ្នាំងសាក និងខ្សែសាក",

        bestSellers: "ផលិតផលលក់ដាច់ជាងគេ",
        popularProducts: "ស្វែងយល់ពីផលិតផលពេញនិយមរបស់យើង",
        searchProducts: "ស្វែងរកផលិតផល...",
        iphoneProduct: "ស្រោម iPhone គុណភាពខ្ពស់",
        iphoneProductDesc: "ស្រោមស្អាត និងរឹងមាំសម្រាប់ការពារ iPhone របស់អ្នក",
        samsungProduct: "ស្រោម Samsung",
        samsungProductDesc: "ការពារទូរស័ព្ទ Samsung ឱ្យបានរឹងមាំ",
        macbookProduct: "ឆ្នាំងសាក MacBook",
        macbookProductDesc: "ឆ្នាំងសាកដែលអាចទុកចិត្តបានសម្រាប់ MacBook",
        viewDetails: "មើលព័ត៌មានលម្អិត",
        addToCart: "បន្ថែមទៅកន្ត្រក",
        contactUs: "ទាក់ទងមកយើង",

        shoppingCart: "កន្ត្រកទំនិញ",
        totalItems: "ចំនួនផលិតផលសរុប៖",
        clearCart: "សម្អាតកន្ត្រកទំនិញ",
        checkout: "បន្តការបញ្ជាទិញ",

        customerInfo: "ព័ត៌មានអតិថិជន",
        orderSummary: "សង្ខេបការបញ្ជាទិញ",
        totalPrice: "តម្លៃសរុប៖ $",
        fullName: "ឈ្មោះពេញ",
        phoneNumber: "លេខទូរស័ព្ទ",
        deliveryAddress: "អាសយដ្ឋានដឹកជញ្ជូន",
        paymentMethod: "វិធីបង់ប្រាក់",
        selectPayment: "ជ្រើសរើសវិធីបង់ប្រាក់",
        cashOnDelivery: "បង់ប្រាក់ពេលទទួលទំនិញ",
        orderNotes: "កំណត់ចំណាំការបញ្ជាទិញ",
        placeOrder: "បញ្ជាទិញ",
        enterFullName: "បញ្ចូលឈ្មោះពេញរបស់អ្នក",
        enterPhone: "បញ្ចូលលេខទូរស័ព្ទរបស់អ្នក",
        enterAddress: "បញ្ចូលអាសយដ្ឋានដឹកជញ្ជូន",
        additionalInfo: "ព័ត៌មានបន្ថែម",

        footerDescription: "លក់ដុំ និងលក់រាយគ្រឿងបន្លាស់ទូរស័ព្ទ",
        copyright: "© 2026 SEN XIN. រក្សាសិទ្ធិគ្រប់យ៉ាង។"
    },

    zh: {
        contactTitle: "联系 SEN XIN",
        contactSubtitle: "我们随时准备为您服务，欢迎今天联系我们！",
        chatWithUs: "联系我们",
        businessType: "业务类型",
        wholesaleRetail: "批发与零售",
        businessProducts: "手机及电脑配件",

        home: "首页",
        categories: "产品分类",
        products: "产品",
        contact: "联系我们",

        welcome: "欢迎来到 SEN XIN 商店",
        tagline: "值得信赖的手机配件商店",
        wholesale: "手机配件批发与零售",
        quality: "优质产品，价格实惠",
        explore: "浏览产品",

        shopCategory: "按类别选购",
        exploreCategory: "探索我们的产品类别",
        iphone: "iPhone 配件",
        iphoneDesc: "手机壳、充电器、数据线等",
        samsung: "Samsung 配件",
        samsungDesc: "手机壳、充电器、屏幕保护膜等",
        macbook: "MacBook 配件",
        macbookDesc: "充电器和充电线",

        bestSellers: "热销产品",
        popularProducts: "了解我们的热门产品",
        searchProducts: "搜索产品...",
        iphoneProduct: "高品质 iPhone 手机壳",
        iphoneProductDesc: "时尚耐用，为您的 iPhone 提供保护",
        samsungProduct: "Samsung 手机壳",
        samsungProductDesc: "为 Samsung 手机提供耐用保护",
        macbookProduct: "MacBook 充电器",
        macbookProductDesc: "适用于 MacBook 的可靠充电器",
        viewDetails: "查看详情",
        addToCart: "加入购物车",
        contactUs: "联系我们",

        shoppingCart: "购物车",
        totalItems: "商品总数：",
        clearCart: "清空购物车",
        checkout: "结账",

        customerInfo: "客户信息",
        orderSummary: "订单摘要",
        totalPrice: "总价：$",
        fullName: "姓名",
        phoneNumber: "电话号码",
        deliveryAddress: "配送地址",
        paymentMethod: "付款方式",
        selectPayment: "选择付款方式",
        cashOnDelivery: "货到付款",
        orderNotes: "订单备注",
        placeOrder: "提交订单",
        enterFullName: "请输入您的姓名",
        enterPhone: "请输入您的电话号码",
        enterAddress: "请输入配送地址",
        additionalInfo: "其他信息",

        footerDescription: "手机配件批发与零售",
        copyright: "© 2026 SEN XIN. 版权所有。"
    }
};


// =====================================
// 3. CURRENT LANGUAGE
// =====================================

let currentLanguage = "en";

// Display products after translations are ready
displayProducts();

// Get product cards after displaying them
const productCards = document.querySelectorAll(".product-card");
// =====================================
// 4. SHOPPING CART DATA
// =====================================

// Load saved cart safely
let cart = [];

try {
    const savedCart = JSON.parse(
        localStorage.getItem("senXinCart")
    );

    if (Array.isArray(savedCart)) {
        cart = savedCart.filter(function(product) {
            return product &&
               (typeof product.id === "string" || Number.isInteger(product.id)) &&
                typeof product.price === "number" &&
                typeof product.quantity === "number" &&
                product.quantity > 0;
        });
    }
} catch (error) {
    cart = [];
}


// =====================================
// 5. CART ELEMENTS
// =====================================

const cartCountElement = document.getElementById("cartCount");
const cartItemsElement = document.getElementById("cartItems");
const totalPriceElement = document.getElementById("totalPrice");

const orderSummaryItemsElement =
    document.getElementById("orderSummaryItems");

const orderSummaryCountElement =
    document.getElementById("orderSummaryCount");

const orderSummaryTotalElement =
    document.getElementById("orderSummaryTotal");


// =====================================
// 6. PRODUCT NAME TRANSLATION
// =====================================

function getProductName(product) {
    const productData = products.find(function(item) {
        return item.id === product.id;
    });

    if (!productData) {
        return product.name;
    }

    if (productData.nameKey) {
        return translations[currentLanguage][productData.nameKey];
    }

    return productData.name || product.name;
}


// =====================================
// 7. DISPLAY CART FUNCTION
// =====================================

function displayCart() {

    // Save cart to browser
    localStorage.setItem(
        "senXinCart",
        JSON.stringify(cart)
    );

    cartItemsElement.innerHTML = "";
    orderSummaryItemsElement.innerHTML = "";

    let total = 0;
    let totalItems = 0;

    cart.forEach(function(product, index) {

        total += product.price * product.quantity;
        totalItems += product.quantity;

        // Product name
        const listItem = document.createElement("li");

        const productName = document.createElement("span");

        productName.textContent =
            getProductName(product) +
            " - $" +
            product.price.toFixed(2);

        // Quantity controls
        const quantityControls = document.createElement("div");

        quantityControls.className = "quantity-controls";

        // Minus button
        const minusButton = document.createElement("button");

        minusButton.textContent = "-";

        minusButton.addEventListener("click", function() {

            if (product.quantity > 1) {
                product.quantity--;
            } else {
                cart.splice(index, 1);
            }

            displayCart();
        });

        // Quantity number
        const quantityNumber = document.createElement("span");

        quantityNumber.textContent = product.quantity;

        // Plus button
        const plusButton = document.createElement("button");

        plusButton.textContent = "+";

        plusButton.addEventListener("click", function() {

            product.quantity++;

            displayCart();
        });

        // Remove button
        const removeButton = document.createElement("button");

        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", function() {

            cart.splice(index, 1);

            displayCart();
        });

        // Add elements to cart
        quantityControls.appendChild(minusButton);
        quantityControls.appendChild(quantityNumber);
        quantityControls.appendChild(plusButton);

        listItem.appendChild(productName);
        listItem.appendChild(quantityControls);
        listItem.appendChild(removeButton);

        cartItemsElement.appendChild(listItem);

        // Order summary
        const summaryItem = document.createElement("li");

        summaryItem.textContent =
            getProductName(product) +
            " x " +
            product.quantity +
            " - $" +
            (product.price * product.quantity).toFixed(2);

        orderSummaryItemsElement.appendChild(summaryItem);
    });

    // Update cart count
    cartCountElement.textContent = totalItems;

    // Update cart total
    totalPriceElement.textContent = total.toFixed(2);

    // Update order summary count
    orderSummaryCountElement.textContent = totalItems;

    // Update order summary total
    orderSummaryTotalElement.textContent = total.toFixed(2);
}


// =====================================
// 8. ADD TO CART FROM PRODUCT CARDS
// =====================================

const addToCartButtons = document.querySelectorAll(
    ".product-card .add-to-cart"
);

addToCartButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const productCard = button.closest(".product-card");

        const productIndex = Array.from(productCards).indexOf(productCard);

        const productData = products[productIndex];

        if (!productData) {
            return;
        }

        const productName =
            productCard.querySelector("h3").textContent;

        const existingProduct = cart.find(function(product) {
            return product.id === productData.id;
        });

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                id: productData.id,
                name: productName,
                price: productData.price,
                quantity: 1
            });
        }

        displayCart();
    });
});



// =====================================
// 9. PRODUCT DETAILS POPUP
// =====================================

const productModal = document.getElementById("productModal");
const closeModalButton = document.getElementById("closeModal");

const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");

const modalAddToCartButton =
    document.getElementById("modalAddToCart");

let selectedPopupProduct = null;


// Open popup - supports original and Admin products
const productContainer = document.getElementById("productContainer");

productContainer.addEventListener("click", function(event) {

    const button = event.target.closest(".view-details");

    if (!button) return;

    const productCard = button.closest(".product-card");

    if (!productCard) return;

    const productData = products.find(function(product) {
        return String(product.id) === productCard.dataset.productId;
    });

    if (!productData) {
        console.error("Product not found:", productCard.dataset.productId);
        return;
    }

    const productImage = productCard.querySelector("img");
    const productPrice = productCard.querySelector(".price");

    if (productImage) {
        modalImage.src = productImage.src;
        modalImage.alt = productImage.alt;
        modalImage.style.display = "block";
    } else {
        modalImage.removeAttribute("src");
        modalImage.style.display = "none";
    }

    modalName.textContent = getProductName({
        id: productData.id,
        name: productData.name
    });

    modalPrice.textContent = productPrice
        ? productPrice.textContent
        : "$" + Number(productData.price).toFixed(2);

    modalDescription.textContent = productData.descriptionKey
        ? translations[currentLanguage][productData.descriptionKey] || ""
        : productData.description || "";

    selectedPopupProduct = {
        id: productData.id,
        name: modalName.textContent,
        price: Number(productData.price)
    };

    modalAddToCartButton.textContent =
        translations[currentLanguage].addToCart;

    productModal.style.display = "flex";
});


// Close popup button
closeModalButton.addEventListener("click", function() {
    productModal.style.display = "none";
});


// Close popup when clicking outside
productModal.addEventListener("click", function(event) {
    if (event.target === productModal) {
        productModal.style.display = "none";
    }
});



// =====================================
// 10. ADD TO CART FROM POPUP
// =====================================

modalAddToCartButton.addEventListener("click", function() {

    if (!selectedPopupProduct) {
        return;
    }

    const existingProduct = cart.find(function(item) {
        return item.id === selectedPopupProduct.id;
    });

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            id: selectedPopupProduct.id,
            name: selectedPopupProduct.name,
            price: selectedPopupProduct.price,
            quantity: 1
        });
    }

    displayCart();

    productModal.style.display = "none";
});


// =====================================
// 11. PRODUCT SEARCH
// =====================================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", function() {

        const searchText = searchInput.value.toLowerCase();

        productCards.forEach(function(card) {

            const productName =
                card.querySelector("h3").textContent.toLowerCase();

            if (productName.includes(searchText)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
}


// =====================================
// 12. CLEAR SHOPPING CART
// =====================================

const clearCartButton = document.getElementById("clearCart");

clearCartButton.addEventListener("click", function() {

    cart = [];

    displayCart();
});


// =====================================
// 13. CHECKOUT FORM
// =====================================

const checkoutButton = document.getElementById("checkoutButton");

const checkoutForm = document.getElementById("checkoutForm");

checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your shopping cart is empty!");

        return;
    }

    checkoutForm.style.display = "block";

    checkoutForm.scrollIntoView({
        behavior: "smooth"
    });
});



// =====================================
// 14. PLACE ORDER & SAVE ORDERS
// =====================================

const placeOrderButton = document.getElementById("placeOrder");
console.log("Place Order Button:", placeOrderButton);

placeOrderButton.addEventListener("click", function() {
    console.log("Place Order button clicked!");


    const customerName =
        document.getElementById("customerName").value.trim();

    const customerPhone =
        document.getElementById("customerPhone").value.trim();

    const customerAddress =
        document.getElementById("customerAddress").value.trim();

    const paymentMethod =
        document.getElementById("paymentMethod").value;

    const orderNotes =
        document.getElementById("orderNotes").value.trim();


    // Check required information
    if (
        customerName === "" ||
        customerPhone === "" ||
        customerAddress === "" ||
        paymentMethod === ""
    ) {
        alert("Please complete all required information!");
        return;
    }

    // Check shopping cart
    if (cart.length === 0) {
        alert("Your shopping cart is empty!");
        return;
    }


    // Calculate total items
    const totalItems = cart.reduce(function(sum, product) {
        return sum + product.quantity;
    }, 0);


    // Calculate total price
    const totalPrice = cart.reduce(function(sum, product) {
        return sum + product.price * product.quantity;
    }, 0);


    // Create order information
    const newOrder = {
        orderId: "SX-" + Date.now(),

        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,

        paymentMethod: paymentMethod,
        orderNotes: orderNotes,

        products: cart.map(function(product) {
            return {
                id: product.id,
                name: getProductName(product),
                price: product.price,
                quantity: product.quantity
            };
        }),

        totalItems: totalItems,
        totalPrice: totalPrice,

        orderDate: new Date().toLocaleString(),

        status: "Pending"
    };


    // Load previously saved orders
    let orders = [];

    try {
        const savedOrders = JSON.parse(localStorage.getItem("senXinOrders")
        );

        if (Array.isArray(savedOrders)) {
            orders = savedOrders;
        }

    } catch (error) {
        orders = [];
    }


    // Save new order
    orders.push(newOrder);

    localStorage.setItem(
        "senXinOrders",
        JSON.stringify(orders)
    );
    console.log("Saved Orders:", orders);


    // Show confirmation
    alert(
        "Thank you for your order!\n\n" +
        "Order ID: " + newOrder.orderId + "\n" +
        "Name: " + customerName + "\n" +
        "Phone: " + customerPhone + "\n" +
        "Total Items: " + totalItems + "\n" +
        "Total Price: $" + totalPrice.toFixed(2) + "\n" +
        "Status: Pending"
    );


    // Clear shopping cart
    cart = [];

    displayCart();


    // Reset customer information
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerAddress").value = "";
    document.getElementById("paymentMethod").value = "";
    document.getElementById("orderNotes").value = "";


    // Hide checkout form
    checkoutForm.style.display = "none";

});



// =====================================
// 15. LANGUAGE SWITCHER
// =====================================

const languageSelect = document.getElementById("languageSelect");

if (languageSelect) {

    languageSelect.addEventListener("change", function() {

        const selectedLanguage = languageSelect.value;

        currentLanguage = selectedLanguage;

        // Translate normal text
        document.querySelectorAll("[data-i18n]").forEach(function(element) {

            const translationKey = element.dataset.i18n;

            if (translations[selectedLanguage][translationKey]) {
                element.textContent =
                    translations[selectedLanguage][translationKey];
            }
        });

        // Translate placeholders
        document.querySelectorAll("[data-i18n-placeholder]").forEach(function(element) {

            const translationKey = element.dataset.i18nPlaceholder;

            if (translations[selectedLanguage][translationKey]) {
                element.placeholder =
                    translations[selectedLanguage][translationKey];
            }
        });

        // Translate popup button
        modalAddToCartButton.textContent =
            translations[selectedLanguage].addToCart;

        // Refresh cart names and order summary
        displayCart();
    });
}


// =====================================
// 16. LOAD AND DISPLAY SAVED CART
// =====================================

// This must stay at the bottom of the file.
// All translations and functions are ready before this runs.

displayCart();
