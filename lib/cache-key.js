var checksum = require('checksum');

module.exports = {
  format: format,
  formatMatcher: formatMatcher
};

/**
 * Format the key.
 *
 * @param {String} name
 * @param {Number} id
 * @param {Mixed} hash
 * @returns {String} key
 */

function format(name, id, hash) {
  // Convert hash to a valid checksum.
  hash = checksum(hash + '');

  var parts = [name, id, hash];
  return parts.join(':');
}

/**
 * Format the glob pattern to match keys.
 *
 * @param {String} name
 * @param {Number} id
 * @returns {String} pattern
 */

function formatMatcher(name, id) {
  var parts = [name, id];
  var key = parts.join(':');
  return key + '*';
}

