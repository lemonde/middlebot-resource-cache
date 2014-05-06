'use strict';

var chai = require('chai');
var expect = chai.expect;

var cacheUtils = require('../lib/utils');

describe('cache utils', function() {
  describe('#format', function() {
    it('should format the cache key', function () {
      expect(cacheUtils.format('test', 1, 'user'))
      .to.equal('api:test:1:12dea96fec20593566ab75692c9949596833adc9');
    });
  });

  describe('#formatMatcher', function() {
    it('should format the glob pattern to match key', function () {
      expect(cacheUtils.formatMatcher('test', 1))
      .to.equal('api:test:1*');
    });
  });
});


