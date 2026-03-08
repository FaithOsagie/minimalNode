// server.js
// The entry point. Creates the app, registers routes, and starts the server.

const createApp = require("./framework");
const registerItemRoutes = require("./routes/items");

const PORT = process.env.PORT || 3000;

// Create an instance of our mini framework
const app = createApp();

// Register all item routes
registerItemRoutes(app);

// Start the server
app.listen(PORT, function () {
  console.log("------------------------------------------");
  console.log(`  Inventory API is running on port ${PORT}`);
  console.log("------------------------------------------");
  console.log("  Available routes:");
  console.log("  GET    /items");
  console.log("  GET    /items/:id");
  console.log("  POST   /items");
  console.log("  PUT    /items/:id");
  console.log("  DELETE /items/:id");
  console.log("------------------------------------------");
});
