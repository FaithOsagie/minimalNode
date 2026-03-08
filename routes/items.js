// routes/items.js
// Connects URL paths to controller functions.
// The app object (our framework) is passed in so we can register routes on it.

const controller = require("../controllers/items");

function registerItemRoutes(app) {
  app.get("/items", controller.getAllItems);
  app.get("/items/:id", controller.getOneItem);
  app.post("/items", controller.createItem);
  app.put("/items/:id", controller.updateItem);
  app.delete("/items/:id", controller.deleteItem);
}

module.exports = registerItemRoutes;
