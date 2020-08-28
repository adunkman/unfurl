const server = require('./server');

exports.handler = async (event) => {
  const api = await server.init();

  const request = {
    method: event.requestContext.http.method,
    url: `${event.rawPath}?${event.rawQueryString}`.replace(`${event.requestContext.stage}/`, ''),
    headers: event.headers,
    payload: event.body,
  };

  const response = await api.inject(request);

  return {
    statusCode: response.statusCode,
    cookies: response.cookies,
    isBase64Encoded: false,
    headers: response.headers,
    body: response.payload,
  };
};
