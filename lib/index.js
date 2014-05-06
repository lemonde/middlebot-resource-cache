'use strict';

var cacheUtils = require('./utils');
var checksum = require('checksum');


/**
 * Middlewares to cache using Redis
 */

module.exports = {
  setCache: setCache,
  getCache: getCache,
  uncache: uncache
};

function setCache(options) {
  return function (err, req, res, next) {
    // Format cache key.
    var key = cacheUtils.format(options.name, req.where.id, req.opts.withRelated);
    options.cache.set(key, res.body);
    next();
  };
}

function getCache(options) {
  return function (err, req, res, next) {

    // Format cache key.
    var key = cacheUtils.format(options.name, req.where.id, req.opts.withRelated);

    options.cache.get(key, function (err, res) {
      if (err) return next(err);

      if (res) {
        res.body = res;
        res.end();
      }

      next();
    });
  };
}

function uncache(options) {
  return function (err, req, res, next) {
    cache.delAll(cacheUtils.formatMatcher(options.name, req.where.id), function (err) {
      if (err) return next(err);
      next();
    });
  };
}

