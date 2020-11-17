const server = require('./server/index');
const config = {
  host: process.env.HOST,
  logLevel: process.env.LOG_LEVEL || 'info',
  dynamoDBEndpoint: 'https://dynamodb.us-east-1.amazonaws.com',
};

exports.handler = async (event, options = {}) => {
  const request = {
    method: event.requestContext.http.method,
    url: `${event.rawPath}?${event.rawQueryString}`.replace(
      `${event.requestContext.stage}/`,
      '',
    ),
    headers: event.headers,
    payload: event.body,
  };

  const api = await server.init({ ...config, ...options });
  const response = await api.inject(request);

  return {
    statusCode: response.statusCode,
    cookies: response.cookies,
    isBase64Encoded: false,
    headers: response.headers,
    body: response.payload,
  };
};
