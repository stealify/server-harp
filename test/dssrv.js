var nixt = require('nixt')
var path = require('path')
var fs = require('fs-extra')
var should = require('should')
var steal = require('../')()
var exec = require("child_process").exec

describe("steal init", function() {

  var outputPath  = path.join(__dirname, "out/steal")

  beforeEach(function(done){
    fs.remove(outputPath, function(err){
      fs.mkdirp(outputPath, done)
    })
  })

  it("downloads the default boilerplate if it's not set", function(done) {
    this.timeout(10000);
    nixt()
      .run('node ./bin/steal init ./test/out/steal') // Tests don't work when this has a platform-specific path passed in, but it does work
      // .run('node .' + path.sep + 'bin' + path.sep + 'steal init ' + outputPath)
      // .stdout(/Downloading.*steal-boilerplates\/default/)
      // .stdout(/Initialized project at \test/out\/steal/)
      .end(function () {
        fs.existsSync(path.join(outputPath, '404.jade')).should.not.be.false
        fs.existsSync(path.join(outputPath, '_layout.jade')).should.not.be.false
        fs.existsSync(path.join(outputPath, 'index.jade')).should.not.be.false
        fs.existsSync(path.join(outputPath, 'main.less')).should.not.be.false
        done()
      })
  })

  it("defaults to the steal-boilerplates github org when given a shorthand pattern", function(done) {
    this.timeout(10000);
    nixt()
      .run('node ./bin/steal init ./test/out/steal -b hb-start')
      // .stdout(/Downloading.*steal-boilerplates\/hb-start/)
      .end(function () {
        fs.existsSync(path.join(outputPath, 'public', 'index.jade')).should.not.be.false
        fs.existsSync(path.join(outputPath, 'README.md')).should.not.be.false
        done()
      })
  })

  it("honors -b option when given a user/repo pattern", function(done) {
    this.timeout(10000);
    nixt()
      .run('node ./bin/steal init ./test/out/steal -b zeke/steal-sample')
      // .stdout(/Downloading.*zeke\/steal-sample/)
      .end(function () {
        fs.existsSync(path.join(outputPath, 'README.md')).should.not.be.false
        fs.existsSync(path.join(outputPath, 'index.jade')).should.not.be.false
        done()
      })
  })

  it("doesn't overwrite an existing directory", function(done) {
    nixt()
      .run('node ./bin/steal init ./test/out/steal')
      .end(function() {
        nixt()
          .run('node ./bin/steal steal init ./test/out/steal -b hb-default-sass')
          .end(function() {
            should.not.exist(fs.exists(path.join(outputPath, 'main.sass')))
            done()
          })
      })
  })

  after(function(done){
    exec("rm -rf " + outputPath, function() {
      done();
    })
  })

})
