const DynamoDbStoredModel = require('../../persistence/DynamoDbStoredModel');

module.exports = {
  name: 'unfurl/plugins/persistence',
  register: async (server, { dynamoDBEndpoint }) => {
    DynamoDbStoredModel.configure({ endpoint: dynamoDBEndpoint });
  },
};
