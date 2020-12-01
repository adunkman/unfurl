const UserScope = require('../../models/UserScope');
const DynamoDBStoredModel = require('../../persistence/DynamoDBStoredModel');

module.exports = {
  name: 'unfurl/plugins/services',
  register: async (server, { dynamoDBEndpoint, adminEmailsCsv }) => {
    DynamoDBStoredModel.configure(dynamoDBEndpoint);
    UserScope.configure(adminEmailsCsv);
  },
};
