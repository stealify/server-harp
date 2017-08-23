/**
 * Asset Pipeline
 */
var
  helpers = require('../helpers'),
  mime = require('mime'),
  prerender = require('steal-ssr-renderers'),
  path = require('path'),
  processAssets = function processAssets(req, res, next){

    var
      normalizedPath = helpers.normalizeUrl(req.url),
      priorityList = prerender.helpers.buildPriorityList(normalizedPath),
      sourceFile = prerender.helpers.findFirstFile(req.setup.publicPath, priorityList);


    /**
     * We GTFO if we don't have a source file.
     */

    if(!sourceFile){
      if (path.basename(normalizedPath) === 'index.html') {
        var pathAr = normalizedPath.split(path.sep); pathAr.pop(); // Pop index.html off the list
        var prospectCleanPath       = pathAr.join('/');
        var prospectNormalizedPath  = helpers.normalizeUrl(prospectCleanPath);
        var prospectPriorityList    = prerender.helpers.buildPriorityList(prospectNormalizedPath);
        prospectPriorityList.push(path.basename(prospectNormalizedPath + '.html'));

        sourceFile = prerender.helpers.findFirstFile(req.setup.publicPath, prospectPriorityList);

        if (!sourceFile) {
          return next();
        } else {
          // 301 redirect
          res.statusCode = 301;
          res.setHeader('Location', prospectCleanPath);
          res.end('Redirecting to ' + utilsEscape(prospectCleanPath));
        }
      } else {
        return next();
      }

    } else {
      /**
       * Now we let prerender handle the asset pipeline.
       */

      req.poly.render(sourceFile, function reqPolyRender(error, body){
        if(error){
          error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno });

          var locals = {
            project: req.headers.host,
            error: error,
            pkg: pkg
          };
          if(prerender.helpers.outputType(sourceFile) == 'css'){
            var outputType = prerender.helpers.outputType(sourceFile);
            var mimeType   = helpers.mimeType(outputType);
            var charset    = mime.charsets.lookup(mimeType);
            var body       = helpers.cssError(locals);
            res.statusCode = 200;
            // SetHeaders
            res.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''));
            res.setHeader('Content-Length', Buffer.byteLength(body, charset));
            res.end(body);
          }else{

            // Make the paths relative but keep the root dir.
            // TODO: move to helper.
            //
            // var loc = req.projectPath.split(path.sep); loc.pop()
            // var loc = loc.join(path.sep) + path.sep
            // if(error.filename) error.filename = error.filename.replace(loc, "")

            prerender.root(__dirname + '/templates').render('error.jade', locals, function(err, body){
              var mimeType   = helpers.mimeType('html');
              var charset    = mime.charsets.lookup(mimeType);
              res.statusCode = 500;
              res.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''));
              res.setHeader('Content-Length', Buffer.byteLength(body, charset));
              res.end(body);
            });
          }
        }else{
          // 404
          if(!body) return next();

          var outputType = prerender.helpers.outputType(sourceFile);
          var mimeType   = helpers.mimeType(outputType);
          var charset    = mime.charsets.lookup(mimeType);
          res.statusCode = 200;
          res.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''));
          res.setHeader('Content-Length', Buffer.byteLength(body, charset));
          res.end(body);
        }
      });
    }

  };

module.exports = processAssets;
