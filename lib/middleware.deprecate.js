var path            = require('path')
var fs              = require('fs')
var helpers         = require('./helpers')
var mime            = require('mime')
var prerender       = require('steal-ssr')
var pkg             = require('../package.json')

// var connect         = require('connect')
var express         = require('express')
var cbasicAuth      = require('basic-auth');
var send            = require('send')
var utilsPause      = require('pause')
var utilsEscape     = require('escape-html')
var parse           = require('parseurl')
var url             = require('url')


var middleware = require('./middleware')

  middleware.ejs_js = function (req,res,next) {
      if (req.originalUrl.indexOf('.js.') > -1) {
      try {
            // Query the entry
            stats = fs.lstatSync(res.staticPath + req.originalUrl+'.ejs');

            // Is it a directory?
            if (stats.isFile()) {
            // Render ejs as js
              var static = express.static(res.staticPath)
            return static(req, res, next)

            } else next()
        }catch (e) {
            // Call next middleware??
            next()
        }
      } else next()
    }


  middleware.staticExpress = function disabledStaticExpress(req,res,next) {
    // express.static(req.setup.publicPath)(req, res, next)
    next()
  }
  middleware.mid_steal = function (req, res,next) {
      // steal.middleware.db
      // call if res end if not called already should normaly not happen
      if (res.headerSent) return  res.end()
      var mime = require('mime')
      var path = require('path')
      var pathname = req.originalUrl;
      var mimeType = mime.lookup(pathname);
      var extension = path.extname(pathname);
      // set header
      if (mimeType == 'application/octet-stream') mimeType = mime.lookup('htm')
      res.set('Content-Type', mimeType);
      middleware.routerMount(res.staticPath)(req, res, next)
    }




var reservedDomains = ["local","steal.io", "stealdev.io", "stealapp.io"]

middleware.index = function(dirPath){
  return function(req, res, next){
    // TODO: Show Index only in Dev Mode With Local Domains
    return next()
    var host      = req.headers.host;
    var hostname  = host.split(':')[0];
    var arr       = hostname.split(".");
    var port      = host.split(':')[1] ? ':' + host.split(':')[1] : '';
    var poly      = prerender.root(__dirname + "/templates");

    if(arr.length == 2){
      fs.readdir(dirPath, function(err, files){
        var projects = [];

        files.forEach(function(file){
          var local = file.split('.');

          var appPart = local.join("_");

          if (local.length > 2) {
            var domain = local.slice(Math.max(local.length - 2, 1)).join(".");
            if (reservedDomains.indexOf(domain) != -1) {
              appPart =  local[0];
            }
          }

          // DOT files are ignored.
          if (file[0] !== ".") {
            projects.push({
              "name"      : file,
              "localUrl"  : 'http://' + appPart + "." + host,
              "localPath" : path.resolve(dirPath, file)
            });
          }
        });

        poly.render("index.jade", { pkg: pkg, projects: projects, layout: "_layout.jade" }, function(error, body){
          res.end(body)
        });
      })
    } else {
      next();
    }
  }
}

middleware.hostByDomainProjectFinder = function hostByDomainProjectFinder(dirPath){
  return function(req, res, next){
    var host        = req.headers.host;
    var hostname    = host.split(':')[0];
    var matches     = [];
    req.projectPath = dirPath +'/'+hostname
    console.log(req.projectPath)
    next()
  }
}



middleware.hostProjectInit = function hostProjectInit(dirPath){
  return function(req, res, next){
    // look for _steal.js (json)
    // if exists read it
    var hostname    = host.split(':')[0];
    var matches     = [];

    // req.projectPath = dirPath +'/'+hostname
    console.log(req.projectPath)
    next()
  }
}

middleware.hostProjectFinder = function hostProjectFinder(dirPath){
  return function(req, res, next){
    var host        = req.headers.host;
    var hostname    = host.split(':')[0];
    var matches     = [];

    if (typeof req.projectPath == 'string') return next()

    fs.readdir(dirPath, function(err, files){

      var appPart = hostname.split(".")[0];
      files.forEach(function(file){
        var fp = file.split('.');
        var filePart;
        // Check against Reserved Domains first.
        if (fp.length > 2) {
          var domain = fp.slice(Math.max(fp.length - 2, 1)).join(".");
          if (reservedDomains.indexOf(domain) != -1) {
            fp = fp.slice(0, Math.max(fp.length - 2))
          }
        }

        filePart = fp.join("_");
        if (appPart == filePart) {
          matches.push(file);
        }
      });

      if(matches.length > 0){
        req.projectPath = path.resolve(dirPath, matches[0]);
        next();
      } else {
        res.end("Cannot find project")
      }

    });

  }
}



