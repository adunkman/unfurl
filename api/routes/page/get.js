const Joi = require("joi");
const Boom = require("@hapi/boom");
const { extractMetadata, summarizeMetadata } = require("../../util/metadata");
const { httpClient } = require("../../util/httpClient");

module.exports = {
  method: "GET",
  path: "/page",
  options: {
    validate: {
      query: Joi.object({
        format: Joi.string().valid("json").default("json"),
        maxwidth: Joi.number().min(1),
        maxheight: Joi.number().min(1),
        url: Joi.string()
          .uri({ scheme: ["http", "https"] })
          .required(),
      }),
    },
    pre: [
      {
        method: async (request) => {
          const client = httpClient(request.log.bind(request));
          const url = request.query.url;

          try {
            const { payload } = await client.get(url);
            return payload.toString("utf-8");
          } catch (err) {
            const { statusCode } = err.output;

            if (statusCode) {
              return Boom.badGateway(
                `URL ${url} returned status code ${statusCode}`
              );
            } else {
              return Boom.gatewayTimeout(
                `URL ${url} did not return a response within ${client._defaults.timeout}ms.`
              );
            }
          }
        },
        assign: "html",
      },
    ],
  },
  handler: async (request) => {
    return extractMetadata(request.pre.html);
  },
};
