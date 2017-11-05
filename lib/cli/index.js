/*





*/
/*
 * @page index steal
 * @tag home
 *
 * ###DIREKTSPEED Server
 *
 * Our steal only has two classes:
 *
 * * server
 * * server
 */
// needs reading of $PWD for accepting .
/*
var nodePath      = require("path")
var program       = require("commander")
var fse           = require("fs-extra")
var downloadRepo  = require("download-github-repo")
var pkg           = require("../../package.json")

var prerender     = require("../")()


var output = function(msg){
  var v = pkg.version
  console.log("------------")
  console.log("DIREKTSPEED Server - Modul Prerender v" + v + " – DIREKTSPEED. 2015–2017")
  if(msg){
    console.log(msg)
    console.log("Press Ctl+C to stop the server")
  }
  console.log("------------")
}

program
  .version(pkg.version)

program
  .command("init [path]")
  .usage("initializes a new DIREKTSPEED Server - PreRender project in the current directory.\n  See available boilerplates at https://github.com/steal-boilerplates")
  .option("-b, --boilerplate <github-username/repo>", "use a github repo as a boilerplate", "steal-boilerplates/default")
  .description("Initialize a new DIREKTSPEED Server project in current directory")
  .action(function(path, program){
    var projectPath     = nodePath.resolve(process.cwd(), path || "")
    var boilerplatePath = nodePath.resolve(__dirname, "..", "lib", "default_boilerplate")
    var repo            = program.boilerplate

    // Assume `harp-boilerplates` github org if boilerplate doesn't contain a slash
    repo.match(/\//) || (repo = "steal-boilerplates/"+repo)

    var done = function() {
      console.log("Initialized project at", projectPath)
    }

    fse.mkdirp(projectPath, function(err){
      if(err) return err

      fse.readdir(projectPath, function(err, contents){

        if(err) return err

        if(contents.length !== 0){
          console.log("Sorry,", projectPath, "must be empty.")
          return
        }

        console.log("Downloading boilerplate: https://github.com/"+repo)

        //fse.writeFileSync("/Desktop/harp-test-output.txt", repo + "::" + projectPath)

        downloadRepo(repo, projectPath, function(err) {
          if (!err) return done()

          if (require('util').isError(err) && err['code'] === 'ENOTFOUND') {
            console.error("You're not connected to the Internet, so we'll use the default boilerplate.")
            fse.copy(boilerplatePath, projectPath, function(err){
              if (err) return err
              return done()
            })
          } else {
            return console.error("Template not found:", "https://github.com/"+repo)
          }

        })

      })
    })
  })

program
  .command("server [path]")
  .option("-i, --ip <ip>", "Specify IP to bind to")
  .option("-p, --port <port>", "Specify a port to listen on")
  .option("-c, --config <path>", "Specify a port to listen on")
  .usage("starts a DIREKTSPEED Server in current directory, or in the specified directory.")
  .description("Start a DIREKTSPEED Server in current directory")
  .action(function(path, program){
    var projectPath = nodePath.resolve(process.cwd(), path || "")
    var ip          = program.ip || '0.0.0.0'
    var port        = program.port || 9000
    var options = {
      ip: ip,
      port: port
    }

    prerender.server(projectPath, options, function(){
      var address = ''
      if(ip == '0.0.0.0' || ip == '127.0.0.1') {
        address = 'localhost'
      } else {
        address = ip
      }
      var hostUrl = "http://" + address + ":" + port + "/"
      output("Your server is listening at " + hostUrl)
    })
  })

program
  .command("multihost [path]")
  .option("-i, --ip <ip>", "Specify IP to bind to")
  .option("-p, --port <port>", "Specify a port to listen on")
  .option("-c, --config <path>", "Specify a port to listen on")
  .usage("starts a DIREKTSPEED Server to host a directory of DIREKTSPEED Server projects.")
  .description("Start a DIREKTSPEED Server to host a directory of DIREKTSPEED Server projects")
  .action(function(path, program){
    var projectPath = nodePath.resolve(process.cwd(), path || "")
    var port        = program.port || 9000
    var options = {
      port: port
    }

    prerender.multihost(projectPath, options, function(){
      if(port == "80"){
        var loc = "http://localhost"
      }else{
        var loc = "http://localhost:" + port
      }
      output("Your server is hosting multiple projects at " + loc)
    })
  })

program
  .command("compile [projectPath] [outputPath]")
  .option("-o, --output <path>", "Specify the output directory for compiled assets (relative to project path)")
  .usage("compile your project files to static assets (HTML, JS and CSS). \n  Use this command if you want to host your application without using the DIREKTSPEED Server web server.")
  .description("Compile project to static assets (HTML, JS and CSS)")
  .action(function(projectPath, outputPath, program){

    if(!program){
      program    = outputPath
      outputPath = null
    }

    projectPath = nodePath.resolve(process.cwd(), projectPath || "")

    /**
     * We deal with output path 3 different ways
     *
     *  1. second argument (relative to directory called in)
     *  2. `--output` argument (relative to project root)
     *  3. implicitly projectPath + "/www"
     *
     *

    if(outputPath){
      outputPath = nodePath.resolve(process.cwd(), (outputPath || program.output || ''))
    }else{
      outputPath = nodePath.resolve(projectPath, (program.output || "www"))
    }

    prerender.compile(projectPath, outputPath, function(errors, output){
      if(errors) {
        console.log(JSON.stringify(errors, null, 2))
        process.exit(1)
      }
    })
  })

program.on("--help", function(){
  console.log("  Use 'steal <command> --help' to get more information or visit http://server.dspeed.eu/ to learn more.")
  console.log('')
})




module.exports = program
*/
var fs = require('fs');
var path = require("path");
var program = require('commander');
var pkg = require('../../package.json');

