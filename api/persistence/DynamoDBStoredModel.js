const { marshall, unmarshall } = require('aws-sdk').DynamoDB.Converter;

module.exports = class DynamoDBStoredModel {
  constructor(attributes) {
    this.attributes = attributes;
  }

  toJSON() {
    return { ...this.attributes };
  }

  static configure(dynamoDB) {
    this.adapter = dynamoDB;
  }

  static async all() {
    const results = await this.adapter
      .scan({
        TableName: this.tableName,
      })
      .promise();

    return {
      items: results.Items.map(item => new this(unmarshall(item))),
      count: results.Count,
    };
  }

  static async create(attributes) {
    const instance = new this(attributes);

    await this.adapter
      .putItem({
        TableName: this.tableName,
        Item: marshall(instance.toJSON()),
        ConditionExpression: `attribute_not_exists(${this.primaryKey})`,
      })
      .promise();

    return instance;
  }

  static async find(query) {
    const results = await this.adapter
      .getItem({
        TableName: this.tableName,
        Key: marshall(query),
      })
      .promise();

    return results.Item ? new this(unmarshall(results.Item)) : null;
  }

  static async where(query) {
    const attributes = {};
    const conditions = [];

    Object.entries(query.attributes).forEach(([k, v], index) => {
      const name = `:attr${index}`;
      attributes[name] = v;
      conditions.push(`${k} = ${name}`);
    });

    const results = await this.adapter
      .query({
        TableName: this.tableName,
        IndexName: query.index,
        ExpressionAttributeValues: marshall(attributes),
        KeyConditionExpression: conditions.join(' AND '),
      })
      .promise();

    return {
      items: results.Items.map(item => new this(unmarshall(item))),
      count: results.Count,
    };
  }

  static async delete(query) {
    const results = await this.adapter
      .deleteItem({
        TableName: this.tableName,
        Key: marshall(query),
        ConditionExpression: `attribute_exists(${this.primaryKey})`,
        ReturnValues: 'ALL_OLD',
      })
      .promise();

    return results.Attributes ? new this(unmarshall(results.Attributes)) : null;
  }
};
