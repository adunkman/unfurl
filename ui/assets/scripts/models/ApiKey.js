const { API_URL } = process.env;

module.exports = class ApiKey {
  constructor(attributes = {}) {
    this.attributes = attributes;
  }

  get isNew() {
    return !this.createdAt;
  }

  get name() {
    return `Key ${this.key.split('-')[0]}`;
  }

  get key() {
    return this.attributes.api_key;
  }

  get apiVersion() {
    return this.attributes.api_version;
  }

  get email() {
    return this.attributes.owner_email;
  }

  set email(value) {
    this.attributes.owner_email = value;
  }

  get createdAt() {
    const { created_at } = this.attributes;
    return created_at ? new Date(this.attributes.created_at) : null;
  }

  toJSON() {
    return { ...this.attributes };
  }

  equals(key) {
    return this.constructor.equals(this, key);
  }

  async save() {
    const [method, path] = this.isNew
      ? ['POST', '/keys']
      : ['PUT', `/keys/${this.key}`];

    const response = await fetch(`${API_URL}${path}`, {
      credentials: 'include',
      method,
      body: JSON.stringify(this),
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });

    const data = await response.json();

    if (response.status === 200) {
      this.attributes = data;
      return true;
    } else {
      throw new Error(
        `Unexpected status code ${response.status}: \n${JSON.stringify(
          data,
          null,
          2,
        )}`,
      );
    }
  }

  async remove() {
    const response = await fetch(`${API_URL}/keys/${this.key}`, {
      credentials: 'include',
      method: 'DELETE',
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });

    const data = await response.json();

    if (response.status === 200) {
      this.attributes = data;
      return true;
    } else {
      throw new Error(
        `Unexpected status code ${response.status}: \n${JSON.stringify(
          data,
          null,
          2,
        )}`,
      );
    }
  }

  static async all() {
    const response = await fetch(`${API_URL}/keys`, {
      credentials: 'include',
    });
    const data = await response.json();

    if (response.status === 200) {
      return data.items.map(attrs => new ApiKey(attrs));
    } else {
      throw new Error(
        `Unexpected status code: ${response.status}\n${JSON.stringify(
          data,
          null,
          2,
        )}`,
      );
    }
  }

  static equals(key1, key2) {
    return key1.key === key2.key;
  }
};
