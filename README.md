# steal-server 

## Goals
Helps you to serve NodeJS Projects based on a simple reuseable config
Allows you to serve many express or koa projects on diffrent urls
Gives you a Modular NodeJS Server Framework.
it can easy get used with the stealify/config-* modules to configure your
existing Infrastructure or to even deploy that Infrastructure for you
Steal Server can also act as a Process Manager or InitD for NodeOS or other Unikernels
via stealify/config-init-*

## Isomorphic Code
- it matters for Project Maintainability
- Faster Testing in Development
- Faster Deployment to Production
Learn More about Server Templating in your ssr.js via steal!
StealJS is a Core Dependency and name giver of this server
its main Maintainer is a genius called Matthew Philipps and the Bitovi Open Source Team.
How does StealJS Make Your Code Isomorphic? it allows you to bundle including any asset for Production Frontend and Backend
as also translate code for Frontend and Backend so see it as the Unifed Bundler Import Method that you ever wanted to have.

## Why Should i Use this?
The Cloud and IaaS Prices and Services as also other Capacity and Investment Related Variables are fast Changing you need to be able to protect your Investment to run efficent on any Infrastructure no Matter how it is provided or who provides it.
You will ask is that needed for Normal People like me? YES!
 - you will want to change your Hosting Provider often even if you rent WebHosting Packages and Not IaaS
 - you will want to use stealify-fs to Host Your Data Anywhere and keep it automatic backuped
 - you will want auto renew SSL Certificates via any Provider like Letsencrypt or Your own
 - Short You will want to reduce admin and maintance and forget about that once configured and change it fast if you need so.
You will ask i am a Developer i am DevOp do i need this? YES!
 - You will find no more general way to configure all this software that your Configuring always even if your using docker or other stuff you find your self always repeating the same stuff over and over again you will want to stop that!

## Supported Init Integrations
- stealify/config-init-systemd
- stealify/config-init-s6
- stealify/config-init-pm2
- stealify/config-init-cloudinit **Upcoming**

## Supported Deployment Integrations
- stealify/fs => Confugreable Multi Endpoint FileSystem
  - Stealify FS it Self Allows you to build a Hybrid Multi Cloud Storage Solution
- stealify/dns
  - It Allows you to build a Cloudflare Like CDN if bundled with Stealify FS
  - It Allows you to Integrate Diffrent CDN and Storage Providers Into a Single Endpoint
  - Integrate Routing and Security Stuff.
- stealify/config-iaas-openstack
- stealify/config-iaas-vmware
- stealify/config-iaas-amazon
- stealify/config-iaas-virtualbox
- stealify/config-iaas-kubernetes **Upcoming**
- stealify/config-iaas-firebase
- stealify/config-iaas-docker
- stealify/config-iaas-mesos
- stealify/config-iaas-aurora
- stealify/config-iaas-marathon
- stealify/config-iaas-vagrant
- stealify/config-iaas-runc

## Guides:
- DoneJS + SSR + PHP Or NodeJS Api (Local Development)
- DoneJS Production build on Nginx + SSR + PHP-FPM (Additional Caching)
- Use as single domain Static Web Server
- Use as multi domain Static Only Web Server
- Use as Mixed Multi domain Static/Dynamic Webserver
- Use as Static web Server with loadbalancing
- Use as GIT protocol and http server.
- Use as Loadbalancer - TCP/UDP
- Use as TCP Port sharing server
- Use as Rule Based Firewall
- Use as manager for iptables, git,docker, networking, users, folder permissions, task runner, cron, plugins supported
- Use as software deploytool.


## Use

Push a Application to localhost:3030
```bash
steal -p 3030 --develop
```

Using it best via install global then require inside your app if needed
use servers === array and run app



### Planned Features
- Show Running Servers Status
- Show Running Servers Registered Routers Tree
- Easy Modify Routes and Servers


### Options
- mount "aMountPath"
- hostname "aextra hostname to listen on"
- host "aIp"
- ngrock


## Features
- Flexible configuration via ssr.js / server.js where ssr gets rendered via steal-ssr is voted higher then server that gets executed via stealify/pm steal-pm
- Able to serve Unlimited NodeJS Projects via a Single Instance and return the right Project via configureable algorythms.
- Big Ecosystem!
- easy React / Preact SSR via StealJS
- easy WebComponents SSR via StealJS
- easy CanJS / DoneJS via StealJS
- easy NodeJS Server managment via Stealify/config-* EcoSystem and custom NodeJS/EMCA WA Modules loaded on Demand via StealJS


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
steal-server stealify/server is a Server and Application Delivery Controller
  - Supplys Unifed Server Configuration via Modules
  - Importent Modules are DNS, FS, SSR, PM
steal-tools stealify/tools is a Cross Plattform Production Application and Any Asset Bundler as also task runner
  - Dropin Replacment for grunt, and tools like that
### stealify/prerender-middleware
serves doT Jade, Markdown, EJS, Less, Stylus, Sass, and CoffeeScript **as** HTML, CSS, and JavaScript without any configuration. It supports the beloved layout/partial paradigm and it has flexible metadata and global objects for traversing the file system and injecting custom data into templates. Optionally, steal-server can also compile your project down to static assets for hosting behind any valid HTTP server via StealJS.

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

## License
Created by Frank Lemanschik and the Opensource Community Since 1990–2019 [DIREKTSPEED](https://dspeed.eu)
