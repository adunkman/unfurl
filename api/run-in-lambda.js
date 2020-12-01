const server = require('./server/index');

const config = {
  host: process.env.HOST,
  port: undefined,
  logLevel: process.env.LOG_LEVEL,
  isProduction: true,
  uiUrl: process.env.UI_URL,
  dynamoDBEndpoint: 'https://dynamodb.us-east-1.amazonaws.com',
  adminEmailsCsv: process.env.ADMIN_EMAILS_CSV,
  useTestAuthentication: false,
  githubClientId: process.env.AUTH_GITHUB_CLIENT_ID,
  githubClientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
  cookieEncryptionSecret: process.env.COOKIE_ENCRYPTION_SECRET,
};

exports.handler = async (event, options = {}) => {
  const request = {
    method: event.requestContext.http.method,
    url: `${event.rawPath}?${event.rawQueryString}`.replace(
      `${event.requestContext.stage}/`,
      '',
    ),
    headers: event.headers,
    payload: Buffer.from(event.body || '', 'base64').toString(),
  };

  const api = await server.init({ ...config, ...options });
  const response = await api.inject(request);

  return {
    statusCode: response.statusCode,
    cookies: response.cookies,
    isBase64Encoded: false,
    headers: response.headers,
    body: response.payload,
  };
};
