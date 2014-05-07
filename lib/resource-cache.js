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
  var name = options.name;

  this.read = read;
  this.populate = populate;
  this.invalidate = invalidate;

  /**
   * Read the cache and serve it if avalaible.
   */

  function read(req, res, next) {
    var key = cacheKey.format(name, req.query.id, req.query);

    cache.get(key, function (err, cacheRes) {
      if (err) return next(err);

      // Populate and body and stop.
      if (cacheRes) {
        res.body = cacheRes;
        res.end();
      }

      next();
    });
  }

  /**
   * Populate the cache.
   */

  function populate(req, res, next) {
    var key = cacheKey.format(name, req.query.id, req.query);
    cache.set(key, res.body);
    next();
  }

  /**
   * Invalidate the cache.
   */

  function invalidate(req, res, next) {
    var matcher = cacheKey.formatMatcher(name, req.query.id);
    cache.delAll(matcher, next);
  }
}