/**
 * Sets up the poly object
 */

middleware.poly = function(req, res, next){
  // console.log('Poly')
  if(req.hasOwnProperty("poly")) return next()

  try{
    req.poly = prerender.root(req.setup.publicPath, req.setup.config.globals)
    next()
  }catch(error){

    if (error.message.split(':')[0] == 'ENOENT') {
      var locals = {
        project: req.headers.host,
        error: error,
        pkg: pkg
      }
      locals.error.name = '404'
      locals.error.message = 'Domain not Configured'
      return prerender.root(__dirname + "/templates").render("error_project_not_found.jade", locals, function(err, body){
        var type    = helpers.mimeType("html")
        var charset = mime.charsets.lookup(type)
        res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
        res.statusCode = 404
        res.setHeader('Content-Length', Buffer.byteLength(body, charset));
        res.end(body)
      });

    } else {

      error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno })
      var locals = {
        project: req.headers.host,
        error: error,
        pkg: pkg
      }

      //  res.end("Cannot find project for: "+)

      return prerender.root(__dirname + "/templates").render("error.jade", locals, function(err, body){
        res.statusCode = 500
        res.end(body)
      })
    }
  }

}

/*
function(req, res, next){
  skin(req, res, [custom200static, custom200dynamic, notFound], next)
}
*/

middleware.db = [
  middleware.poly,
  function(req, res, next){
    req.setup.config.globals.title="DAMN!"
    /*
    const sourceFile= {
      "projectPath" : "/path/to/app",
      "publicPath"  : "/path/to/app/public",
      "config"      : { "globals": req.setup.config.globals }
    }
    */

    var sourceFile = 'index.ejs'
    // Will look automaticly for layout of that ejs file :)

    var planet = prerender.root(req.projectPath+'/videos', { "title": "Bitchin" })

    planet.render(sourceFile, { "title": "Override the global title" }, function(error, body){
      // console.log(error,body)
      if(error){
        // TODO: make this better
        res.statusCode = 404;
        res.end("There is an error in your " + sourceFile + " file")
      }else{
        if(!body) return next()
        // console.log(JSON.stringify(body))
        // Option for setting headers in data json
        if (req.setup.config.headers) console.log(req.setup.config.headers)

        var type    = helpers.mimeType("html")
        var charset = mime.charsets.lookup(type)
        res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
        res.setHeader('Content-Length', Buffer.byteLength(body, charset));
        res.statusCode = 200;
        res.end(body)
      }

    })
}]



/*
function(req, res, next){
  skin(req, res, [custom404static, custom404dynamic, default404], next)
}
*/

/**
 * Custom 200
 *
 *  1. return static 200.html file
 *  2. compile and return 200.xxx file
 *
 */

middleware.custom200static = function(req, res, next){
  fs.readFile(path.resolve(req.setup.publicPath, "200.html"), function(err, contents){
    if(contents){
      var body    = contents.toString()
      var type    = helpers.mimeType("html")
      var charset = mime.charsets.lookup(type)
      res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''))
      res.setHeader('Content-Length', Buffer.byteLength(body, charset));
      res.statusCode = 200
      res.end(body)
    }else{
      next()
    }
  })
}

/**
 * Custom 200 (jade, md, ejs, pug)
 *
 *  1. return static 200.html file
 *  2. compile and return 404.xxx file
 *
 */

middleware.custom200dynamic = [middleware.poly, function(req,res,next){
    var priorityList  = prerender.helpers.buildPriorityList("200.html")
    var sourceFile    = prerender.helpers.findFirstFile(req.setup.publicPath, priorityList)
    if(!sourceFile) return next()

    req.poly.render(sourceFile, function(error, body){
      if(error){
        // TODO: make this better
        res.statusCode = 404;
        res.end("There is an error in your " + sourceFile + " file")
      }else{
        if(!body) return next()
        var type    = helpers.mimeType("html")
        var charset = mime.charsets.lookup(type)
        if (req.setup.config.headers) console.log(req.setup.config.headers)
        res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
        res.setHeader('Content-Length', Buffer.byteLength(body, charset));
        res.statusCode = 200;
        res.end(body)
      }
    })
  }]



