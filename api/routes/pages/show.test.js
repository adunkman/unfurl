const server = require('../../server');

describe('GET /pages', () => {
  let api;

  beforeAll(async () => {
    api = await server.init();
  });

  it('requires authorization', async () => {
    const response = await api.inject({
      method: 'get',
      url: '/pages',
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(401);
    expect(payload).toHaveProperty(
      'message',
      expect.stringContaining('API key'),
    );
  });

  it('requires a url querystring parameter to be specified', async () => {
    const response = await api.inject({
      method: 'get',
      url: '/pages?key=test-consumer-token',
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(400);
    expect(payload).toHaveProperty('message', '"url" is required');
  });
});
