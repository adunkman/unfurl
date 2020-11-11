const Wreck = require("@hapi/wreck");

exports.httpClient = (logger) => {
  const client = Wreck.defaults({
    events: true,
    gunzip: true,
    redirects: 5,
    timeout: 5000,
  });

  client.events.on("response", (error, details) => {
    logger("httpClient", {
      request_url: details.uri.href,
      duration_ms: Date.now() - details.start,
      error,
    });
  });

  return client;
};
