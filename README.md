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

