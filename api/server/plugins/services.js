const DynamoDBStoredModel = require('../../persistence/DynamoDBStoredModel');

module.exports = {
  name: 'unfurl/plugins/services',
  register: async (server, { dynamoDB }) => {
    DynamoDBStoredModel.configure(dynamoDB);
  },
};
