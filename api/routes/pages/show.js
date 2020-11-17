const Joi = require('joi');
const Boom = require('@hapi/boom');
const { extractMetadata, summarizeMetadata } = require('../../util/metadata');
const { httpClient } = require('../../util/httpClient');

module.exports = {
  method: 'GET',
  path: '/pages',
  options: {
    validate: {
      query: Joi.object({
        url: Joi.string()
          .uri({ scheme: ['http', 'https'] })
          .required(),
      }),
    },
    pre: [
      {
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
        assign: 'html',
      },
    ],
  },
  handler: async request => {
    const meta = extractMetadata(request.pre.html);
    return {
      ...summarizeMetadata(meta),
      meta,
    };
  },
};
