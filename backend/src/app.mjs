import "./config/variables.mjs";
import express from "express";
import { setupDatabase, generateTestData } from "./config/db.mjs";
import productRoutes from "./routes/products.mjs";
import categoryRoutes from "./routes/categories.mjs";
import supplierRoutes from "./routes/suppliers.mjs";

// Creates tables if they do not already exist
setupDatabase();

// Generates test data
// generateTestData();

const appPort = Number.parseInt(process.env.APP_PORT);

const app = express();

app.use(express.json());

app.use("/api", productRoutes, categoryRoutes, supplierRoutes);

app.listen(appPort, () => {
    console.log(`Server is running on port ${appPort}.`);
});