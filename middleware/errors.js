//const {viewsData} = require('../util/constructors');

module.exports.notFound = function(req, res, next) {
    var err = new Error('Requested content does not exist.');
    err.status = 404;
    next(err);
};

module.exports.catchEmAll = (err, req, res, next) => {
//    const data = new viewsData(req);

    res.status(err.status || 500); // 500 = server error

    if (!err.status || err.status >= 500) {
        // log error to console before replacing it with generic message for user
        console.log(err.message);
        err.message = "Internal server error.";
    }

    res.json({
      message: err.message,
      status: (err.status || 500)
      }
    ); 
};

module.exports.errHandler = function(cb){
    return async (req, res, next)=> {
        try {
          await cb(req, res, next);
        } catch(err){
          next(err);
        }
    };
};
