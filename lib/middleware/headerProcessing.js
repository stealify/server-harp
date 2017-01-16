var
  headerProcessing = function(req, res, next) {

      res.header("X-powered-by", "DIREKTSPEED Server - Blood, sweat, and tears")

          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
          res.header('Access-Control-Allow-Headers', 'Origin, Accept, Authorization, Content-Type, X-Requested-With');


      if (req.headers['X-debug']) {
        // d
      } else if (req.headers['X-target']) {
        // d
      } else next()
    }
module.exports = headerProcessing;