/*
function(req, res, next){

  skin(req, res, [poly], function(){
    var priorityList  = prerender.helpers.buildPriorityList("200.html")
    var sourceFile    = prerender.helpers.findFirstFile(req.setup.publicPath, priorityList)
    if(!sourceFile) return next()

    req.poly.render(sourceFile, function(error, body){
      if(error){
        // TODO: make this better
        res.statusCode = 404;
        res.end("There is an error in your " + sourceFile + " file")
      }else{
        if(!body) return next()
        var type    = helpers.mimeType("html")
        var charset = mime.charsets.lookup(type)
        if (req.setup.config.headers) console.log(req.setup.config.headers)
        res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
        res.setHeader('Content-Length', Buffer.byteLength(body, charset));
        res.statusCode = 200;
        res.end(body)
      }
    })
  })

}
*/


/**
 * Custom 404 (html)
 *
 *  1. return static 404.html file
 *  2. compile and return 404.xxx file
 *
 * TODO: cache readFile IO
 *
 */

middleware.custom404static = function(req, res, next){
  fs.readFile(path.resolve(req.setup.publicPath, "404.html"), function(err, contents){
    if(contents){
      var body    = contents.toString()
      var type    = helpers.mimeType("html")
      var charset = mime.charsets.lookup(type)
      res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''))
      res.setHeader('Content-Length', Buffer.byteLength(body, charset));
      res.statusCode = 404
      res.end(body)
    }else{
      next()
    }
  })
}


/**
 * Custom 404 (pug,jade, md, ejs)
 *
 *  1. return static 404.html file
 *  2. compile and return 404.xxx file
 *
 */

middleware.custom404dynamic = [middleware.poly, function(req,res,next){
    var priorityList  = prerender.helpers.buildPriorityList("404.html")
    var sourceFile    = prerender.helpers.findFirstFile(req.setup.publicPath, priorityList)
    if(!sourceFile) return next()

    req.poly.render(sourceFile, function(error, body){
      if(error){
        // TODO: make this better
        res.statusCode = 404;
        res.end("There is an error in your " + sourceFile + " file")
      }else{
        if(!body) return next()
        var type    = helpers.mimeType("html")
        var charset = mime.charsets.lookup(type)
        res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
        res.setHeader('Content-Length', Buffer.byteLength(body, charset));
        res.statusCode = 404;
        res.end(body)
      }
    })
  }]
/*
function(req, res, next){
  skin(req, res, [poly], function(){
    var priorityList  = prerender.helpers.buildPriorityList("404.html")
    var sourceFile    = prerender.helpers.findFirstFile(req.setup.publicPath, priorityList)
    if(!sourceFile) return next()

    req.poly.render(sourceFile, function(error, body){
      if(error){
        // TODO: make this better
        res.statusCode = 404;
        res.end("There is an error in your " + sourceFile + " file")
      }else{
        if(!body) return next()
        var type    = helpers.mimeType("html")
        var charset = mime.charsets.lookup(type)
        res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
        res.setHeader('Content-Length', Buffer.byteLength(body, charset));
        res.statusCode = 404;
        res.end(body)
      }
    })
  })
}
*/

/**
 * Default 404
 *
 * No 200 nor 404 files were found.
 *
 */

middleware.default404 = function(req, res, next){
  var locals = {
    project: req.headers.host,
    name: "Page Not Found",
    pkg: pkg
  }
  prerender.root(__dirname + "/templates").render("404.jade", locals, function(err, body){
    var type    = helpers.mimeType("html")
    var charset = mime.charsets.lookup(type)
    console.log(res.header())
    res.set('Content-Type', type + (charset ? '; charset=' + charset : ''));
    res.statusCode = 404
    res.set('Content-Length', Buffer.byteLength(body, charset));
    res.end(body)
  })
}


/**
 * Underscore
 *
 * Returns 404 if path contains beginning underscore or other ignored files
 *
 */
