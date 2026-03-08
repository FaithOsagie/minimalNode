// controllers/items.js
// Contains the logic for each inventory API operation.
// Controllers keep route files clean — routes just call these functions.

const crypto = require("crypto");
const store = require("../data/store");

// Valid sizes an item can have
const VALID_SIZES = ["s", "m", "l"];

// -------------------------------------------------------------------
// Validation helper
// Checks that all required fields are present and valid
// Returns an error message string, or null if everything is fine
// -------------------------------------------------------------------
function validateItem(data) {
  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    return "Name is required and must be a non-empty string";
  }

  if (data.price === undefined || data.price === null) {
    return "Price is required";
  }

  const price = Number(data.price);
  if (isNaN(price) || price < 0) {
    return "Price must be a non-negative number";
  }

  if (!data.size) {
    return "Size is required";
  }

  if (!VALID_SIZES.includes(data.size)) {
    return `Size must be one of: ${VALID_SIZES.join(", ")} (small, medium, large)`;
  }

  return null; // no errors
}

// -------------------------------------------------------------------
// GET /items — return all items
// -------------------------------------------------------------------
function getAllItems(req, res) {
  const items = store.readItems();
  res.success(items);
}

// -------------------------------------------------------------------
// GET /items/:id — return a single item
// -------------------------------------------------------------------
function getOneItem(req, res) {
  const item = store.findById(req.params.id);

  if (!item) {
    res.error(`Item with id '${req.params.id}' not found`, 404);
    return;
  }

  res.success(item);
}

// -------------------------------------------------------------------
// POST /items — create a new item
// -------------------------------------------------------------------
function createItem(req, res) {
  const body = req.body;

  // Validate input
  const validationError = validateItem(body);
  if (validationError) {
    res.error(validationError, 400);
    return;
  }

  // Build the new item object
  const newItem = {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    price: Number(body.price),
    size: body.size,
  };

  // Save it
  const items = store.readItems();
  items.push(newItem);
  store.writeItems(items);

  res.success(newItem, 201); // 201 = Created
}

// -------------------------------------------------------------------
// PUT /items/:id — update an existing item (full replacement)
// -------------------------------------------------------------------
function updateItem(req, res) {
  const index = store.findIndexById(req.params.id);

  if (index === -1) {
    res.error(`Item with id '${req.params.id}' not found`, 404);
    return;
  }

  const body = req.body;

  // Validate input
  const validationError = validateItem(body);
  if (validationError) {
    res.error(validationError, 400);
    return;
  }

  const items = store.readItems();

  // Replace the old item, keeping the same id
  const updatedItem = {
    id: items[index].id,
    name: body.name.trim(),
    price: Number(body.price),
    size: body.size,
  };

  items[index] = updatedItem;
  store.writeItems(items);

  res.success(updatedItem);
}

// -------------------------------------------------------------------
// DELETE /items/:id — remove an item
// -------------------------------------------------------------------
function deleteItem(req, res) {
  const index = store.findIndexById(req.params.id);

  if (index === -1) {
    res.error(`Item with id '${req.params.id}' not found`, 404);
    return;
  }

  const items = store.readItems();
  const deletedItem = items[index];

  // Remove item from array
  items.splice(index, 1);
  store.writeItems(items);

  res.success({ deleted: deletedItem });
}

module.exports = {
  getAllItems,
  getOneItem,
  createItem,
  updateItem,
  deleteItem,
};
