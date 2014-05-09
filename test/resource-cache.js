'use strict';

var expect = require('chai')
.use(require('sinon-chai'))
.use(require('chai-things'))
.expect;
var sinon = require('sinon');
var middlebot = require('middlebot');

describe('Middlebot resource cache', function() {
  var resourceCache, app, req, res;
  var resourceKey = 'myResource:1:c1d44ff03aff1372856c281854f454e2e1d15b7c';

  beforeEach(function () {
    req = {
      query: {
        id: 1
      }
    };

    res = {};

    resourceCache = require('../lib/resource-cache')({
      name: 'myResource'
    });

    app = middlebot();
  });

  beforeEach(function (done) {
    resourceCache._cachou.redis.flushall(done);
  });

  describe('#read', function() {
    describe('with populated cache', function () {
      beforeEach(function (done) {
        resourceCache._cachou.set(resourceKey, {
          foo: 'bar'
        }, done);
      });

      it('should serve the cache', function (done) {
        app.use(resourceCache.read());
        app.handle('default', req, res, function (err, req, res) {
          if (err) return done(err);
          expect(res.body).to.eql({ foo: 'bar' });
          done();
        });
      });

      it('should be possible to specify the name', function (done) {
        app.use(resourceCache.read({ name: 'test' }));
        app.handle('default', req, res, function (err, req, res) {
          if (err) return done(err);
          expect(res.body).to.not.exists;
          done();
        });
      });
    });

    describe('with unpopulated cache', function () {
      it('should do nothing', function (done) {
        app.use(resourceCache.read());
        app.handle('default', req, res, function (err, req, res) {
          if (err) return done(err);
          expect(res.body).to.not.exists;
          done();
        });
      });
    });
  });

  describe('#populate', function () {
    it('should populate the cache asynchronously', function (done) {
      app.use(resourceCache.populate());
      app.handle('default', req, { body: 'test' }, function (err) {
        if (err) return done(err);

        // Try to get result just after the handle.
        resourceCache._cachou.get(resourceKey, function (err, cacheRes) {
          if (err) return done(err);
          expect(cacheRes).to.be.null;

          // Defer by 20ms.
          setTimeout(function () {
            resourceCache._cachou.get(resourceKey, function (err, cacheRes) {
              if (err) return done(err);
              expect(cacheRes).to.equal('test');
              done();
            });
          }, 20);
        });
      });
    });
  });

  describe('#invalidate', function () {
    beforeEach(function (done) {
      resourceCache._cachou.set(resourceKey, {
        foo: 'bar'
      }, done);
    });

    it('should invalidate the cache asynchronously', function (done) {
      app.use(resourceCache.invalidate());
      app.handle('default', req, req, function (err) {
        if (err) return done(err);
        resourceCache._cachou.get(resourceKey, function (err, cacheRes) {
          if (err) return done(err);
          expect(cacheRes).to.be.null;
          done();
        });
      });
    });
  });
});