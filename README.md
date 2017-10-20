# steal-server

## New Mission ! This is now the WebComponent Development Server
Enabling you to pre process assets even importet once from npm to
create your webcomponents faster then ever or even whole projects
it does support anything you need to code Web Tech Driven Applications

- supports diffrent bundlers.
- supports diffrent preprocessors.
- gives tool chain to work with any code



![build](https://travis-ci.org/steal-server/server.svg?branch=master)





> zero-configuration web server with built in:
 - pre-processing
 - SSR
 - NodeJS Project
> can be deployed with DIREKTSPEED Server in production fully horizontal scale able even on a single server.

### What is DIREKTSPEED Server

DIREKTSPEED Server is a Server and Application Delivery Controler that also serves doT Jade, Markdown, EJS, Less, Stylus, Sass, and CoffeeScript **as** HTML, CSS, and JavaScript without any configuration. It supports the beloved layout/partial paradigm and it has flexible metadata and global objects for traversing the file system and injecting custom data into templates. Optionally, steal-server can also compile your project down to static assets for hosting behind any valid HTTP server.

### Why?
Development got Hard this Days if you want to stay up with current Technology. I wanted a Way to Develop Faster and Better then Ever Befor thats why i created this it enables us to Setup fast a Server with all needed Things and Focus more on the Application code.

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
- Many more like image/audio/video preprocessing.
- Easy Run NodeJS Projects and Manage the Process.
- Extensiv Local and Remote Debuging and Logging
- Extensible via Modules (Express like HTTP Applications)

### Supported Pre-Processors by steal-prerender

|                 | Language Superset                                                 | Whitespace Sensitive
| --------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------
| **HTML**        | [EJS](http://embeddedjs.com/)                                     | [Jade](http://jade-lang.com/), [pug](http://pug-lang.com/), [Markdown](http://daringfireball.net/projects/markdown/), [doT](http://http://olado.github.io/doT/index.htm)
| **CSS**         | [LESS](http://lesscss.org/), [Sass (SCSS)](http://sass-lang.com/) | [Stylus](http://learnboost.github.io/stylus/), [Sass](http://sass-lang.com/)
| **JavaScript**  | (TBD)                                                             | [CoffeeScript](http://coffeescript.org/), [EJS](http://embeddedjs.com/)

### Resources

- **Server Documentation** - [harpjs.com/docs/](http://steal-srv-prerenderjs.com/docs/)
- **Platform Documentation** - [harp.io/docs](https://steal-srv-prerender.io/docs)
- **Source Code** - [github.com/steal/srv-prerender](https://github.com/steal/srv-prerender)

---

### Installation

    sudo npm install -g steal-server

### Quick Start

Creating a new steal-prerender application is a breeze...

    prerender add myproj
    prerender server myproj

Your DIREKTSPEED Server application is now running at [http://localhost:9000]()

---

## Documentation

Steal Server 
- is a library 
- Offering command line utility.

### CLI Usage

    Usage: prerender [command] [options]

    Commands:

      init [path]                 initalize new steal-srv-prerender application (defaults to current directory)
      server [path] [options]     start steal-srv-prerender server
      compile [path] [options]    compile project to static assets
      multihost [path] [options]  start steal-srv-prerender server to host directory of steal-srv-prerender apps

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
var stealSrvPrerender = require("steal-srv-prerender")
stealSrvPrerender.server(projectPath [,args] [,callback])
```

**Or** compile steal-srv-prerender application

```js
var stealSrvPrerender = require("steal-srv-prerender")
stealSrvPrerender.compile(projectPath [,outputPath] [, callback])
```

**Or** use as Connect/ExpressJS middleware

```js
var express = require("express");
var stealSrvPrerender = require("steal-srv-prerender");
var app = express();
```

```js
// Express 3
app.configure(function(){
  app.use(express.static(__dirname + "/public"));
  app.use(stealSrvPrerender.mount(__dirname + "/public"));
});
```

```js
// Express 4

app.use(express.static(__dirname + "/public"));
app.use(stealSrvPrerender.mount(__dirname + "/public"));

```

# TODO:
Make it extend able via npm install
write a module loader for that
steal-prerender-donejs make use of steal/use




## License

Copyright © 2017–2018 [DIREKTSPEED](http://dspeed.eu). All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
