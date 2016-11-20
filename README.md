# server
The Core Server and Cli

```
myproject/
  |- package.json
  |- index.js
  |+ src/
    |+ api/
    |+ lib/
  |+ dist/
    |+ api/
    |+ lib/
  |+ public/
    |- package.json
    |- steal.lock
    |+ dist/
      |- 404.html
      |- index.html
      |- main.js
      |- main.css
    |+ src/
      |- _layout.pug
      |- 404.pug
      |- index.stache
      |- main.coffee
      |- main.less
```


- It will Identify The Project Folder and set the type to DoneJS if nothing other is defined in public/package.json
- It will run index.js from myproject folder that should export a express or connect app or anything that can handle req
- It will serve on urls relativ to / public/src and translate .* extensions to its production counter parts.
- It will support ngrok to expose a server via tunnel to the Internet for Production and Dev Environments
- It is Easy Run Able as Docker Container just put your Project in and Develop.
- It can Also serve Single DoneJS Components example myproject/index.component gets index.html index.css index.js
- It should be pointed out that its not serving .dotfiles normaly and is designed to ignore folders and files with _ or a other prefix for things that only get used on backend for example _partials/layout.stache wich would get automaticly applyed to all other files like index.stache

