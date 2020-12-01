module.exports = {
  method: 'GET',
  path: '/sessions',
  options: {
    auth: {
      strategy: 'cookie',
      access: {
        entity: 'user',
      },
    },
  },
  handler: async request => {
    return request.auth.credentials;
  },
};
