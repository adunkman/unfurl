const server = require('../server');

describe('GET /', () => {
  let api;

  beforeAll(async () => {
    api = await server.init();
  });

  it('returns links to the documentation and endpoints', async () => {
    const response = await api.inject({
      method: 'get',
      url: '/',
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toEqual(
      expect.objectContaining({
        documentation_url: 'http://ui.example.com/documentation',
        pages_url: 'http://api.example.com/pages',
      }),
    );
  });
});
