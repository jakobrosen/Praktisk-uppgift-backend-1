// Parses body-data into a product object with the correct data types
export function parseProduct(body) {
    const parsedProduct =  {
        name: body.name,
        price: Number.parseFloat(body.price),
        weight: Number.parseFloat(body.weight),
        amount: Number.parseInt(body.amount),
        category_id: Number.parseInt(body.category_id),
        supplier_id: Number.parseInt(body.supplier_id)
    }

    // Parses the products ID property only if it's included in 
    // the body (useful for the "PUT /api/products/:id" endpoint)
    if (body.id !== undefined) {
        parsedProduct.id = Number.parseInt(body.id);
    }

    return parsedProduct;
}

// NOTE: As it stands now the functions below are pretty unnecessary
// since neither the categories nor suppliers really need to be parsed.
// I chose to include them anyway since this would make it easier to
// change the code in the future, for instance if new columns in need of
// parsing were to be added. It also keeps the code more uniform.

// Parses body-data into a category object with the correct data types
export function parseCategory(body) {
    const parsedCategory =  {
        name: body.name
    }

    if (body.id !== undefined) {
        parsedCategory.id = Number.parseInt(body.id);
    }

    return parsedCategory;
}

// Parses body-data into a supplier object with the correct data types
export function parseSupplier(body) {
    const parsedSupplier =  {
        name: body.name,
        contact: body.contact,
        email: body.email,
        country: body.country,
        phone: body.phone
    }

    if (body.id !== undefined) {
        parsedSupplier.id = Number.parseInt(body.id);
    }

    return parsedSupplier;
}
