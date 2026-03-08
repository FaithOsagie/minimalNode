// framework/response.js
// Wraps the raw Node.js response object and adds helper methods

function createResponse(res) {
  // Send a JSON response with a given status code
  res.json = function (statusCode, data) {
    const body = JSON.stringify(data);
    res.writeHead(statusCode, {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
    });
    res.end(body);
  };

  // Shortcut for sending a success response
  res.success = function (data, statusCode = 200) {
    res.json(statusCode, {
      success: true,
      data: data,
    });
  };

  // Shortcut for sending an error response
  res.error = function (message, statusCode = 400) {
    res.json(statusCode, {
      success: false,
      error: message,
    });
  };

  return res;
}

module.exports = createResponse;