program.version(pkg.version)
  .usage('[path] [options]')
  .description(pkg.description)
  .option('-d, --develop', 'Enable development mode (live-reload)')
  .option('-p, --port <port>', 'The server port')
  .option('-r, --proxy <url>', 'A URL to an API that should be proxied')
  .option('-t, --proxy-to <path>', 'The path to proxy to (default: /api)')
  .option('--proxy-no-cert-check', 'Turn off SSL certificate verification')
  .option('-l, --no-live-reload', 'Turn off live-reload')
  .option('--timeout <ms>', 'The timeout in milliseconds', parseInt)
  .option('--debug', 'Turn on debugging in cases of timeouts')
  .option('-s, --static', 'Only serve static files, no server-side rendering')
  .option('-h, --html5shiv', 'Include html5shiv in the HTML')
  .option('--live-reload-port <port>', 'Port to use for live-reload')
  .option('--auth-cookie <name>', 'Cookie name for supporting SSR with JWT token auth.')
  .option('--auth-domains <name>', 'Domain names where the JWT tokens will be sent. Required if auth-cookie is enabled.')
  .option('--steal-tools-path <path>', 'Location of your steal-tools')
  .option('--error-page <filename>', 'Send a given file on 404 errors to enable HTML5 pushstate (only with --static)')
  .option('--key <path>', 'Private key, for https')
  .option('--cert <path>', 'Fullchain file or cert file, for https')
  .option('--strategy <name>', 'The rendering strategy (default: safe)');

exports.program = program;
exports.run = function(){
	var makeServer = require("done-serv");
	var exec = require("child_process").exec;
	var startServer = function(app){
		var servers = [];
		// If using TLS, set up an HTTP2 server with automatic
		// http->https forwarding.
		if(options.key && options.cert) {
			var net = require("net");
			var spdy = require("donejs-spdy");
			port = Number(port);
			var httpPort = port + 1;
			var httpsPort = httpPort + 1;
			var server = spdy.createServer({
				key: fs.readFileSync(options.key),
				cert: fs.readFileSync(options.cert),
				spdy: {
					protocols: ['h2', 'http/1.1']
				}
			}, app);
			server.listen(httpsPort);
			servers.push(server);

			server = require("http").createServer(function(req, res){
				var host = req.headers.host;
				res.writeHead(301, { "Location": "https://" + host + req.url });
				res.end();
			});
			server.listen(httpPort);

			// This is a TCP server that forwards to the correct port for
			// http or https
			net.createServer(function(conn){
				conn.once("data", function (buf) {
			        // A TLS handshake record starts with byte 22.
			        var address = (buf[0] === 22) ? httpsPort : httpPort;
			        var proxy = net.createConnection(address, function (){
			            proxy.write(buf);
			            conn.pipe(proxy).pipe(conn);
			        });
			    });
			}).listen(port);

			servers.push(server);
		} else {
			servers.push(app.listen(port));
		}
		return servers;
	};

	var options = {
	  path: program.args[0] ? path.join(process.cwd(), program.args[0]) : process.cwd(),
	  liveReload: program.liveReload,
	  static: program.static,
	  debug: program.debug,
	  timeout: program.timeout,
	  errorPage: program.errorPage,
	  key: program.key,
	  cert: program.cert,
	  strategy: program.strategy
	};

	if(program.proxy) {
	  options.proxy = program.proxy;
	  options.proxyTo = program.proxyTo;
	  options.proxyCertCheck = program.proxyCertCheck;
	}

	if (program.authCookie || program.authDomains) {
		options.auth = {
			cookie: program.authCookie,
			domains: program.authDomains && program.authDomains.split(',')
		};
	}

	// Spawn a child process in development mode
	if(program.develop) {
		var stealToolsPath = program.stealToolsPath ||
			path.join("node_modules", ".bin", "steal-tools");
		if(!fs.existsSync(stealToolsPath)) {
			console.error('live-reload not available: ' +
				'No local steal-tools binary found. ' +
				'Run `npm install steal-tools --save-dev`.');
		} else {
			var cmd = stealToolsPath + ' live-reload';
			if(program.liveReloadPort) {
				cmd += ' --live-reload-port ' + program.liveReloadPort;
			}

			var child = exec(cmd, {
				cwd: process.cwd()
			});

			process.env.NODE_ENV = "development";

			child.stdout.pipe(process.stdout);
			child.stderr.pipe(process.stderr);

			var killOnExit = require('infanticide');
			killOnExit(child);
		}
	}

	var app = makeServer(options);
	var port = program.port || process.env.PORT || 3030;
	var servers = startServer(app);

	servers[0].on('error', function(e) {
		if(e.code === 'EADDRINUSE') {
			console.error('ERROR: Can not start done-serve on port ' + port +
				'.\nAnother application is already using it.');
		} else {
			console.error(e);
			console.error(e.stack);
		}
	});

	servers[0].on('listening', function() {
		var address = servers[0].address();
		var url = 'http://' + (address.address === '::' ?
				'localhost' : address.address) + ':' + port;

		console.log('done-serve starting on ' + url);
	});

	return servers[0];
};
