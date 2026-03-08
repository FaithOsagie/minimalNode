// data/store.js
// Handles reading and writing items to the items.json file.
// This is our "database" — just a JSON file on disk.

const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "items.json");

// Make sure the file exists when the server starts
function initFile() {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]));
  }
}

// Read all items from the file
function readItems() {
  initFile();
  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw);
}

// Write the full items array back to the file
function writeItems(items) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(items, null, 2));
}

// Find a single item by its id
function findById(id) {
  const items = readItems();
  return items.find(function (item) {
    return item.id === id;
  });
}

// Find the index of an item in the array (useful for updates/deletes)
function findIndexById(id) {
  const items = readItems();
  return items.findIndex(function (item) {
    return item.id === id;
  });
}

module.exports = {
  readItems,
  writeItems,
  findById,
  findIndexById,
};
