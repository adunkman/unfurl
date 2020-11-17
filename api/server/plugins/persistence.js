const DynamoDbStoredModel = require('../../persistence/DynamoDbStoredModel');

module.exports = {
  name: __filename,
  register: async (server, { dynamoDBEndpoint }) => {
    DynamoDbStoredModel.configure({ endpoint: dynamoDBEndpoint });
  },
};
