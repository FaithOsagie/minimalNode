// framework/index.js
// The heart of our mini framework.
// Lets you register routes like: app.get('/items', handler)
// Then starts a server that matches incoming requests to those routes.

const http = require("http");
const createResponse = require("./response");
const readBody = require("./request");

function createApp() {
  // We store all registered routes here as an array of objects
  // Each route looks like: { method: 'GET', path: '/items', handler: fn }
  const routes = [];

  // -------------------------------------------------------------------
  // Route matching helper
  // Supports static paths like /items and dynamic paths like /items/:id
  // Returns the extracted params (e.g. { id: '123' }) or null if no match
  // -------------------------------------------------------------------
  function matchRoute(routePath, requestPath) {
    const routeParts = routePath.split("/");
    const requestParts = requestPath.split("/");

    if (routeParts.length !== requestParts.length) {
      return null; // different number of segments, no match
    }

    const params = {};

    for (let i = 0; i < routeParts.length; i++) {
      const routeSegment = routeParts[i];
      const requestSegment = requestParts[i];

      if (routeSegment.startsWith(":")) {
        // This is a dynamic segment like :id — capture its value
        const paramName = routeSegment.slice(1); // remove the colon
        params[paramName] = requestSegment;
      } else if (routeSegment !== requestSegment) {
        // Static segment that doesn't match
        return null;
      }
    }

    return params; // all segments matched
  }

  // -------------------------------------------------------------------
  // The main request handler — Node calls this for every incoming request
  // -------------------------------------------------------------------
  async function handleRequest(req, res) {
    // Strip query string from URL so matching works cleanly
    const urlWithoutQuery = req.url.split("?")[0];
    const method = req.method.toUpperCase();

    // Attach our helper methods to the response object
    createResponse(res);

    // Look through our registered routes to find a match
    let matchedRoute = null;
    let params = {};

    for (const route of routes) {
      if (route.method !== method) continue;

      const result = matchRoute(route.path, urlWithoutQuery);
      if (result !== null) {
        matchedRoute = route;
        params = result;
        break;
      }
    }

    // No route matched — send 404
    if (!matchedRoute) {
      res.error(`Route ${method} ${urlWithoutQuery} not found`, 404);
      return;
    }

    // Attach params to req so handlers can use req.params.id etc.
    req.params = params;

    // For POST and PUT, read and attach the request body
    if (method === "POST" || method === "PUT" || method === "PATCH") {
      try {
        req.body = await readBody(req);
      } catch (err) {
        res.error(err.message, 400);
        return;
      }
    } else {
      req.body = {};
    }

    // Call the matched route handler, catching any unexpected errors
    try {
      await matchedRoute.handler(req, res);
    } catch (err) {
      console.error("Unhandled error in route handler:", err.message);
      res.error("Internal server error", 500);
    }
  }

  // -------------------------------------------------------------------
  // Public API — the methods developers use to register routes
  // -------------------------------------------------------------------
  const app = {
    get(path, handler) {
      routes.push({ method: "GET", path, handler });
      return app; // allow chaining
    },

    post(path, handler) {
      routes.push({ method: "POST", path, handler });
      return app;
    },

    put(path, handler) {
      routes.push({ method: "PUT", path, handler });
      return app;
    },

    delete(path, handler) {
      routes.push({ method: "DELETE", path, handler });
      return app;
    },

    // Start listening for requests
    listen(port, callback) {
      const server = http.createServer(handleRequest);
      server.listen(port, callback);
      return server;
    },
  };

  return app;
}

module.exports = createApp;
