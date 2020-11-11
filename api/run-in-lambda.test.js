const { handler } = require('./run-in-lambda');
const request = require('./fixtures/request.json');

describe('run-in-lambda', () => {
  it('handles a api gateway v2 event for a request to the index', async () => {
    const response = await handler(request, {
      logLevel: 'fatal',
    });

    expect(response).toMatchObject({
      statusCode: 200,
      cookies: {},
      isBase64Encoded: false,
      headers: {},
    });

    expect(JSON.parse(response.body)).toMatchObject({
      documentation_url: 'https://www.unfurl.page/documentation',
    });
  });
});
