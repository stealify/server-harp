/**
 * Static
 *
 * Serves up static page (if it exists).
 *
 */
var
  parse           = require('parseurl'),
  path            = require('path'),
  fs              = require('fs'),
  utilsPause      = require('pause'),
  utilsEscape     = require('escape-html'),
  url             = require('url'),
  send            = require('send');

  function static(req, res, next) {

    console.log('Static')
    var options  = {}
    var redirect = true

    if ('GET' != req.method && 'HEAD' != req.method) return next()

    // Fixes JS Delivery
    // if (['js'].indexOf(path.extname(req.url).replace(/^\./, '')) !== -1) return next()

    var pathn = parse(req).pathname;
    var pause = utilsPause(req);

    function resume() {
      next();
      pause.resume();
    }

    function directory() {
      if (!redirect) return resume();
      var pathname = url.parse(req.originalUrl).pathname;
      res.statusCode = 301;
      res.setHeader('Location', pathname + '/');
      res.end('Redirecting to ' + utilsEscape(pathname) + '/');
    }

    function error(err) {
      if (404 == err.status){
        // look for implicit `*.html` if we get a 404
        return path.extname(err.path) === ''
          ? serve(pathn + ".html")
          : resume()
      }
      next(err);
    }

    var serve = function(pathn){

      send(req, pathn, {
          maxage: options.maxAge || 0,
          root: req.setup.publicPath,
          hidden: options.hidden
        })
        .on('directory', directory)
        .on('error', error)
        .pipe(res)
    }

  // return express.static(req.setup.publicPath)(req, res, next)
    serve(pathn)
}

module.exports = static;
