const { DynamoDB } = require('aws-sdk');
const server = require('./server/index');

const config = {
  host: process.env.HOST,
  uiUrl: process.env.UI_URL,
  logLevel: process.env.LOG_LEVEL || 'info',
};

const services = {
  dynamoDB: new DynamoDB({
    apiVersion: '2012-08-10',
    region: 'us-east-1',
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
  }),
};

exports.handler = async (event, options = {}) => {
  const request = {
    method: event.requestContext.http.method,
    url: `${event.rawPath}?${event.rawQueryString}`.replace(
      `${event.requestContext.stage}/`,
      '',
    ),
    headers: event.headers,
    payload: Buffer.from(event.body || '', 'base64').toString(),
  };

  const api = await server.init({ ...config, ...options }, services);
  const response = await api.inject(request);

  return {
    statusCode: response.statusCode,
    cookies: response.cookies,
    isBase64Encoded: false,
    headers: response.headers,
    body: response.payload,
  };
};
