const { DynamoDB } = require('aws-sdk');
const { v4: uuidV4 } = require('uuid');
const { marshall, unmarshall } = DynamoDB.Converter;

module.exports = {
  name: __filename,
  register: async (server, { dynamoDBEndpoint }) => {
    const dynamodb = new DynamoDB({
      apiVersion: '2012-08-10',
      region: 'us-east-1',
      endpoint: dynamoDBEndpoint,
    });

    const TableName = 'api_keys';

    server.app.keystore = {
      all: async () => {
        const results = await dynamodb.scan({ TableName }).promise();

        return {
          items: results.Items.map(unmarshall),
          count: results.Count,
        };
      },

      create: async ({ email }) => {
        const key = {
          api_key: uuidV4(),
          api_version: 1,
          owner_email: email,
          owner_email_confirmed: false,
          role: 'consumer',
        };

        await dynamodb
          .putItem({
            TableName,
            Item: marshall(key),
            ConditionExpression: 'attribute_not_exists(api_key)',
          })
          .promise();

        return key;
      },

      get: async ({ email, key }) => {
        const query = {};

        if (email) {
          query.owner_email = email;
        }
        if (key) {
          query.api_key = key;
        }

        const results = await dynamodb
          .getItem({
            TableName,
            Key: marshall(query),
          })
          .promise();

        return results.Item ? unmarshall(results.Item) : null;
      },

      delete: async ({ key }) => {
        const results = await dynamodb
          .deleteItem({
            TableName,
            Key: marshall({ api_key: key }),
            ConditionExpression: 'attribute_exists(api_key)',
            ReturnValues: 'ALL_OLD',
          })
          .promise();

        return results.Item ? unmarshall(results.Item) : null;
      },
    };
  },
};
