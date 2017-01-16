var
  serveSites_handler = function serveSites_handler(req, res, next) {
  // var options = options || [ '../sites', false]
  // var single = options[1]
  // var folderpath = options[0]
  if (single) res.staticPath = folderpath
    else res.staticPath = folderpath + '/' + req.headers.host

  debug(res.staticPath,req.originalUrl)

  // worker.scServer.emit('rand', 555)

  try {
      // Query the entry
      stats = fs.lstatSync(res.staticPath + req.originalUrl);

      // Is it a directory?
      if (stats.isFile()) {
      // Apply Security Filters
      /*
      if (req.originalUrl.indexOf('.php') > -1 ) return res.end('404')
      if (req.originalUrl.indexOf('_views') > -1 ) return res.end('404')
      if (req.originalUrl.indexOf('_') == 1 ) return res.end('404')
      if (req.originalUrl.indexOf('.') == 1 ) return res.end('404')
      if (req.originalUrl.indexOf('.pug') > -1 ) return res.end('404')
      if (req.originalUrl.indexOf('.jade') > -1 ) return res.end('404')
      if (req.originalUrl.indexOf('.ejs') > -1 ) return res.end('404')
      */
      var static = express.static(res.staticPath)



      return static(req, res, next)
      } else next()
  }
  catch (e) {
      // Call next middleware??
      next()
  }


}
module.exports = serveSites_handler;
