var checkPHP = function checkPHP(req,res,next) {

    res.header("X-powered-by", "DIREKTSPEED Server - Blood, sweat, and tears")
    res.header("Vary", "Accept-Encoding")

  if (req.originalUrl.indexOf('.php') > -1 ) {
    // req.target = ''
    require('../proxy')(req,res,next)
  } else next()

}

module.exports = checkPHP;
