// framework/request.js
// Reads the request body from the stream and parses JSON

function readBody(req) {
  return new Promise((resolve, reject) => {
    let rawData = "";

    // Node streams data in chunks - collect them all
    req.on("data", function (chunk) {
      rawData += chunk;
    });

    // When all chunks are received, try to parse JSON
    req.on("end", function () {
      if (!rawData) {
        resolve({}); // no body sent
        return;
      }

      try {
        const parsed = JSON.parse(rawData);
        resolve(parsed);
      } catch (err) {
        reject(new Error("Invalid JSON in request body"));
      }
    });

    req.on("error", function (err) {
      reject(err);
    });
  });
}

module.exports = readBody;
