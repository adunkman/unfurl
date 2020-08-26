const Joi = require('joi');

module.exports = {
  method: 'GET',
  path: '/expand',
  options: {
    validate: {
      query: Joi.object({
        url: Joi.string().uri({ scheme: ['http', 'https'] }).required()
      })
    }
  },
  handler: (request, h) => {
    request.log('info', 'get expanded url');
    return {
      message: 'hello!'
    };
  }
};
