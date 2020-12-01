module.exports = class UserScope {
  static user = 'user';
  static admin = 'admin';

  static configure(adminEmailsCsv = '') {
    this.adminEmails = adminEmailsCsv.split(',').map(e => e.trim());
  }

  static isAdmin(credentials = {}) {
    return (credentials.scope || []).includes(this.admin);
  }

  static scopesForUser(user = {}) {
    const scopes = ['user'];
    const emails = user.emails || [];

    if (emails.some(email => this.adminEmails.includes(email))) {
      scopes.push('admin');
    }

    return scopes;
  }
};
