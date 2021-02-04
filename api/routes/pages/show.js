const Joi = require('joi');
const Boom = require('@hapi/boom');
const { parseMetadata } = require('../../util/metadata');
const { httpClient } = require('../../util/httpClient');

module.exports = {
  method: 'GET',
  path: '/pages',
  options: {
    auth: {
      strategy: 'key',
      access: {
        entity: 'app',
      },
    },
    cors: {
      origin: ['*://localhost:*', '*://0.0.0.0:*', '*://127.0.0.1:*'],
    },
    validate: {
      query: Joi.object({
        url: Joi.string()
          .uri({ scheme: ['http', 'https'] })
          .required(),
      }),
    },
    pre: [
      {
        assign: 'html',
        method: async request => {
          const client = httpClient(request.log.bind(request));
          const url = request.query.url;

          try {
            const { payload } = await client.get(url);
            return payload.toString('utf-8');
          } catch (err) {
            const { statusCode } = err.output;

            if (statusCode) {
              return Boom.badGateway(
                `URL ${url} returned status code ${statusCode}`,
              );
            } else {
              return Boom.gatewayTimeout(
                `URL ${url} did not return a response within ${client._defaults.timeout}ms.`,
              );
            }
          }
        },
      },
    ],
  },
  handler: async request => {
    return parseMetadata(request.query.url, request.pre.html);
  },
};
