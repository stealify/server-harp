var
  debug = require('debug')('vhostrouter:'+process.pid);

  function appByVhost(req, res, next){

        if (!req.headers.host) return next();
        var host = req.headers.host.split(':')[0]; // I prefer to trim ports aways

        // Implament Routing on URL

        debug('VHOSTS EXEC: ' + JSON.stringify(req.headers))
        // debug('VHOSTS EXEC: ' + JSON.stringify(req.app.locals.hostDictionary))
        // console.log(req.app.locals.hostDictionary)
        if (req.trustProxy && req.headers["x-forwarded-host"]) {
          host = req.headers["x-forwarded-host"].split(':')[0];
        }

        if (req.originalUrl.indexOf('/apps') > -1) {
          var server = req.app.locals.hostDictionary['apps.domain.tld']
        }

        if (!server) {
         var server = req.app.locals.hostDictionary[host];
        }
        if (!server){
          server = req.app.locals.hostDictionary['*' + host.substr(host.indexOf('.'))];
        }

        if (!server){
          server = req.app.locals.hostDictionary['default'];
        }

        // console.log(JSON.stringify(Vhost.hostDictionary))
        // console.log()

        if (!server) return next();

        if ('function' == typeof server) return server(req, res, next);
        server.emit('request', req, res);
        // next()
    }
module.exports = appByVhost;
