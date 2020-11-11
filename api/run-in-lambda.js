const server = require("./server");
const host = process.env.HOST;
const logLevel = process.env.LOG_LEVEL || "info";

exports.handler = async (event, options = {}) => {
  const request = {
    method: event.requestContext.http.method,
    url: `${event.rawPath}?${event.rawQueryString}`.replace(
      `${event.requestContext.stage}/`,
      ""
    ),
    headers: event.headers,
    payload: event.body,
  };

  const api = await server.init(Object.assign({ host, logLevel }, options));
  const response = await api.inject(request);

  return {
    statusCode: response.statusCode,
    cookies: response.cookies,
    isBase64Encoded: false,
    headers: response.headers,
    body: response.payload,
  };
};
