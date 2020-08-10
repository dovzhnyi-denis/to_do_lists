exports.auth = (req, res, next) => {
  if (!req.session.userId)
    res.status(401).json({message: "unauthorized"});
  else {
    next();
  }
}
