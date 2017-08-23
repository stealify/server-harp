var should      = require('should');
var steal = require('../lib')();
var middleware = require('../lib/middleware');

describe('steal as a library', function() {

  it('should expose a mount function', function() {
    should(steal.mount).be.type('function');
  });

  it('should expose the middleware', function() {
    should(steal.middleware).be.equal(middleware);
  });

});
