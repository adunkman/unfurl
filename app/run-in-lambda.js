const server = require('./server');
const { transformRequest, transformResponse } = require('hapi-lambda');

exports.handler = async (event) => {
  const app = await server.init();
  return transformResponse(await app.inject(transformRequest(event)));
};
