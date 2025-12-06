import { pool } from "../config/db.mjs";

// Creates a new product
export async function createProduct(product) {
    const result = await pool.query(
        `INSERT INTO products (name, price, weight, amount, category_id, supplier_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, 
        [product.name, product.price, product.weight, product.amount, product.category_id, product.supplier_id]);

    if (result.rowCount !== 1) {
        throw new Error("Failed to insert product into database");
    }

    return result.rows[0];
}

// Gets all products
export async function getAllProducts() {
    const result = await pool.query(`
        SELECT 
            products.*,
            categories.name AS category_name,
            suppliers.name AS supplier_name
        FROM products 
        LEFT JOIN categories ON products.category_id = categories.id
        LEFT JOIN suppliers ON products.supplier_id = suppliers.id
        ORDER BY products.id
        `);

    if (!result.rowCount) {
        return [];
    }

    return result.rows;
}

// Searches for product by ID
export async function getProductById(id) {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

    if (!result.rows || result.rowCount !== 1) {
        return null;
    }

    return result.rows[0];
}

// Searches for products by name
export async function getProductByName(name) {
    const result = await pool.query("SELECT * FROM products WHERE LOWER(name) LIKE $1", ["%" + name.toLowerCase() + "%"]);

    if (!result.rows) {
        return [];
    }

    return result.rows;
}

// Updates an existing product
export async function updateProduct(product) {
    const result = await pool.query(
    `UPDATE products SET
        name = $1,
        price = $2,
        weight = $3,
        amount = $4,
        category_id = $5,
        supplier_id = $6 
        WHERE id = $7`,
    [
        product.name,
        product.price,
        product.weight,
        product.amount,
        product.category_id,
        product.supplier_id,
        product.id,
    ]);

    return result.rowCount > 0;
}

// Deletes a product from the database
export async function deleteProduct(id) {
    const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);

    return result.rowCount > 0;
}