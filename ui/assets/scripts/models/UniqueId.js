let increment = 0;

module.exports = class UniqueId {
  static number() {
    return increment++;
  }
};
