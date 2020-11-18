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

    expect(payload).toHaveProperty(
      'documentation_url',
      'https://www.unfurl.page/documentation',
    );

    expect(payload).toHaveProperty('page_url', 'http://example.com/pages');
  });
});
