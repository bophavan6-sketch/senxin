// ==============================
// CHECK ADMIN LOGIN
// ==============================

if (sessionStorage.getItem("senXinAdminLoggedIn") !== "true") {
    window.location.href = "login.html";
}
// ======================================
// SEN XIN - ADMIN ORDER MANAGEMENT
// ======================================

// 1. LOAD ORDERS FROM LOCAL STORAGE
function getOrders() {
    try {
        const savedOrders = JSON.parse(
            localStorage.getItem("senXinOrders")
        );

        return Array.isArray(savedOrders) ? savedOrders : [];
    } catch (error) {
        console.error("Error loading orders:", error);
        return [];
    }
}

// 2. GET HTML ELEMENTS
const totalOrdersElement = document.getElementById("totalOrders");
const pendingOrdersElement = document.getElementById("pendingOrders");
const completedOrdersElement = document.getElementById("completedOrders");
const totalRevenueElement = document.getElementById("totalRevenue");
const orderTableBody = document.getElementById("orderTableBody");

const searchOrderInput = document.getElementById("searchOrder");
const filterOrderStatus = document.getElementById("filterOrderStatus");
const filterStartDate = document.getElementById("filterStartDate");
const filterEndDate = document.getElementById("filterEndDate");
const resetOrderFiltersButton = document.getElementById("resetOrderFilters");

// 3. DISPLAY DASHBOARD STATISTICS
function displayStatistics(orders) {
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(order =>
        (order.status || "Pending") === "Pending"
    ).length;

    const completedOrders = orders.filter(order =>
        order.status === "Completed"
    ).length;

    const totalRevenue = orders
        .filter(order => order.status !== "Cancelled")
        .reduce((total, order) => {
            return total + (Number(order.totalPrice) || 0);
        }, 0);

    totalOrdersElement.textContent = totalOrders;
    pendingOrdersElement.textContent = pendingOrders;
    completedOrdersElement.textContent = completedOrders;
    totalRevenueElement.textContent = "$" + totalRevenue.toFixed(2);
}

