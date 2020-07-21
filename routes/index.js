const express = require("express"),
  router = express.Router(),
  path = require("path"),
  { db } = require("../db"),
  { errHandler } = require("../middleware/errors");

router.get("/", (req, res) => {
  res.sendFile(path.join(
    path.normalize(`${__dirname}/../public/index.html`)
  ));
});

router.post("/signup", (req, res) => {
  db.signUp(req.body, res, req.session);
});

router.post("/signin", (req, res) => { 
  db.signIn(req.body, res, req.session);
});

router.get("/profile", (req, res) => {
  db.signedIn(req.session.userId, res);
});

router.get("/signout", (req, res) => {
  req.session.userId = undefined;
  console.log("signout");
  res.status(200).json({});
})

module.exports = router;
