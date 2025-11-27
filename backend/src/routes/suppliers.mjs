import express from "express";
import { validateNumber, validateString, validateSupplier } from "../utilities/validation.mjs";
import { parseSupplier } from "../utilities/parsing.mjs";
import { 
    createSupplier, 
    getAllSuppliers, 
    getSupplierById, 
    getSupplierByName, 
    updateSupplier, 
    deleteSupplier, 
    getProductsBySupplierId 
} from "../repositories/suppliers.mjs"

const router = express.Router();

// POST /api/suppliers - creates a new supplier
router.post("/suppliers", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: "No JSON body is included." });
        return;
    }

    const parsedSupplier = parseSupplier(req.body);
    const validation = validateSupplier(parsedSupplier);

    if (!validation.isValid) {
        res.status(400).json({ errors: validation.errors });
        return;
    }

    try {
        const createdSupplier = await createSupplier(parsedSupplier);
        res.status(201).json(createdSupplier);
    }
    catch (error) {
        // If the user tries to create a supplier with a name/email/phone number that already exists in the database, 
        // postgres returns error code "23505" (unique violation), since these columns all have UNIQUE constraints.
        if (error.code === "23505") {
            // The error-object's "constraint" property also contains information on which value triggered the unique
            // violation error, which is used here to respond with a descriptive error. The main drawback of using
            // this method rather than doing pre-checks before trying to insert is that only one error message can
            // be returned, but it's more performant since it only needs one database query rather than four.
            switch (error.constraint) {
                case "suppliers_name_key":
                    res.status(409).json({ error: `A supplier with the name '${parsedSupplier.name}' already exists.` });
                    break;

                case "suppliers_email_key":
                    res.status(409).json({ error: `A supplier with the email '${parsedSupplier.email}' already exists.` });
                    break;

                case "suppliers_phone_key":
                    res.status(409).json({ error: `A supplier with the phone number '${parsedSupplier.phone}' already exists.` });
                    break;

                default:
                    res.status(409).json({ error: `Tried to insert a value that already exists.` });
                    break;
            }
        }
        else {
            console.log(error);
            res.status(500).json({ error: "Unexpected server error" });
        }
    }
});

// GET /api/suppliers - gets all suppliers from the database
router.get("/suppliers", async (req, res) => {
    const suppliers = await getAllSuppliers();
    res.json(suppliers);
});

// GET /api/suppliers/search?name=query - searches for a supplier by name
router.get("/suppliers/search", async (req, res) => {
    const searchQuery = req.query.name;

    if (!validateString(searchQuery)) {
        res.status(400).json({ error: "Search query must be a string" });
        return;
    }

    const supplier = await getSupplierByName(searchQuery);
    res.json(supplier);
});

// GET /api/suppliers/:id - gets a single supplier by ID
router.get("/suppliers/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (!validateNumber(id)) {
        res.status(400).json({ error: "ID parameter must be a positive integer" });
        return;
    }

    const supplier = await getSupplierById(id);

    if (!supplier) {
        res.status(404).json({ error: `Could not find supplier with ID: ${id}.` });
        return;
    }

    res.json(supplier);
});

// PUT /api/suppliers/:id - updates an existing supplier
router.put("/suppliers/:id", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: "No JSON body is included." });
        return;
    }

    const parsedSupplier = parseSupplier(req.body);
    parsedSupplier.id = Number.parseInt(req.params.id);
    
    const validation = await validateSupplier(parsedSupplier);
    
    if (!validation.isValid) {
        res.status(400).json({ errors: validation.errors });
        return;
    }

    try {
        const updatedSupplier = await updateSupplier(parsedSupplier);
        if (!updatedSupplier) {
            res.status(404).json({ error: `Could not find supplier with ID: ${parsedSupplier.id}.` });
            return;
        }
        res.status(204).send();
    }
    catch (error) {
        // If the user tries to update a supplier with a name/email/phone number that already exists in the database, 
        // postgres returns error code "23505" (unique violation), since these columns all have UNIQUE constraints.
        if (error.code === "23505") {
            // The error-object's "constraint" property also contains information on which value triggered the unique
            // violation error, which is used here to respond with a descriptive error. The main drawback of using
            // this method rather than doing pre-checks before trying to insert is that only one error message can
            // be returned, but it's more performant since it only needs one database query rather than four.
            switch (error.constraint) {
                case "suppliers_name_key":
                    res.status(409).json({ error: `A supplier with the name '${parsedSupplier.name}' already exists.` });
                    break;

                case "suppliers_email_key":
                    res.status(409).json({ error: `A supplier with the email '${parsedSupplier.email}' already exists.` });
                    break;

                case "suppliers_phone_key":
                    res.status(409).json({ error: `A supplier with the phone number '${parsedSupplier.phone}' already exists.` });
                    break;

                default:
                    res.status(409).json({ error: `Tried to insert a value that already exists.` });
                    break;
            }
        }
        else {
            console.log(error);
            res.status(500).json({ error: "Unexpected server error" });
        }
    }
});

// DELETE /api/suppliers/:id - deletes a supplier
router.delete("/suppliers/:id", async (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (!validateNumber(id)) {
        res.status(400).json({ error: "ID parameter must be a positive integer" });
        return;
    }

    const deletedSupplier = await deleteSupplier(id);
    if (!deletedSupplier) {
        res.status(404).json({ error: `Could not find supplier with ID: ${id}.` });
        return;
    }

    res.status(204).send();
});

// GET /api/suppliers/:id/products - gets all products of a supplier by ID
router.get("/suppliers/:id/products", async (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (!validateNumber(id)) {
        res.status(400).json({ error: "ID parameter must be a positive integer" });
        return;
    }

    const products = await getProductsBySupplierId(id);

    res.json(products);
});

export default router;