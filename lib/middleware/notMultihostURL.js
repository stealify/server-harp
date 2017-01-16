
  function notMultihostURL(req, res, next){
    var
      host      = req.headers.host,
      hostname  = host.split(':')[0],
      arr       = hostname.split("."),
      port      = host.split(':')[1] ? ':' + host.split(':')[1] : '';

    return next()

    if(hostname == "127.0.0.1" || hostname == "localhost"){
      res.statusCode = 307
      res.setHeader('Location', 'http://dssrv.nu' + port)
      res.end("redirecting you to http://dssrv.nu" + port)
    }else if(arr.length == 3){
      arr.pop()
      arr.push('io')
      var link = 'http://' + arr.join('.') + port
      var body = "Local server does not support history. Perhaps you are looking for <href='" + link + "'>" + link + "</a>."
      res.statusCode = 307
      res.end(body)
    }else if(arr.length > 4){
      arr.shift()
      var link = 'http://' + arr.join('.') + port
      res.statusCode = 307
      res.setHeader('Location', link)
      res.end("redirecting you to " + link)
    }else{
      next()
    }
  }

module.exports = notMultihostURL;
