'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
chai.use(require('sinon-chai'));
chai.use(require('chai-things'));

var cacheMiddlewares = require('../lib');

describe('cache middlewares', function() {
  var req, res, cache;

  beforeEach(function () {
    req = {
      where: {id: 1},
      opts: {withRelated: 'user'}
    };

    cache = {
      set: function(){},
      get: function(){},
      delAll: function(){}
    };

    sinon.spy(cache, 'set');
    sinon.stub(cache, 'get');
    sinon.stub(cache, 'delAll');

    res = {
      body: {test: 1},
      end: function(){}
    };

    sinon.spy(res, 'end');
  });

  afterEach(function () {
    cache.set.restore();
    cache.get.restore();
    cache.delAll.restore();

    res.end.restore();
  });

  describe('#setCache', function() {
    it('should cache object', function (done) {
      cacheMiddlewares.setCache({setCache: cache.set, name:'test'})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(cache.set).to.be.calledWith(
          'api:test:1:12dea96fec20593566ab75692c9949596833adc9', res.body);
        done();
      });
    });
  });

  describe('#getCache', function() {
    it('should get object from cache if cached', function (done) {
      cache.get.callsArgWith(1, null, 'cached');
      cacheMiddlewares.getCache({getCache: cache.get, name:'test'})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(res.body).to.equal('cached');
        expect(res.end).to.be.calledOnce;
        done();
      });
    });
  });

  describe('#uncache', function() {
    it('should uncache a key', function (done) {
      cache.delAll.callsArgWith(1, null);
      cacheMiddlewares.uncache({delCache: cache.delAll, name:'test'})
      (null, req, res, function (err) {
        if (err) return done(err);
        expect(cache.delAll).to.be.calledOnce;
        done();
      });
    })

  });
});

