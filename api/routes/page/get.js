const Joi = require('joi');
const Boom = require('@hapi/boom');
const Page = require('../../models/page');

module.exports = {
  method: 'GET',
  path: '/page',
  options: {
    validate: {
      query: Joi.object({
        format: Joi.string().valid('json').default('json'),
        maxwidth: Joi.number().min(1),
        maxheight: Joi.number().min(1),
        url: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
      })
    }
  },
  handler: async ({ query }, h) => {
    const wreck = h.wreck();
    const timeout = 3;
    const { res, payload } = await wreck.get(query.url, {
      redirects: 10,
      timeout: timeout * 1000,
    });

    if (res.statusCode < 300) {
      return new Page(payload.toString('utf-8')).toJSON();
    }
    else if (res.statusCode < 500) {
      return Boom.badGateway(
        `URL ${query.url} returned status code ${res.statusCode}`);
    }
    else {
      return Boom.gatewayTimeout(
        `URL ${query.url} did not return a response within ${timeout} seconds.`);
    }
  }
};
