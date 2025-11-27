// Checks if data is a string, and that it's not undefined, null, or empty
export function validateString(data) {
    return (
        data !== undefined && 
        data !== null && 
        typeof data === "string" && 
        data.trim() !== "");
}

// Checks if data is a positive number (or 0), and that it's not undefined, null, or NaN
export function validateNumber(data) {
    return (
        data !== undefined &&
        data !== null &&
        typeof data === "number" &&
        !Number.isNaN(data) &&
        data >= 0
    );
}

// Checks if data is a valid string and is in a valid email format using regex
export function validateEmail(data) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
        validateString(data) &&
        regex.test(data)
    );
}

// Checks if data is a valid string and only contains digits, whitespace, "-" and "+"
// in an attempt to somewhat validate phone numbers
export function validatePhone(data) {
    const regex = /^[\d\s\-+]+$/;

    return (
        validateString(data) &&
        regex.test(data)
    );
}

// Validates a product object and pushes applicable errors into an array.
export function validateProduct(product) {
    const errors = [];

    // Checks if the product object contains an id-property and, if so, 
    // validates it (useful for the "PUT /api/products/:id" endpoint)
    if ("id" in product && !validateNumber(product.id)) {
        errors.push("Property 'id' must be a valid positive integer.");
    }

    if (!validateString(product.name)) {
        errors.push("Property 'name' must be a valid string.");
    }

    if (!validateNumber(product.price)) {
        errors.push("Property 'price' must be a valid positive number.");
    }

    if (!validateNumber(product.weight)) {
        errors.push("Property 'weight' must be a valid positive number.");
    }

    if (!validateNumber(product.amount)) {
        errors.push("Property 'amount' must be a valid positive integer.");
    }

    if (!validateNumber(product.category_id)) {
        errors.push("Property 'category_id' must be a valid positive integer.");
    }

    if (!validateNumber(product.supplier_id)) {
        errors.push("Property 'supplier_id' must be a valid positive integer.");
    }

    // If the validation is successful (0 errors), isValid returns true. If any errors
    // are found, they are stored in the errors-array, and isValid returns false.
    return { isValid: errors.length === 0, errors }
}

export function validateCategory(category) {
    const errors = [];

    if ("id" in category && !validateNumber(category.id)) {
        errors.push("Property 'id' must be a valid positive integer.");
    }

    if (!validateString(category.name)) {
        errors.push("Property 'name' must be a valid string.");
    }

    return { isValid: errors.length === 0, errors }
}

export function validateSupplier(supplier) {
    const errors = [];

    if ("id" in supplier && !validateNumber(supplier.id)) {
        errors.push("Property 'id' must be a valid positive integer.");
    }

    if (!validateString(supplier.name)) {
        errors.push("Property 'name' must be a valid string.");
    }

    if (!validateString(supplier.contact)) {
        errors.push("Property 'contact' must be a valid string.");
    }

    if (!validateEmail(supplier.email)) {
        errors.push("Property 'email' must be a valid string and in a valid email format.");
    }

    if (!validateString(supplier.country)) {
        errors.push("Property 'country' must be a valid string.");
    }

    if (!validatePhone(supplier.phone)) {
        errors.push("Property 'phone' must be a valid string, and only contain digits, spaces, '-' and '+'.");
    }

    return { isValid: errors.length === 0, errors }
}