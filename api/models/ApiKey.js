const { v4: uuidV4 } = require('uuid');
const DynamoDBStoredModel = require('../persistence/DynamoDBStoredModel');

module.exports = class ApiKey extends DynamoDBStoredModel {
  static tableName = 'api_keys';
  static primaryKey = 'api_key';

  get key() {
    return this.attributes.api_key;
  }

  get apiVersion() {
    return this.attributes.api_version;
  }

  get email() {
    return this.attributes.owner_email;
  }

  get isEmailConfirmed() {
    return this.attributes.owner_email_confirmed;
  }

  get role() {
    return this.attributes.role;
  }

  get createdAt() {
    return new Date(this.attributes.created_at);
  }

  isAdmin() {
    return this.role === 'admin';
  }

  static async create({ email }) {
    return super.create({
      api_key: uuidV4(),
      api_version: 1,
      owner_email: email,
      owner_email_confirmed: false,
      role: 'consumer',
      created_at: new Date().toISOString(),
    });
  }

  static async find({ email, key }) {
    const query = {};

    if (email) {
      query.owner_email = email;
    }
    if (key) {
      query.api_key = key;
    }

    return super.find(query);
  }

  static async where({ email }) {
    return super.where({
      index: 'owner_email_index',
      attributes: { owner_email: email },
    });
  }

  static async delete({ key }) {
    return super.delete({ api_key: key });
  }
};
