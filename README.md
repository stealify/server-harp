# steal-server formarly DIREKTSPEED Server 




> zero-configuration web server with built in:
 - pre-processing
 - Ssr
 - NodeJS Project
 
> can be used with DIREKTSPEED Server as Module

### What is DIREKTSPEED Server - Module PreRender?

DIREKTSPEED Server is a static web server that also serves doT Jade, Markdown, EJS, Less, Stylus, Sass, and CoffeeScript **as** HTML, CSS, and JavaScript without any configuration. It supports the beloved layout/partial paradigm and it has flexible metadata and global objects for traversing the file system and injecting custom data into templates. Optionally, DIREKTSPEED Server - Module PreRender can also compile your project down to static assets for hosting behind any valid HTTP server.

### Why?

Pre-compilers are becoming extremely powerful and shipping front-ends as static assets has many upsides. It's simple, it's easy to maintain, it's low risk, easy to scale, and requires low cognitive overhead. I wanted a lightweight web server that was powerful enough for me to abandon web frameworks for dead simple front-end publishing.

### Features

- easy installation, easy to use
- fast and lightweight
- robust (clean urls, intelligent path redirects)
- built in pre-processing
- first-class layout and partial support
- built in LRU caching in production mode
- can export assets to HTML/CSS/JS
- does not require a build steps or grunt task
- fun to use

### Supported Pre-Processors

|                 | Language Superset                                                 | Whitespace Sensitive
| --------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------
| **HTML**        | [EJS](http://embeddedjs.com/)                                     | [Jade](http://jade-lang.com/), [pug](http://pug-lang.com/), [Markdown](http://daringfireball.net/projects/markdown/), [doT](http://http://olado.github.io/doT/index.htm) 
| **CSS**         | [LESS](http://lesscss.org/), [Sass (SCSS)](http://sass-lang.com/) | [Stylus](http://learnboost.github.io/stylus/), [Sass](http://sass-lang.com/)
| **JavaScript**  | (TBD)                                                             | [CoffeeScript](http://coffeescript.org/), [EJS](http://embeddedjs.com/)

### Resources

- **Server Documentation** - [harpjs.com/docs/](http://dssrv-srv-prerenderjs.com/docs/)
- **Platform Documentation** - [harp.io/docs](https://dssrv-srv-prerender.io/docs)
- **Source Code** - [github.com/dssrv/srv-prerender](https://github.com/dssrv/srv-prerender)


Authored and maintained by [@sintaxi](http://twitter.com/sintaxi). Made for the [@DIREKTSPEED ServerPlatform](http://twitter.com/DIREKTSPEED ServerPlatform).

---

### Installation

    sudo npm install -g dssrv-srv-prerender

### Quick Start

Creating a new dssrv-srv-prerender application is a breeze...

    prerender init myproj
    prerender server myproj

Your DIREKTSPEED Server application is now running at [http://localhost:9000]()

---

## Documentation

DIREKTSPEED Server - Module PreRender can be used as a library or as a command line utility.

### CLI Usage

    Usage: prerender [command] [options]

    Commands:

      init [path]                 initalize new dssrv-srv-prerender application (defaults to current directory)
      server [path] [options]     start dssrv-srv-prerender server
      compile [path] [options]    compile project to static assets
      multihost [path] [options]  start dssrv-srv-prerender server to host directory of dssrv-srv-prerender apps

    Options:

      -h, --help     output usage information
      -V, --version  output the version number

Start the server in root of your application by running...

    prerender server

You may optionally supply a port to listen on...

    prerender server --port 8002

Compile an application from the root of your application by running...

    prerender compile

You may optionally pass in a path to where you want the compiled assets to go...

    prerender compile --output /path/to/cordova/project/www

### Lib Usage

You may also use prerender as a node library for compiling or running as a server.

Serve up a prerender application...

```js
var dssrvSrvPrerender = require("dssrv-srv-prerender")
dssrvSrvPrerender.server(projectPath [,args] [,callback])
```

**Or** compile dssrv-srv-prerender application

```js
var dssrvSrvPrerender = require("dssrv-srv-prerender")
dssrvSrvPrerender.compile(projectPath [,outputPath] [, callback])
```

**Or** use as Connect/ExpressJS middleware

```js
var express = require("express");
var dssrvSrvPrerender = require("dssrv-srv-prerender");
var app = express();
```

```js 
// Express 3
app.configure(function(){ 
  app.use(express.static(__dirname + "/public"));
  app.use(dssrvSrvPrerender.mount(__dirname + "/public"));
});
```

```js 
// Express 4

app.use(express.static(__dirname + "/public"));
app.use(dssrvSrvPrerender.mount(__dirname + "/public"));

```

# TODO: 
Make it extend able via npm install 
write a module loader for that
dssrv-prerender-donejs make use of dssrv/use
dssrv-prerender could offer a middelware to link all modules from
the path


function npmls(cb) {
  require('child_process').exec('npm ls --depth 0 --json', function(err, stdout, stderr) {
    if (err) return cb(err)
    cb(null, JSON.parse(stdout));
  });
}
npmls(console.log);


npm.commands.ls(args, [silent,] callback)
console.log(Object.keys(require('./package.json').dependencies));

we will probally use rootRequire try catched

---- https://gist.github.com/branneman/8048520#comment-1412502
2. The Global

In your app.js:

global.__base = __dirname + '/';
In your very/far/away/module.js:

var Article = require(__base + 'app/models/article');


---
7. The Wrapper

Courtesy of @a-ignatov-parc. Another simple solution which increases obviousness, simply wrap the require() function with one relative to the path of the application's entry point file.

Place this code in your app.js, again before any require() calls:

global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}
You can then require modules like this:

var Article = rootRequire('app/models/article');



------

Install some module:

npm install app-module-path --save
In your app.js, before any require() calls:

require('app-module-path').addPath(__dirname + '/app');


or Use NODE_PATH=. or project root for require

hacky method

process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

I've been using symlinks with the following structure:
```
/node_modules
/package.json
/src
  /node_modules
    /client -> ../client
    /server -> ../server
    /shared -> ../shared
  /client
    /apps
      /main
        /test
          main.spec.js
        index.js
    /modules
      /foo
        /test
          foo.spec.js
        index.js
  /server
    /apps
    /modules
  /shared
```
it also solves the problem of not know where the modules come from because all app modules have client/server/shared prefixes in require paths





## License

Copyright © 2016–2017 [DIREKTSPEED](http://dspeed.eu). All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
