# Inventory API

A minimalist REST API for managing inventory items, built on a custom HTTP framework using **Node.js core modules only** — no Express, no external dependencies.

---

## Project Structure

```
inventory-api/
├── server.js              # Entry point — starts the server
├── package.json
├── framework/
│   ├── index.js           # Core framework (routing, request handling)
│   ├── request.js         # Reads and parses request body
│   └── response.js        # Response helper methods
├── routes/
│   └── items.js           # Maps URL paths to controller functions
├── controllers/
│   └── items.js           # CRUD logic and input validation
└── data/
    ├── store.js           # File system read/write helpers
    └── items.json         # Data store (auto-created if missing)
```

---

## Getting Started

**Requirements:** Node.js (no npm install needed — zero external dependencies)

```bash
node server.js
```

Server runs on `http://localhost:3000` by default. To use a different port:

```bash
PORT=4000 node server.js
```

---

## API Endpoints

### Get all items
```
GET /items
```

### Get a single item
```
GET /items/:id
```

### Create an item
```
POST /items
Content-Type: application/json

{
  "name": "Blue T-Shirt",
  "price": 19.99,
  "size": "m"
}
```

### Update an item
```
PUT /items/:id
Content-Type: application/json

{
  "name": "Red T-Shirt",
  "price": 24.99,
  "size": "s"
}
```

### Delete an item
```
DELETE /items/:id
```

---

## Item Schema

| Field | Type   | Required | Notes                          |
|-------|--------|----------|--------------------------------|
| id    | string | auto     | UUID, generated on creation    |
| name  | string | yes      | Non-empty string               |
| price | number | yes      | Non-negative number            |
| size  | string | yes      | `s` (small), `m` (medium), `l` (large) |

---

## Response Format

All responses follow a consistent structure:

**Success**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error**
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## How the Framework Works

The custom framework (`/framework`) is a minimal abstraction over Node's built-in `http` module. It supports:

- **Route registration** — `app.get()`, `app.post()`, `app.put()`, `app.delete()`
- **Dynamic route params** — e.g. `/items/:id` exposes `req.params.id`
- **Automatic body parsing** — JSON request bodies are parsed and attached to `req.body`
- **Response helpers** — `res.success()` and `res.error()` for consistent responses
- **Error handling** — catches unhandled errors in route handlers and returns a 500

```js
const createApp = require('./framework');
const app = createApp();

app.get('/items', (req, res) => {
  res.success([]);
});

app.listen(3000, () => console.log('Running on port 3000'));
```

---

## Data Persistence

Items are stored in `data/items.json`. The file is created automatically if it doesn't exist. No database setup is required.