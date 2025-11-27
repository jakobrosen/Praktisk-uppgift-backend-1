import { pool } from "../config/db.mjs";

// Checks if the specified supplier exists in the databse
export async function supplierExistsById(id) {
    const result = await pool.query("SELECT EXISTS(SELECT * FROM suppliers WHERE id = $1)", [id]);
    return result.rows[0].exists;
}

// Creates a new supplier
export async function createSupplier(supplier) {
    const result = await pool.query(
        `INSERT INTO suppliers (name, contact, email, country, phone)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
        [supplier.name, supplier.contact, supplier.email, supplier.country, supplier.phone]);

    if (result.rowCount !== 1) {
        throw new Error("Failed to insert supplier");
    }

    return result.rows[0];
}

// Gets all suppliers, also returns the amount of
// products related to each supplier
export async function getAllSuppliers() {
    const result = await pool.query(`
        SELECT 
            suppliers.*, 
            COUNT(products.id) AS product_count
        FROM suppliers
        LEFT JOIN products ON products.supplier_id = suppliers.id
        GROUP BY suppliers.id
        ORDER BY suppliers.id
        `);

    if (!result.rowCount) {
        throw new Error("Failed to retrieve suppliers");
    }

    return result.rows;
}

// Searches for suppliers by ID, also returns the amount of
// products related to the supplier
export async function getSupplierById(id) {
    const result = await pool.query(`
        SELECT 
            suppliers.*, 
            COUNT(products.id) AS product_count 
        FROM suppliers
        LEFT JOIN products ON products.supplier_id = suppliers.id 
        WHERE suppliers.id = $1
        GROUP BY suppliers.id
        ORDER BY suppliers.id`,
        [id]);

    if (!result.rows || result.rowCount !== 1) {
        return null;
    }

    return result.rows[0];
}

// Searches for suppliers by name, also returns the amount of
// products related to each supplier
export async function getSupplierByName(name) {
    const result = await pool.query(`
        SELECT 
            suppliers.*, 
            COUNT(products.id) AS product_count 
        FROM suppliers
        LEFT JOIN products ON products.supplier_id = suppliers.id 
        WHERE LOWER(suppliers.name) LIKE $1
        GROUP BY suppliers.id
        ORDER BY suppliers.id`,
        ["%" + name.toLowerCase() + "%"]);

    if (!result.rows) {
        return [];
    }

    return result.rows;
}

// Updates an existing supplier
export async function updateSupplier(supplier) {
    const result = await pool.query(
    `UPDATE suppliers SET
        name = $1,
        contact = $2,
        email = $3,
        country = $4,
        phone = $5
        WHERE id = $6`,
    [
        supplier.name,
        supplier.contact,
        supplier.email,
        supplier.country,
        supplier.phone,
        supplier.id
    ]);

    return result.rowCount > 0;
}

// Deletes a supplier from the database
export async function deleteSupplier(id) {
    const result = await pool.query("DELETE FROM suppliers WHERE id = $1", [id]);

    return result.rowCount > 0;
}

// Gets all products related to a supplier by ID
export async function getProductsBySupplierId(id) {
    const result = await pool.query("SELECT * FROM products WHERE supplier_id = $1", [id]);

    return result.rows;
}
