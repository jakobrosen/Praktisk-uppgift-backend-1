import express from "express";
import { validateNumber, validateString, validateCategory } from "../utilities/validation.mjs";
import { parseCategory } from "../utilities/parsing.mjs";
import { 
    createCategory, 
    getAllCategories, 
    getCategoryById, 
    getCategoryByName, 
    updateCategory, 
    deleteCategory, 
    getProductsByCategoryId 
} from "../repositories/categories.mjs"

const router = express.Router();

// POST /api/categories - creates a new category
router.post("/categories", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: "No JSON body is included." });
        return;
    }

    const parsedCategory = parseCategory(req.body);
    const validation = await validateCategory(parsedCategory);

    if (!validation.isValid) {
        res.status(400).json({ errors: validation.errors });
        return;
    }

    try {
        const createdCategory = await createCategory(parsedCategory);
        res.status(201).json(createdCategory);
    }
    catch (error) {
        // If the user tries to insert a category with a name that already exists in the database, postgres returns 
        // error code "23505" (unique violation), since the table's "name" column has a UNIQUE constraint.
        if (error.code === "23505") {
            res.status(409).json({ error: `A category with the name '${parsedCategory.name}' already exists.` });
        }
        else {
            console.log(error);
            res.status(500).json({ error: "Unexpected server error" });
        }
    }
});

// GET /api/categories - gets all categories from the database
router.get("/categories", async (req, res) => {
    const categories = await getAllCategories();
    res.json(categories);
});

// GET /api/categories/search?name=query - searches for a category by name
router.get("/categories/search", async (req, res) => {
    const searchQuery = req.query.name;

    if (!validateString(searchQuery)) {
        res.status(400).json({ error: "Search query must be a string" });
        return;
    }

    const category = await getCategoryByName(searchQuery);
    res.json(category);
});

// GET /api/categories/:id - gets a single category by ID
router.get("/categories/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (!validateNumber(id)) {
        res.status(400).json({ error: "ID parameter must be a positive integer" });
        return;
    }

    const category = await getCategoryById(id);

    if (!category) {
        res.status(404).json({ error: `Could not find category with ID: ${id}.` });
        return;
    }

    res.json(category);
});

// PUT /api/categories/:id - updates an existing category
router.put("/categories/:id", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: "No JSON body is included." });
        return;
    }

    const parsedCategory = parseCategory(req.body);
    parsedCategory.id = Number.parseInt(req.params.id);
    
    const validation = await validateCategory(parsedCategory);
    
    if (!validation.isValid) {
        res.status(400).json({ errors: validation.errors });
        return;
    }

    try {
        const updatedCategory = await updateCategory(parsedCategory);
        if (!updatedCategory) {
            res.status(404).json({ error: `Could not find category with ID: ${parsedCategory.id}.` });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        if (error.code === "23505") {
            res.status(409).json({ error: `A category with the name '${parsedCategory.name}' already exists.` });
        }
        else {
            console.log(error);
            res.status(500).json({ error: "Unexpected server error" });
        }
    }
});

// DELETE /api/categories/:id - deletes a category
router.delete("/categories/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (!validateNumber(id)) {
        res.status(400).json({ error: "ID parameter must be a positive integer" });
        return;
    }

    const deletedCategory = await deleteCategory(id);
    if (!deletedCategory) {
        res.status(404).json({ error: `Could not find category with ID: ${id}.` });
        return;
    }

    res.status(204).send();
});

// GET /api/categories/:id/products - gets all products from a category by ID
router.get("/categories/:id/products", async (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (!validateNumber(id)) {
        res.status(400).json({ error: "ID parameter must be a positive integer" });
        return;
    }

    const products = await getProductsByCategoryId(id);

    res.json(products);
});

export default router;
