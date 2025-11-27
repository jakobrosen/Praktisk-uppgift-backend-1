// Using CommonJS due to Electron's limited support for ESM
const { ipcRenderer } = require("electron");

loadHTMLFromFile("main-content", "./content/products.html");
setActiveNavBtn(nav.products);

// Window controls
windowControls.minimize.addEventListener("click", () => {
    ipcRenderer.send("minimize");
});

windowControls.maximize.addEventListener("click", () => {
    ipcRenderer.send("maximize");
});

windowControls.close.addEventListener("click", () => {
    ipcRenderer.send("close");
});

// Navigation
nav.dashboard.addEventListener("click", async () => {
    await loadHTMLFromFile("main-content", "./content/dashboard.html");
    setActiveNavBtn(nav.dashboard);
});

nav.products.addEventListener("click", async () => {
    await loadHTMLFromFile("main-content", "./content/products.html");
    setActiveNavBtn(nav.products);

    const table = document.getElementById("products-table");

    getData("products").then(products => {
        products.forEach(product => {
            if (product.category_name === null) {
                product.category_name = "No category";
            }
            if (product.supplier_name === null) {
                product.supplier_name = "No supplier";
            }

            const tr = document.createElement("tr");
            tr.innerHTML = `
            <tr>
            <td><input type="checkbox"></td>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td class="table-link" data-category-id="${product.category_id}">
                ${product.category_name}
            </td>
            <td class="table-link" data-supplier-id="${product.supplier_id}">
                ${product.supplier_name}
            </td>
            <td>${product.amount}</td>
            <td>${product.weight}</td>
            <td>${product.price}</td>
            <td>
                <img class="edit-icon" src="../icons/edit.svg" data-product-id="${product.id}">
                <img class="delete-icon" src="../icons/delete.svg" data-product-id="${product.id}">
            </td>
            </tr>
            `;
            table.appendChild(tr);
        });
    });
});

nav.categories.addEventListener("click", async () => {
    await loadHTMLFromFile("main-content", "./content/categories.html");
    setActiveNavBtn(nav.categories);

    const table = document.getElementById("categories-table");

    getData("categories").then(categories => {
        categories.forEach(category => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <tr>
            <td><input type="checkbox"></td>
            <td>${category.id}</td>
            <td class="table-link" data-category-id="${category.id}">
                ${category.name}
            </td>
            <td>${category.product_count}</td>
            <td>
                <img class="edit-icon" src="../icons/edit.svg" data-category-id="${category.id}">
                <img class="delete-icon" src="../icons/delete.svg" data-category-id="${category.id}">
            </td>
            </tr>
            `;
            table.appendChild(tr);
        });
    });
});

nav.suppliers.addEventListener("click", async () => {
    await loadHTMLFromFile("main-content", "./content/suppliers.html");
    setActiveNavBtn(nav.suppliers);

    const table = document.getElementById("suppliers-table");

    getData("suppliers").then(suppliers => {
        suppliers.forEach(supplier => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
            <tr>
            <td><input type="checkbox"></td>
            <td>${supplier.id}</td>
            <td class="table-link" data-supplier-id="${supplier.id}>
                ${supplier.name}
            </td>
            <td>${supplier.contact}</td>
            <td>${supplier.email}</td>
            <td>${supplier.country}</td>
            <td>${supplier.phone}</td>
            <td>${supplier.product_count}</td>
            <td>
                <img class="edit-icon" src="../icons/edit.svg" data-supplier-id="${supplier.id}">
                <img class="delete-icon" src="../icons/delete.svg" data-supplier-id="${supplier.id}">
            </td>
            </tr>
            `;
            table.appendChild(tr);
        });
    });
});

nav.reports.addEventListener("click", async () => {
    await loadHTMLFromFile("main-content", "./content/reports.html");
    setActiveNavBtn(nav.reports);
});

nav.settings.addEventListener("click", async () => {
    await loadHTMLFromFile("main-content", "./content/settings.html");
    setActiveNavBtn(nav.settings);
});

// Show/hide add dropdown menu
let addDropdownActive = false;
nav.add.addEventListener("click", () => {
    if (!addDropdownActive) {
        nav.addDropdown.style.display = "block";
        nav.addDownarrow.style.display = "none";
        nav.addUparrow.style.display = "block";
        addDropdownActive = true;
    }
    else {
        nav.addDropdown.style.display = "none";
        nav.addDownarrow.style.display = "block";
        nav.addUparrow.style.display = "none";
        addDropdownActive = false;
    }
});

// Edit a database entry
const editBtn = document.querySelector("edit-icon");
editBtn.addEventListener("click", (e))