middleware.underscore = function(req, res, next){
  if(prerender.helpers.shouldIgnore(req.url)){
    console.log('FIRE NOT FOUND')
    notFound(req, res, next)
  }else{
    next()
  }
}



/*
  SetHeaders


*/
middleware.setConfigHeaders = function() {
  if (req.setup.config.headers) console.log(req.setup.config.headers)
  // res.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''))
  // res.setHeader('Content-Length', Buffer.byteLength(body, charset));
  // res.
}




/**
 * Opens the (optional) steal.json file and sets the config settings.
 */

middleware.setup = function(req, res, next){
  if(req.hasOwnProperty('setup')) return next()

  try{
    req.setup = helpers.setup(req.projectPath)
    if (req.setup.config.headers) {
      //res.header("X-powered-by", "Blood, sweat, and tears")
      //res.header(req.setup.config.headers[0][0], req.setup.config.headers[0][1])
    }

  }catch(error){
    error.stack = helpers.stacktrace(error.stack, { lineno: error.lineno })

    var locals = {
      project: req.headers.host,
      error: error,
      pkg: pkg
    }

    return prerender.root(__dirname + "/templates").render("error.jade", locals, function(err, body){
      res.statusCode = 500
      res.end(body)
    })
  }

  next()
}

/**
 * Basic Auth
 */

middleware.basicAuth = function(req, res, next){

  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');

    return res.sendStatus(401);
  };

  // default empty
  var creds = []


  if(req.setup.config.hasOwnProperty("basicAuth") && req.setup.config["basicAuth"] instanceof Array) {
    // allow array
    creds = req.setup.config["basicAuth"]
  } else if(req.setup.config.hasOwnProperty("basicAuth") && typeof req.setup.config["basicAuth"] === 'string') {
    // allow string
    creds.push(req.setup.config["basicAuth"])
  }

  // move on if no creds
  if(creds.length === 0) return next();
  else {
      // return next()
      var user = cbasicAuth(req);

      if (!user || !user.name || !user.pass) {
        console.log(creds.length);
        // process.exit(creds)
        return unauthorized(res);
      };


      for (var i=0; i < creds.length; i++ ) {
        if (user.name === 'foo' && user.pass === 'bar') {
          return next();
        } else if (i == creds.length-1) return unauthorized(res);
      }
      //console.log(creds);process.exit(creds)

  }

  /* use auth lib iterate over all creds provided
  cbasicAuth(function(user, pass){
    return creds.some(function(cred){
      return cred === user + ":" + pass
    })
  })(req, res, next)
  */
}





/**
 * Fallbacks
 *
 * This is the logic behind rendering fallback files.
 *
 *  1. return static 200.html file
 *  2. compile and return 200.xxx
 *  3. return static 404.html file
 *  4. compile and return 404.xxx file
 *  5. default 404
 *
 * It is broken into two public functions `fallback`, and `notFound`
 *
 */
middleware.notFound = [middleware.custom404static, middleware.custom404dynamic, middleware.default404]
middleware.fallback = [ middleware.custom200static, middleware.custom200dynamic, middleware.notFound ]
/**
 * Modern Web Language
 *
 * Returns 404 if file is a precompiled
 *
 */
middleware.mwl = function(req, res, next){
  var ext = path.extname(req.url).replace(/^\./, '')
  req.originalExt = ext

  // This prevents the source files from being served, but also
  // has to factor in that in this brave new world, sometimes
  // `.html` (Handlebars, others), `.css` (PostCSS), and
  // `.js` (Browserify) are actually being used to specify
  // source files

//  if (['js'].indexOf(ext) === -1) {
    if (prerender.helpers.processors["html"].indexOf(ext) !== -1 || prerender.helpers.processors["css"].indexOf(ext) !== -1 || prerender.helpers.processors["js"].indexOf(ext) !== -1) {
      var router = require('express').Router()
      router.use(middleware.notFound)
      return router(req,res,next)
    } else {
      next()
    }
//  } else {
//    next()
//  }
}

middleware.endMid = [
      middleware.setup,
      middleware.basicAuth,
      middleware.underscore,
      middleware.mwl,
      middleware.staticExpress,
      middleware.static,
      middleware.poly,
      middleware.process,
      middleware.fallback
    ]






module.exports = middleware
