const server = require('./server/index');

const config = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  logLevel: process.env.LOG_LEVEL || 'debug',
  isProduction: false,
  uiUrl: process.env.UI_URL || 'http://0.0.0.0:1313',
  dynamoDBEndpoint: 'http://dynamodb:8000',
  adminEmailsCsv: process.env.ADMIN_EMAILS_CSV,
  useTestAuthentication: true,
  githubClientId: process.env.AUTH_GITHUB_CLIENT_ID,
  githubClientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
  cookieEncryptionSecret: process.env.COOKIE_ENCRYPTION_SECRET,
};

(async () => {
  const api = await server.init(config);
  api.start();
})();
