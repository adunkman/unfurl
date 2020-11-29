const { DynamoDB } = require('aws-sdk');
const server = require('./server/index');

const config = {
  host: process.env.HOST || 'localhost',
  uiUrl: process.env.UI_URL || 'http://0.0.0.0:1313',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  logLevel: process.env.LOG_LEVEL || 'debug',
};

const services = {
  dynamoDB: new DynamoDB({
    apiVersion: '2012-08-10',
    region: 'us-east-1',
    endpoint: 'http://dynamodb:8000',
  }),
};

(async () => {
  const api = await server.init(config, services);
  api.start();
})();
