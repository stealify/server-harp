const
  path        = require('path'),
  fs          = require('fs-extra'),
  express     = require('express'),
  prerender   = require('dssrv-prerender'),
  async       = require('async'),
  mime        = require('mime'),
  helpers     = require('./helpers'),
  middleware  = require('./middleware'),
  pkg         = require('../package.json')
  debug       = require('debug')
var
  app         = express()

module.exports = function srvPrerender(){

  if (!(this instanceof srvPrerender)) {
     return new srvPrerender();
  }

  /**
   * Server
   *
   * Host a single DIREKTSPEED Server application.
   *
   */

  this.server = function(dirPath, options, callback){

    app.options = options || {}

    app.use(function accessControlOriginHeader(req,res,next) {
      res.set('Access-Control-Allow-Origin', 'http://'+req.headers.host)
      next()
    })

    // app = middleware.configureVhosts(app, options)


    app.use([
      middleware.headerProcessing,
      middleware.replaceDevHosts,
      function setReqProjectPath(req, rsp, next){
        req.projectPath = dirPath
        next()
      },
      middleware.endMid
    ])

    return app.listen(app.options.port, app.options.ip, function(){
      app.projectPath = dirPath
      callback.apply(app, arguments)
    })
  }


  /**
   * Multihost
   *
   * Host multiple DIREKTSPEED Server applications.
   *
   */

  this.multihost = function multihostMiddelware(dirPath, options, callback){
    var options = options || {}

    options.port = options.port || 9000
    // app = middleware.configureVhosts(app, options)


    // console.dir(middleware)
//       middleware.hostProjectFinder(dirPath),

    var multiHostMiddelware = [
      middleware.replaceDevHosts,
      middleware.headerProcessing,
      middleware.notMultihostURL,
      middleware.index(dirPath),
      middleware.hostByDomainProjectFinder(dirPath),
      middleware.endMid
    ]
    // console.dir(multiHostMiddelware)
    app.use(multiHostMiddelware)

    return app.listen(options.port, options.ip, function(){
      app.projectPath = dirPath
      callback.apply(app, arguments)
    })
    // app.listen(options.port || 9000, callback)
  }

  /**
   * Mount
   *
   * Offer the asset pipeline as connect middleware
   *
   */
  this.mount = middleware.routerMount


  /**
   * Pipeline
   *
   * Offer the asset pipeline as connect middleware
   *
   */

  this.pipeline = function(root){
    console.log("Deprecated, please use MOUNT instead, this will be removed in a future version.");
    var publicPath = path.resolve(root)
    var terra = prerender.root(publicPath)

    return function(req, rsp, next){
      var normalizedPath  = helpers.normalizeUrl(req.url)
      var priorityList    = prerender.helpers.buildPriorityList(normalizedPath)
      var sourceFile      = prerender.helpers.findFirstFile(publicPath, priorityList)

      if(!sourceFile) return next()

      terra.render(sourceFile, function(error, body){
        if(error) return next(error)
        if(!body) return next() // 404

        var outputType = prerender.helpers.outputType(sourceFile)
        var mimeType   = helpers.mimeType(outputType)
        var charset    = mime.charsets.lookup(mimeType)

        rsp.statusCode = 200
        rsp.setHeader('Content-Type', mimeType + (charset ? '; charset=' + charset : ''))
        rsp.setHeader('Content-Length', Buffer.byteLength(body, charset));
        rsp.end(body)
      })

    }

  }

  this.pkg = pkg

  /**
   * Export middleware
   *
   * Make sure middleware is accessible
   * when using dssrv as a library
   *
   */
  this.middleware = middleware;

  /**
   * Compile
   *
   * Compiles Single DIREKTSPEED Server Application.
   *
   */

  this.compile = function(projectPath, outputPath, callback){

    /**
     * Both projectPath and outputPath are optional
     */

    if(!callback){
      callback   = outputPath
      outputPath = "www"
    }

    if(!outputPath){
      outputPath = "www"
    }


    /**
     * Setup all the paths and collect all the data
     */

    try{
      outputPath = path.resolve(projectPath, outputPath)
      var setup  = helpers.setup(projectPath, "production")
      var terra   = prerender.root(setup.publicPath, setup.config.globals)
    }catch(err){
      return callback(err)
    }


    /**
     * Protect the user (as much as possible) from compiling up the tree
     * resulting in the project deleting its own source code.
     */

    if(!helpers.willAllow(projectPath, outputPath)){
      return callback({
        type: "Invalid Output Path",
        message: "Output path cannot be greater then one level up from project path and must be in directory starting with `_` (underscore).",
        projectPath: projectPath,
        outputPath: outputPath
      })
    }


    /**
     * Compile and save file
     */

    var compileFile = function(file, done){
      process.nextTick(function () {
        terra.render(file, function(error, body){
          if(error){
            done(error)
          }else{
            if(body){
              var dest = path.resolve(outputPath, prerender.helpers.outputPath(file))
              fs.mkdirp(path.dirname(dest), function(err){
                fs.writeFile(dest, body, done)
              })
            }else{
              done()
            }
          }
        })
      })
    }


    /**
     * Copy File
     *
     * TODO: reference ignore extensions from a prerender helper.
     */
    var copyFile = function(file, done){
      var ext = path.extname(file)
      if(!prerender.helpers.shouldIgnore(file) && [".jade", ".ejs", ".md", ".styl", ".less", ".scss", ".sass", ".coffee", "pug"].indexOf(ext) === -1){
        var localPath = path.resolve(outputPath, file)
        fs.mkdirp(path.dirname(localPath), function(err){
          fs.copy(path.resolve(setup.publicPath, file), localPath, done)
        })
      }else{
        done()
      }
    }

    /**
     * Scan dir, Compile Less and Jade Pug, Copy the others
     */

    helpers.prime(outputPath, { ignore: projectPath }, function(err){
      if(err) console.log(err)

      helpers.ls(setup.publicPath, function(err, results){
        async.each(results, compileFile, function(err){
          if(err){
            callback(err)
          }else{
            async.each(results, copyFile, function(err){
              setup.config['dssrv_version'] = pkg.version
              // setup.config['dssrv_version'] = require('../package.json').version
              delete setup.config.globals
              callback(null, setup.config)
            })
          }
        })
      })
    })

  }


  this.helpers = helpers

  return this

}
