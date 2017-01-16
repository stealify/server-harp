var mid = {};
mid.templatesDir = __dirname + "/../templates";
mid.routerMount = require('./routerMount');
mid.headerProcessing = require('./headerProcessing');
mid.static = require('./static');
mid.appByVhost = require('./appByVhost');
mid.process = require('./process');
mid.checkPHP = require('./checkPHP');
mid.notMultihostURL = require('./notMultihostURL');
mid.replaceDevHosts = require('./replaceDevHosts');
var path            = require('path')
var fs              = require('fs')
var helpers         = require('../helpers')
var mime            = require('mime')
var prerender       = require('dssrv-prerender')
var pkg             = require('../../package.json')

// var connect         = require('connect')
var express         = require('express')
var cbasicAuth      = require('basic-auth');

  mid.ejs_js = function ejs_js(req,res,next) {
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
            // Call next mid??
            next()
        }
      } else next()
    }


  mid.staticExpress = function disabledStaticExpress(req,res,next) {
    // express.static(req.setup.publicPath)(req, res, next)
    next()
  }
  mid.mid_dssrv = function mid_dssrv(req, res,next) {
      // dssrv.mid.db
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
      mid.routerMount(res.staticPath)(req, res, next)
    }




var reservedDomains = ["local","dssrv.io", "dssrvdev.io", "dssrvapp.io"]

mid.index = function mid_index(dirPath){
  var debug = require('debug')('PRERENDER:MIDINDEX:')
  debug(dirPath)
  return function midIndex(req, res, next){
    // TODO: Show Index only in Dev Mode With Local Domains
    var debug = require('debug')('PRERENDER:MIDINDEX:')
    debug(dirPath)
    return next()
    var host      = req.headers.host;
    var hostname  = host.split(':')[0];
    var arr       = hostname.split(".");
    var port      = host.split(':')[1] ? ':' + host.split(':')[1] : '';
    var poly      = prerender.root(mid.templatesDir);

    if(arr.length == 2){
      fs.readdir(dirPath, function read(err, files){
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

mid.hostByDomainProjectFinder = function hostByDomainProjectFinder(dirPath){
  return function hostByDomainProjectFinder(req, res, next){
    var host        = req.headers.host;
    var hostname    = host.split(':')[0];
    var matches     = [];
    req.projectPath = dirPath +'/'+hostname
    var debug = require('debug')('PRERENDER:DOMAIN_PROJECT:FINDER')
    debug(req.projectPath)
    next()
  }
}



mid.hostProjectInit = function hostProjectInit(dirPath){
  return function ProjectInit(req, res, next){
    // look for _dssrv.js (json)
    // if exists read it
    var hostname    = host.split(':')[0];
    var matches     = [];

    // req.projectPath = dirPath +'/'+hostname
    var debug = require('debug')('PRERENDER:HOSTPROJECTINT')
    debug(req.projectPath)
    next()
  }
}

mid.hostProjectFinder = function hostProjectFinder(dirPath){
  return function hostProjectFinder(req, res, next){
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

mid.poly = function poly(req, res, next){
  // console.log('Poly')
  if(req.hasOwnProperty("poly")) return next()

  try{
    var debug = require('debug')('PRERENDER:POLY')
    debug('ATTACH', req.setup.publicPath, req.setup.config.globals)
    req.poly = prerender.root(req.setup.publicPath, req.setup.config.globals)
    next()
  }catch(error){

    if (error.message.split(':')[0] == 'ENOENT') {
      console.log(error)
      var locals = {
        project: req.headers.host,
        error: error,
        pkg: pkg
      }
      locals.error.name = '404'
      locals.error.message = 'Domain not Configured'
      return prerender.root(mid.templatesDir).render("error_project_not_found.jade", locals, function(err, body){
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

      return prerender.root(mid.templatesDir).render("error.jade", locals, function(err, body){
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

mid.db = [
  mid.poly,
  function mid_db(req, res, next){
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

mid.custom200static = function custom200static(req, res, next){
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

mid.custom200dynamic = [mid.poly, function custom200dynamic(req,res,next){
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

mid.custom404static = function custom404static(req, res, next){
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

mid.custom404dynamic = [mid.poly, function custom404dynamic(req,res,next){
    var priorityList  = prerender.helpers.buildPriorityList("404.html")
    var sourceFile    = prerender.helpers.findFirstFile(req.setup.publicPath, priorityList)
    if(!sourceFile) return next()

    req.poly.render(sourceFile, function polyRender(error, body){
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

mid.default404 = function default404(req, res, next){
  var locals = {
    project: req.headers.host,
    name: "Page Not Found",
    pkg: pkg
  }
  prerender.root(mid.templatesDir).render("404.jade", locals, function(err, body){
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
mid.underscore = function underscore(req, res, next){
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
mid.setConfigHeaders = function setConfigHeaders() {
  if (req.setup.config.headers) console.log(req.setup.config.headers)
  // res.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''))
  // res.setHeader('Content-Length', Buffer.byteLength(body, charset));
  // res.
}




/**
 * Opens the (optional) dssrv.json file and sets the config settings.
 */

mid.setup = function setup(req, res, next){
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

    return prerender.root(mid.templatesDir).render("error.jade", locals, function(err, body){
      res.statusCode = 500
      res.end(body)
    })
  }

  next()
}

/**
 * Basic Auth
 */

mid.basicAuth = function basicAuth(req, res, next){

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
mid.notFound = [mid.custom404static, mid.custom404dynamic, mid.default404]
mid.fallback = [ mid.custom200static, mid.custom200dynamic, mid.notFound ]
/**
 * Modern Web Language
 *
 * Returns 404 if file is a precompiled
 *
 */
mid.mwl = function mwl(req, res, next){
  var ext = path.extname(req.url).replace(/^\./, '')
  req.originalExt = ext

  // This prevents the source files from being served, but also
  // has to factor in that in this brave new world, sometimes
  // `.html` (Handlebars, others), `.css` (PostCSS), and
  // `.js` (Browserify) are actually being used to specify
  // source files

//  if (['js'].indexOf(ext) === -1) {
  var debug = require('debug')('PRERENDER:MWL:');
  debug(Object.keys(prerender.helpers.processors));
    if (prerender.helpers.processors["html"].indexOf(ext) !== -1 || prerender.helpers.processors["css"].indexOf(ext) !== -1 || prerender.helpers.processors["js"].indexOf(ext) !== -1) {
      var router = require('express').Router()
      router.use(mid.notFound)
      return router(req,res,next)
    } else {
      next()
    }
//  } else {
//    next()
//  }
}

mid.endMid = [
  mid.setup,
  mid.basicAuth,
  mid.underscore,
  mid.mwl,
  mid.staticExpress,
  mid.static,
  mid.poly,
  mid.process,
  mid.fallback
]








module.exports = mid;
