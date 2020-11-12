/**
 * Return the first key defined in the object.
 *
 * @param {object} object pluck keys from this object
 * @param  {...any} keys a list of keys to search for
 * @returns the value of the first matched key, or an empty string
 */
exports.pluck = (object, ...keys) => {
  const key = keys.find(key => object.hasOwnProperty(key));
  return object[key] || '';
};
