const { API_URL } = process.env;

class User {
  static refresh = new Promise(resolve => (User.fresh = resolve));
  static initialized = false;
  static ttl = 1 * 60 * 60 * 1000; // one hour

  static get name() {
    return this.credentials.user.name;
  }

  static get emails() {
    return this.credentials.user.emails;
  }

  static async refreshState() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.credentials = this.fromCache() || (await this.fromAPI());
    this.fresh();
  }

  static async isAuthenticated() {
    await this.refresh;
    return !!this.credentials;
  }

  static fromCache() {
    try {
      const credentials = JSON.parse(sessionStorage.getItem('credentials'));

      if (!credentials) {
        return false;
      }

      const { expires } = credentials;

      if (new Date(expires) > new Date()) {
        return credentials;
      }
    } catch (error) {
      console.error(error);
    }

    sessionStorage.removeItem('credentials');
    return false;
  }

  static async fromAPI() {
    try {
      const response = await fetch(`${API_URL}/sessions`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (response.status === 200) {
        data.expires = new Date(Date.now() + this.ttl).toISOString();
        sessionStorage.setItem('credentials', JSON.stringify(data));
        return data;
      }
    } catch (error) {
      return false;
    }
  }

  static async logout() {
    sessionStorage.removeItem('credentials');
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.status === 200;
  }
}

module.exports = (skipRefreshOnImport = false) => {
  if (!skipRefreshOnImport) {
    User.refreshState();
  }

  return User;
};