// CONVERT ORDER DATE TO YYYY-MM-DD
function getLocalOrderDate(orderDateValue) {
    if (!orderDateValue) return "";

    const date = new Date(orderDateValue);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// 4. DISPLAY ORDER TABLE
function displayOrders(orders) {
    orderTableBody.innerHTML = "";

    if (orders.length === 0) {
        orderTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No orders found.
                </td>
            </tr>
        `;
        return;
    }

    orders.forEach(order => {
        const row = document.createElement("tr");

        // ORDER INFORMATION
        const values = [
            order.orderId || "-",
            order.customerName || "-",
            order.customerPhone || "-",
            "$" + (Number(order.totalPrice) || 0).toFixed(2)
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // STATUS DROPDOWN
        const statusCell = document.createElement("td");
        const statusSelect = document.createElement("select");

        const statuses = [
            "Pending",
            "Confirmed",
            "Processing",
            "Completed",
            "Cancelled"
        ];

        statuses.forEach(status => {
            const option = document.createElement("option");

            option.value = status;
            option.textContent = status;

            if ((order.status || "Pending") === status) {
                option.selected = true;
            }

            statusSelect.appendChild(option);
        });

        statusSelect.style.cssText = `
            padding: 7px;
            border: 1px solid #DCE3EE;
            border-radius: 6px;
            cursor: pointer;
            max-width: 125px;
        `;

        statusSelect.addEventListener("change", function() {
            updateOrderStatus(order.orderId, this.value);
        });

        statusCell.appendChild(statusSelect);
        row.appendChild(statusCell);

        // DATE CELL
        const dateCell = document.createElement("td");
        dateCell.textContent = order.orderDate || "-";
        row.appendChild(dateCell);

        // ACTION BUTTONS
        const actionCell = document.createElement("td");

        // VIEW BUTTON
        const viewButton = document.createElement("button");

        viewButton.textContent = "View";

        viewButton.style.cssText = `
            background: #1746A2;
            color: white;
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 6px;
        `;

        viewButton.addEventListener("click", function() {
            viewOrder(order.orderId);
        });

        actionCell.appendChild(viewButton);

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
            deleteOrder(order.orderId);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        orderTableBody.appendChild(row);
    });
}

// 5. UPDATE ORDER STATUS
function updateOrderStatus(orderId, newStatus) {
    const orders = getOrders();

    const orderIndex = orders.findIndex(
        order => order.orderId === orderId
    );

    if (orderIndex === -1) {
        alert("Order not found!");
        return;
    }

    orders[orderIndex].status = newStatus;

    localStorage.setItem(
        "senXinOrders",
        JSON.stringify(orders)
    );

    displayStatistics(orders);
    searchOrders();

    console.log("Order Status Updated:", orderId, newStatus);
}

// 6. SEARCH AND FILTER ORDERS
function searchOrders() {
    const keyword = searchOrderInput.value.trim().toLowerCase();
    const selectedStatus = filterOrderStatus.value;
    const startDate = filterStartDate.value;
    const endDate = filterEndDate.value;

    // CHECK DATE RANGE
    if (startDate && endDate && startDate > endDate) {
        orderTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    From date cannot be later than To date.
                </td>
            </tr>
        `;
        return;
    }

    const orders = getOrders();

    const filteredOrders = orders.filter(order => {

        // SEARCH FILTER
        const matchesSearch =
            String(order.orderId || "").toLowerCase().includes(keyword) ||
            String(order.customerName || "").toLowerCase().includes(keyword) ||
            String(order.customerPhone || "").toLowerCase().includes(keyword);

        // STATUS FILTER
        const matchesStatus =
            selectedStatus === "all" ||
            (order.status || "Pending") === selectedStatus;

        // DATE FILTER
        let matchesDate = true;

        if (startDate || endDate) {
            const orderDate = getLocalOrderDate(order.orderDate);

            if (!orderDate) {
                matchesDate = false;
            } else {
                if (startDate && orderDate < startDate) {
                    matchesDate = false;
                }

                if (endDate && orderDate > endDate) {
                    matchesDate = false;
                }
            }
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    displayOrders(filteredOrders);
}

// SEARCH AND FILTER EVENTS
searchOrderInput.addEventListener("input", searchOrders);
filterOrderStatus.addEventListener("change", searchOrders);
filterStartDate.addEventListener("change", searchOrders);
filterEndDate.addEventListener("change", searchOrders);

// RESET ALL FILTERS
resetOrderFiltersButton.addEventListener("click", function() {

    searchOrderInput.value = "";
    filterOrderStatus.value = "all";
    filterStartDate.value = "";
    filterEndDate.value = "";

    searchOrders();

    console.log("Order Filters Reset Successfully!");
});

// 7. INITIALIZE DASHBOARD
function initializeDashboard() {
    const orders = getOrders();

    displayStatistics(orders);
    displayOrders(orders);

    console.log("SEN XIN Admin Loaded!");
    console.log("Total Orders:", orders.length);
}

// START ADMIN DASHBOARD
initializeDashboard();
// ======================================
// VIEW ORDER DETAILS
// ======================================

const orderModal = document.getElementById("orderModal");
const closeOrderModal = document.getElementById("closeOrderModal");
const orderDetailsContent = document.getElementById("orderDetailsContent");

// ESCAPE HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function(char) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}

// VIEW ORDER
function viewOrder(orderId) {
    const orders = getOrders();
    const order = orders.find(item => item.orderId === orderId);

    if (!order) {
        alert("Order not found!");
        return;
    }

    const productRows = (Array.isArray(order.products) ? order.products : [])
        .map(product => `
            <tr>
                <td>${escapeHTML(product.name || "-")}</td>
                <td>${Number(product.quantity) || 0}</td>
                <td>$${(Number(product.price) || 0).toFixed(2)}</td>
                <td>$${(
                    (Number(product.price) || 0) *
                    (Number(product.quantity) || 0)
                ).toFixed(2)}</td>
            </tr>
        `).join("");

    orderDetailsContent.innerHTML = `
        <div class="detail-group">
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> ${escapeHTML(order.orderId)}</p>
            <p><strong>Date:</strong> ${escapeHTML(order.orderDate)}</p>
            <p><strong>Status:</strong> ${escapeHTML(order.status || "Pending")}</p>
        </div>

        <div class="detail-group">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${escapeHTML(order.customerName)}</p>
            <p><strong>Phone:</strong> ${escapeHTML(order.customerPhone)}</p>
            <p><strong>Address:</strong> ${escapeHTML(order.customerAddress)}</p>
        </div>

        <div class="detail-group">
            <h3>Payment Information</h3>
            <p><strong>Payment Method:</strong> ${escapeHTML(order.paymentMethod)}</p>
            <p><strong>Order Notes:</strong> ${escapeHTML(order.orderNotes || "No notes")}</p>
        </div>

        <div class="detail-group">
            <h3>Products Ordered</h3>

            <div class="table-wrapper">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${productRows}
                    </tbody>
                </table>
            </div>

            <div class="detail-total">
                <p>Total Items: ${Number(order.totalItems) || 0}</p>
                <p>Total Price: $${(Number(order.totalPrice) || 0).toFixed(2)}</p>
            </div>
        </div>
    `;

    orderModal.classList.add("show");
}

// CLOSE ORDER MODAL
closeOrderModal.addEventListener("click", function() {
    orderModal.classList.remove("show");
});

orderModal.addEventListener("click", function(event) {
    if (event.target === orderModal) {
        orderModal.classList.remove("show");
    }
});

// ======================================
// DELETE ORDER
// ======================================

function deleteOrder(orderId) {
    const orders = getOrders();
    const order = orders.find(item => item.orderId === orderId);

    if (!order) {
        alert("Order not found!");
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete Order " + orderId + "?"
    );

    if (!confirmDelete) return;

    const updatedOrders = orders.filter(
        item => item.orderId !== orderId
    );

    localStorage.setItem(
        "senXinOrders",
        JSON.stringify(updatedOrders)
    );

    displayStatistics(updatedOrders);
    searchOrders();
    displayCustomers(getCustomers());

    console.log("Order Deleted:", orderId);
    alert("Order deleted successfully!");
}

// ======================================
// CUSTOMER MANAGEMENT
// ======================================

const searchCustomerInput = document.getElementById("searchCustomer");
const customerTableBody = document.getElementById("customerTableBody");

// GET CUSTOMERS
function getCustomers() {
    const orders = getOrders();
    const customerMap = new Map();

    orders.forEach(order => {
        const phone = String(order.customerPhone || "").trim();
        const name = String(order.customerName || "").trim();
        const customerKey = phone || name.toLowerCase();

        if (!customerKey) return;

        if (!customerMap.has(customerKey)) {
            customerMap.set(customerKey, {
                name: name || "-",
                phone: phone || "-",
                address: order.customerAddress || "-",
                totalOrders: 1
            });
        } else {
            const customer = customerMap.get(customerKey);

            customer.totalOrders++;

            if (order.customerAddress) {
                customer.address = order.customerAddress;
            }

            if (!customer.name || customer.name === "-") {
                customer.name = name || "-";
            }
        }
    });

    return Array.from(customerMap.values());
}

// DISPLAY CUSTOMERS
function displayCustomers(customers) {
    customerTableBody.innerHTML = "";

    if (customers.length === 0) {
        customerTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No customers found.
                </td>
            </tr>
        `;
        return;
    }

    customers.forEach((customer, index) => {
        const row = document.createElement("tr");

        const values = [
            index + 1,
            customer.name,
            customer.phone,
            customer.address,
            customer.totalOrders
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const viewButton = document.createElement("button");

        viewButton.textContent = "View";

        viewButton.style.cssText = `
            background: #1746A2;
            color: white;
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
        `;

        viewButton.addEventListener("click", function() {
            viewCustomer(customer.phone);
        });

        actionCell.appendChild(viewButton);
        row.appendChild(actionCell);
        customerTableBody.appendChild(row);
    });
}

// SEARCH CUSTOMERS
function searchCustomers() {
    const keyword = searchCustomerInput.value.trim().toLowerCase();
    const customers = getCustomers();

    const filteredCustomers = customers.filter(customer => {
        return customer.name.toLowerCase().includes(keyword) ||
               customer.phone.toLowerCase().includes(keyword);
    });

    displayCustomers(filteredCustomers);
}

searchCustomerInput.addEventListener("input", searchCustomers);

displayCustomers(getCustomers());
// ======================================
// CUSTOMER DETAILS + ORDER HISTORY
// ======================================

function viewCustomer(customerPhone) {
    const orders = getOrders();

    const customerOrders = orders.filter(order =>
        String(order.customerPhone || "").trim() ===
        String(customerPhone || "").trim()
    );

    if (customerOrders.length === 0) {
        alert("No order history found!");
        return;
    }

    const latestOrder = customerOrders[customerOrders.length - 1];
    const customerName = latestOrder.customerName || "-";
    const customerAddress = latestOrder.customerAddress || "-";

    const modal = document.getElementById("customerModal");
    const content = document.getElementById("customerDetailsContent");

    const totalSpent = customerOrders
        .filter(order => order.status !== "Cancelled")
        .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

    let orderRows = "";

    customerOrders.forEach(order => {
        orderRows += `
            <tr>
                <td>${escapeHTML(order.orderId)}</td>
                <td>$${Number(order.totalPrice || 0).toFixed(2)}</td>
                <td>${escapeHTML(order.status || "Pending")}</td>
                <td>${escapeHTML(order.orderDate || "-")}</td>
            </tr>
        `;
    });

    content.innerHTML = `
        <div class="detail-group">
            <h3>${escapeHTML(customerName)}</h3>
            <p><strong>Phone:</strong> ${escapeHTML(customerPhone)}</p>
            <p><strong>Address:</strong> ${escapeHTML(customerAddress)}</p>
            <p><strong>Total Orders:</strong> ${customerOrders.length}</p>
            <p><strong>Total Spent:</strong> $${totalSpent.toFixed(2)}</p>
        </div>

        <h3>Order History</h3>

        <div class="table-wrapper">
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    ${orderRows}
                </tbody>
            </table>
        </div>
    `;

    modal.classList.add("show");
}

// CLOSE CUSTOMER MODAL
document.getElementById("closeCustomerModal")
    .addEventListener("click", function() {
        document.getElementById("customerModal").classList.remove("show");
    });

document.getElementById("customerModal")
    .addEventListener("click", function(event) {
        if (event.target === this) {
            this.classList.remove("show");
        }
    });

// ======================================
// EXPORT ORDERS AND CUSTOMERS TO CSV
// ======================================

// ESCAPE CSV VALUES
function escapeCSV(value) {
    let text = String(value ?? "");

    // Prevent spreadsheet formula execution
    if (/^[\s]*[=+\-@]/.test(text)) {
        text = "'" + text;
    }

    return '"' + text.replace(/"/g, '""') + '"';
}

// DOWNLOAD CSV FILE
function downloadCSV(filename, headers, rows) {
    const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\r\n");

    const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// EXPORT ORDERS
function exportOrdersToCSV() {
    const orders = getOrders();

    if (orders.length === 0) {
        alert("No orders available to export!");
        return;
    }

    const headers = [
        "Order ID",
        "Customer Name",
        "Phone",
        "Address",
        "Products",
        "Total Items",
        "Total Price",
        "Payment Method",
        "Order Notes",
        "Status",
        "Order Date"
    ];

    const rows = orders.map(order => {
        const products = (Array.isArray(order.products) ? order.products : [])
            .map(product =>
                `${product.name || ""} x ${product.quantity || 0}`
            )
            .join("; ");

        return [
            order.orderId,
            order.customerName,
            order.customerPhone,
            order.customerAddress,
            products,
            order.totalItems,
            order.totalPrice,
            order.paymentMethod,
            order.orderNotes,
            order.status || "Pending",
            order.orderDate
        ];
    });

    downloadCSV("SEN_XIN_Orders.csv", headers, rows);

    alert("Orders exported successfully!");
}

document.getElementById("exportOrdersBtn")
    .addEventListener("click", exportOrdersToCSV);

// EXPORT CUSTOMERS
function exportCustomersToCSV() {
    const customers = getCustomers();

    if (customers.length === 0) {
        alert("No customers available to export!");
        return;
    }

    const headers = [
        "Customer Name",
        "Phone",
        "Address",
        "Total Orders"
    ];

    const rows = customers.map(customer => [
        customer.name,
        customer.phone,
        customer.address,
        customer.totalOrders
    ]);

    downloadCSV("SEN_XIN_Customers.csv", headers, rows);

    alert("Customers exported successfully!");
}

document.getElementById("exportCustomersBtn")
    .addEventListener("click", exportCustomersToCSV);
    // ======================================
// ADMIN LOGOUT
// ======================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {

        // Remove login session
        sessionStorage.removeItem("senXinAdminLoggedIn");

        // Redirect to Login Page
        window.location.href = "login.html";

    });
}