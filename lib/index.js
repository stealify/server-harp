var path = require('path');

var compression = require('compression');
var express = require('express');
var debug = require('debug')('steal-server');
var middleware = require('done-ssr-middleware');
var fs = require('fs');

function notFoundHandler(req, res, next) {
	res.status(404);
	next(new Error('File not found'));
}

module.exports = function(options) {
  let projectBaseDir = path.join(process.cwd(),options.path) 
  let projectConfig = require(path.join(projectBaseDir,'package.json'))
  // frontend backend detection
  if (projectConfig.steal) {
  	return makeServer(options)
  }
  let projectInstance = require(projectConfig.main)
  return projectInstance
}

function makeServer(options) {
	var app = express()
		.use(compression());

	debug('Initializing done-serve application', options);

	if (options.configure) {
		options.configure(app);
	}

	if (options.proxy) {
	  require('done-serve/lib/proxy')(app, options);
	}

	app.use(express.static(path.join(options.path)));

	if(!options.static) {
		var steal = {
			config: path.join(options.path, 'package.json') + '!npm',
			liveReload: options.liveReload
		};

		if(options.main) {
			steal.main = options.main;
		}

		var mw = middleware(steal, options);

		debug('Registering done-ssr-middleware');
		app.use(mw);
	} else {
		// Unobtrusively handle pushstate routing when SSR is turned off.
		app.get('*', function (req, res, next) {
			var urlParts = path.parse(req.url);
			var isPushstateRoute = !urlParts.ext || urlParts.name.includes('?');
			if (isPushstateRoute) {
				var env = process.env.NODE_ENV || 'development';
				var htmlPath = path.join(options.path, './' + env + '.html');
				if (!fs.existsSync(htmlPath)) {
					htmlPath = path.join(options.path, './production.html');
				}
				if (fs.existsSync(htmlPath)) {
					return res.sendFile(htmlPath);
				}
			}
			return next();
		});
		app.use(notFoundHandler);

		if(options.errorPage) {
			var filename = path.join(process.cwd(), options.errorPage);

			debug('Registering pushState file', filename);

			app.use(function(err, req, res, next) {
				debug('Pushstate error handler', filename);
				res.status(200);
				res.sendFile(filename);
			});
		}
	}

	return app;
};
