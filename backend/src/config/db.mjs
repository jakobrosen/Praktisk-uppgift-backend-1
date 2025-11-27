import { Pool } from "pg";

export const pool = new Pool({
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: Number.parseInt(process.env.DATABASE_PORT),
});

// Creates database tables if they don't exist
export async function setupDatabase() {
    await pool.connect();

    await pool.query(`CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        
        CREATE TABLE IF NOT EXISTS suppliers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        contact VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        country VARCHAR(100) NOT NULL,
        phone VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        
        CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
        weight DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (weight >= 0),
        amount INT NOT NULL DEFAULT 0 CHECK (amount >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        category_id INT, FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
        supplier_id INT, FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL);`);
};

// Generates test data for the database
export async function generateTestData() {
    await pool.connect();

    await pool.query(`INSERT INTO categories (name) VALUES
            ('Electronics'),
            ('Clothing'),
            ('Food & Beverages'),
            ('Books'),
            ('Sports Equipment'),
            ('Home & Garden'),
            ('Toys'),
            ('Beauty & Health'),
            ('Miscellaneous')
            ON CONFLICT (name) DO NOTHING;`);

    await pool.query(`INSERT INTO suppliers (name, contact, email, country, phone) VALUES
            ('TechWorld Inc', 'John Smith', 'john@techworld.com', 'United States', '+1-555-0101'),
            ('Fashion Direct Ltd', 'Maria Garcia', 'maria@fashiondirect.com', 'Spain', '+34-555-0102'),
            ('Global Foods Co', 'Zhang Wei', 'zhang@globalfoods.com', 'China', '+86-555-0103'),
            ('Book Distributors LLC', 'Sarah Johnson', 'sarah@bookdist.com', 'United Kingdom', '+44-555-0104'),
            ('Sports Gear Pro', 'Hans Mueller', 'hans@sportsgear.com', 'Germany', '+49-555-0105'),
            ('Garden Supplies International', 'Sophie Dubois', 'sophie@gardensupplies.com', 'France', '+33-555-0106'),
            ('Toy Factory Direct', 'Akira Tanaka', 'akira@toyfactory.com', 'Japan', '+81-555-0107'),
            ('Beauty World', 'Emma Wilson', 'emma@beautyworld.com', 'Canada', '+1-555-0108'),
            ('General Supplies Co', 'Lucas Silva', 'lucas@generalsupplies.com', 'Brazil', '+55-555-0109')
            ON CONFLICT (email) DO NOTHING;`);

    await pool.query(`INSERT INTO products (name, price, weight, amount, category_id, supplier_id) VALUES
            -- Electronics
            ('Wireless Mouse', 29.99, 0.15, 150, 1, 1),
            ('USB-C Cable 2m', 12.99, 0.05, 500, 1, 1),
            ('Bluetooth Headphones', 79.99, 0.25, 75, 1, 1),
            ('Laptop Stand', 45.50, 1.20, 100, 1, 1),
            
            -- Clothing
            ('Cotton T-Shirt', 19.99, 0.20, 200, 2, 2),
            ('Denim Jeans', 59.99, 0.65, 120, 2, 2),
            ('Winter Jacket', 129.99, 1.50, 50, 2, 2),
            ('Running Shoes', 89.99, 0.80, 80, 2, 2),
            
            -- Food & Beverages
            ('Organic Coffee Beans 1kg', 24.99, 1.00, 300, 3, 3),
            ('Green Tea Box', 15.99, 0.25, 250, 3, 3),
            ('Chocolate Bar', 3.99, 0.10, 1000, 3, 3),
            ('Pasta 500g', 2.99, 0.50, 800, 3, 3),
            
            -- Books
            ('Programming Guide', 49.99, 0.80, 60, 4, 4),
            ('Mystery Novel', 14.99, 0.40, 150, 4, 4),
            ('Cookbook', 32.99, 1.20, 90, 4, 4),
            ('Travel Guide', 21.99, 0.60, 70, 4, 4),
            
            -- Sports Equipment
            ('Yoga Mat', 35.99, 1.50, 100, 5, 5),
            ('Dumbbell Set 10kg', 89.99, 10.00, 40, 5, 5),
            ('Tennis Racket', 119.99, 0.35, 55, 5, 5),
            ('Water Bottle', 18.99, 0.20, 300, 5, 5),
            
            -- Home & Garden
            ('Plant Pot Large', 25.99, 2.50, 80, 6, 6),
            ('Garden Hose 20m', 42.99, 3.00, 60, 6, 6),
            ('LED Light Bulb Pack', 16.99, 0.30, 200, 6, 6),
            ('Decorative Cushion', 22.99, 0.50, 120, 6, 6),
            
            -- Toys
            ('Building Blocks Set', 39.99, 1.20, 150, 7, 7),
            ('Puzzle 1000 pieces', 24.99, 0.80, 100, 7, 7),
            ('Remote Control Car', 69.99, 1.50, 45, 7, 7),
            ('Plush Teddy Bear', 29.99, 0.40, 200, 7, 7),
            
            -- Beauty & Health
            ('Moisturizing Cream', 34.99, 0.25, 180, 8, 8),
            ('Shampoo 500ml', 12.99, 0.55, 250, 8, 8),
            ('Vitamin C Serum', 45.99, 0.15, 120, 8, 8),
            ('Face Mask Pack', 18.99, 0.20, 300, 8, 8),
            
            -- Miscellaneous
            ('Umbrella', 27.99, 0.45, 95, 9, 9),
            ('Keychain Set', 8.99, 0.05, 400, 9, 9),
            ('Wall Calendar 2025', 14.99, 0.30, 150, 9, 9),
            ('Reusable Shopping Bag', 6.99, 0.15, 500, 9, 9),
            ('Portable Phone Charger', 39.99, 0.25, 110, 9, 9),
            ('Notebook A5', 11.99, 0.35, 220, 9, 9);`);
}