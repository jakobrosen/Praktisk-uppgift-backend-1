import express from "express";
import { parseProduct } from "../utilities/parsing.mjs";
import { validateNumber, validateString, validateProduct } from "../utilities/validation.mjs";
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    getProductByName, 
    updateProduct, 
    deleteProduct 
} from "../repositories/products.mjs"

const router = express.Router();

// POST /api/products - creates a new product
router.post("/products", async (req, res) => {
    // Checks if the requests contains a body
    if (!req.body) {
        res.status(400).json({ error: "No JSON body is included." });
        return;
    }

    // Parses the body data into an object with the correct data-types
    const parsedProduct = parseProduct(req.body);

    // Validates the parsed object
    const validation = validateProduct(parsedProduct);

    // If validation failed, respond with the errors-array stored in the
    // validation-object
    if (!validation.isValid) {
        res.status(400).json({ errors: validation.errors });
        return;
    }

    // Tries to insert the product into the database
    try {
        const createdProduct = await createProduct(parsedProduct)
        res.status(201).json(createdProduct);
    }
    catch (error) {
        // If the user tries to insert a product with category_id or supplier_id that doesn't exist in the database, 
        // postgres returns error code "23503" (foreign key violation). 
        if (error.code === "23503") {
            // The error-object's "constraint" property also contains information on which value triggered the foreign
            // key violation error, which is used here to respond with a descriptive error. The main drawback of using
            // this method rather than doing pre-checks before trying to insert is that only one error message can
            // be returned, but it's more performant since it only needs one database query rather than three.
            switch (error.constraint) {
                case "products_category_id_fkey":
                    res.status(400).json({ error: `A category with the ID '${parsedProduct.category_id}' does not exist.` });
                    break;

                case "products_supplier_id_fkey":
                    res.status(400).json({ error: `A supplier with the ID '${parsedProduct.supplier_id}' does not exist.` });
                    break;

                default:
                    res.status(400).json({ error: `The category or supplier does not exist.` });
                    break;
            }
        }
        else if (error.message === "Failed to insert product into database") {
            res.status(500).json({ error: error.message })
        }
        else {
            console.log(error);
            res.status(500).json({ error: "Unexpected server error" });
        }
    }
});

// GET /api/products - gets all products from the database
router.get("/products", async (req, res) => {
    const products = await getAllProducts();
    res.json(products);
});

// GET /api/products/search?name=query - searches for a product by name
router.get("/products/search", async (req, res) => {
    const searchQuery = req.query.name;

    if (!validateString(searchQuery)) {
        res.status(400).json({ error: "Search query must be a string" });
        return;
    }

    const products = await getProductByName(searchQuery);
    res.json(products);
});

// GET /api/products/:id - gets a single product by ID
router.get("/products/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (!validateNumber(id)) {
        res.status(400).json({ error: "ID parameter must be a positive integer" });
        return;
    }

    const product = await getProductById(id);

    if (!product) {
        res.status(404).json({ error: `Could not find product with ID: ${id}.` });
        return;
    }

    res.json(product);
});

// PUT /api/products/:id - updates an existing product
router.put("/products/:id", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: "No JSON body is included." });
        return;
    }

    const parsedProduct = parseProduct(req.body);
    parsedProduct.id = Number.parseInt(req.params.id);

    const validation = validateProduct(parsedProduct);
    
    if (!validation.isValid) {
        res.status(400).json({ errors: validation.errors });
        return;
    }

    try {
        const updatedProduct = await updateProduct(parsedProduct);
        if (!updatedProduct) {
            res.status(404).json({ error: `Could not find product with ID: ${parsedProduct.id}.` });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        // If the user tries to update a product with category_id or supplier_id that doesn't exist in the database, 
        // postgres returns error code "23503" (foreign key violation). 
        if (error.code === "23503") {
            // The error-object's "constraint" property also contains information on which value triggered the foreign
            // key violation error, which is used here to respond with a descriptive error. The main drawback of using
            // this method rather than doing pre-checks before trying to insert is that only one error message can
            // be returned, but it's more performant since it only needs one database query rather than three.
            switch (error.constraint) {
                case "products_category_id_fkey":
                    res.status(400).json({ error: `A category with ID '${parsedProduct.category_id}' does not exist.` });
                    break;

                case "products_supplier_id_fkey":
                    res.status(400).json({ error: `A supplier with ID '${parsedProduct.supplier_id}' does not exist.` });
                    break;

                default:
                    res.status(400).json({ error: `The category or supplier does not exist.` });
                    break;
            }
        }
        else {
            console.log(error);
            res.status(500).json({ error: "Unexpected server error" });
        }
    }
});

// DELETE /api/products/:id - deletes a product
router.delete("/products/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (!validateNumber(id)) {
        res.status(400).json({ error: "ID parameter must be a positive integer" });
        return;
    }

    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
        res.status(404).json({ error: `Could not find product with ID: ${id}.` });
        return;
    }

    res.status(204).send();
});

export default router;