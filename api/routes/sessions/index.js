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
    cors: {
      origin: ['*://localhost:*', '*://0.0.0.0:*', '*://127.0.0.1:*'],
      credentials: true,
    },
  },
  handler: async request => {
    return request.auth.credentials;
  },
};
