var
  mid = require('./')

  function routerMount(mountPoint, root){

    if(!root){
      root = mountPoint
      mountPoint = null
    }else{
      var rx = new RegExp("^" + mountPoint)
    }

    return [
      mid.headerProcessing,
      mid.replaceDevHosts,
      function(req, res, next){
        if(rx){
          if(!req.url.match(rx)) return next()
          var originalUrl = req.url
          req.url         = req.url.replace(rx, "/")
        }
        req.projectPath = root
        next()
      },
      mid.setup,
      mid.staticExpress,
      mid.static,
      mid.poly,
      mid.process,
      function(){
        if(originalUrl) req.url = originalUrl
        next()
      }
    ]

  }

module.exports = routerMount;
