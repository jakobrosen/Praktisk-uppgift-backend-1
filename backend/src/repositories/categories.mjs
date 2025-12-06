import { pool } from "../config/db.mjs";

// Checks if the specified category ID exists in the databse
export async function categoryExistsById(id) {
    const result = await pool.query("SELECT EXISTS(SELECT * FROM categories WHERE id = $1)", [id]);
    return result.rows[0].exists;
}

// Creates a new category
export async function createCategory(category) {
    const result = await pool.query("INSERT INTO categories (name) VALUES ($1) RETURNING *", [category.name]);

    if (result.rowCount !== 1) {
        throw new Error("Failed to insert category into database");
    }

    return result.rows[0];
}

// Gets all categories, also returns the amount of
// products related to each category
export async function getAllCategories() {
    const result = await pool.query(`
        SELECT 
            categories.*, 
            COUNT(products.id) AS product_count
        FROM categories
        LEFT JOIN products ON products.category_id = categories.id
        GROUP BY categories.id
        ORDER BY categories.id
        `);

    if (!result.rowCount) {
        return [];
    }

    return result.rows;
}

// Searches for category by ID, also returns the amount of
// products related to the category
export async function getCategoryById(id) {
    const result = await pool.query(`
        SELECT 
            categories.*, 
            COUNT(products.id) AS product_count 
        FROM categories
        LEFT JOIN products ON products.category_id = categories.id 
        WHERE categories.id = $1
        GROUP BY categories.id
        ORDER BY categories.id`,
        [id]);

    if (!result.rows || result.rowCount !== 1) {
        return null;
    }

    return result.rows[0];
}

// Searches for categories by name, also returns the amount of
// products related to each category
export async function getCategoryByName(name) {
    const result = await pool.query(`
        SELECT 
            categories.*, 
            COUNT(products.id) AS product_count 
        FROM categories
        LEFT JOIN products ON products.category_id = categories.id 
        WHERE LOWER(categories.name) LIKE $1
        GROUP BY categories.id
        ORDER BY categories.id`,
        ["%" + name.toLowerCase() + "%"]);

    if (!result.rows) {
        return [];
    }

    return result.rows;
}

// Updates an existing category
export async function updateCategory(category) {
    const result = await pool.query("UPDATE categories SET name = $1 WHERE id = $2", [category.name, category.id]);

    return result.rowCount > 0;
}

// Deletes a category from the database
export async function deleteCategory(id) {
    const result = await pool.query("DELETE FROM categories WHERE id = $1", [id]);

    return result.rowCount > 0;
}

// Gets all products related to a category by ID
export async function getProductsByCategoryId(id) {
    const result = await pool.query("SELECT * FROM products WHERE category_id = $1", [id]);

    return result.rows;
}