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

/**
 * Cache a resource
 *
 * @param {function} options.setCache store the
 * provided key/value pair
 * @param {string} options.name the key to use
 * @return {function} set cache middleware
 */
function setCache(options) {

  /**
   * @param {integer} req.where.id
   * @param {string} req.opts.withRelated
   * @param {Object} res.body
   */
  return function (err, req, res, next) {
    var key = cacheUtils.format(options.name, req.where.id, req.opts.withRelated);
    options.setCache(key, res.body);
    next();
  };
}

/**
 * Retrieve a cached resource. If found,
 * stop middlewares execution
 *
 * @param {function} options.getCache retrieve the
 * provided key
 * @param {string} options.name the key to use
 * @return {function} get cache middleware
 */
function getCache(options) {

  /**
   * @param {integer} req.where.id
   * @param {string} req.opts.withRelated
   * @param {Object} res.body
   */
  return function (err, req, res, next) {
    var key = cacheUtils.format(options.name, req.where.id, req.opts.withRelated);
    options.getCache(key, function (err, cacheRes) {
      if (err) return next(err);

      //store cached resource and end middlewares
      //execution
      if (cacheRes) {
        res.body = cacheRes;
        res.end();
      }

      next();
    });
  };
}

/**
 * Uncache a resource
 *
 * @param {function} options.delCache delete the
 * resource at the provided key
 * @param {string} options.name the key to use
 * @return {function} uncache middleware
 */
function uncache(options) {

  /**
   * @param {integer} req.where.id
   */
  return function (err, req, res, next) {
    options.delCache(cacheUtils.formatMatcher(options.name, req.where.id), function (err) {
      if (err) return next(err);
      next();
    });
  };
}

