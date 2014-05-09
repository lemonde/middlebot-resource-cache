var cachou = require('cachou');
var cacheKey = require('./cache-key');

/**
 * Expose module.
 */

module.exports = resourceCacheFactory;

/**
 * Return a new instance of ResourceCache.
 *
 * @param {Object} options
 */

function resourceCacheFactory(options) {
  return new ResourceCache(options);
}

/**
 * Create a new instance of ResourceCache.
 *
 * @param {Object} options
 */

function ResourceCache(options) {
  var cache = this._cachou = cachou(options.cachou);
  var globalOptions = options;

  this.read = readFactory;
  this.populate = populateFactory;
  this.invalidate = invalidateFactory;

  /**
   * Read the cache and serve it if avalaible.
   */

  function readFactory(options) {
    options = options || globalOptions;

    return function read(req, res, next) {
      var key = cacheKey.format(options.name, req.query.id, req.query);

      cache.get(key, function (err, cacheRes) {
        if (err) return next(err);

        // Populate and body and stop.
        if (cacheRes) {
          res.body = cacheRes;
          res.end();
        }

        next();
      });
    };
  }

  /**
   * Populate the cache.
   */

  function populateFactory(options) {
    options = options || globalOptions;

    return function populate(req, res, next) {
      var key = cacheKey.format(options.name, req.query.id, req.query);
      cache.set(key, res.body);
      next();
    };
  }

  /**
   * Invalidate the cache.
   */

  function invalidateFactory(options) {
    options = options || globalOptions;

    return function invalidate(req, res, next) {
      var matcher = cacheKey.formatMatcher(options.name, req.query.id);
      cache.delAll(matcher, next);
    };
  }
}