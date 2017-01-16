var
  debug = require('debug')('PRERENDER:REPLACE_DEV_HOST:');

  function replaceDevHosts(req, res, next) {
      // replace dev test hosts
      if (req.headers.Host) {
        req.headers.host = req.headers.Host
        delete req.headers.Host
      }

      req.originalHost = req.headers.host
      req.headers.host = req.headers.host.toLowerCase()
      req.headers.host = req.headers.host.replace('.new','')
      req.headers.host = req.headers.host.replace('.local','')
      req.headers.host = req.headers.host.replace('proxy.','').split(':')[0]
      debug(req.originalHost, req.headers.host);
      next()
    }
module.exports = replaceDevHosts
