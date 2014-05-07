var chai = require('chai');
var expect = chai.expect;

var cacheUtils = require('../lib/cache-key');

describe('Cache key', function() {
  describe('#format', function() {
    it('should format the cache key', function () {
      expect(cacheUtils.format('test', 1, 'user'))
      .to.equal('test:1:12dea96fec20593566ab75692c9949596833adc9');
    });
  });

  describe('#formatMatcher', function() {
    it('should format the glob pattern to match key', function () {
      expect(cacheUtils.formatMatcher('test', 1))
      .to.equal('test:1*');
    });
  });
});


