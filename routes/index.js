const express = require("express"),
  router = express.Router(),
  path = require("path"),
  { auth } = require("../middleware/auth"),
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

router.get("/profile", auth, (req, res) => {
  db.profile(req.session.userId, res);
});

router.post("/insertlist", auth, (req, res) => {
  if (!req.body) req.status(400).json({message: "unable to insert new to do list, body is empty"});
  req.body.userId = req.session.userId;
  db.insertList(req.body, res);  
});

router.post("/inserttask", auth, (req, res) => {
  db.insertTask(req.session.userId, req.body, res);
});

router.get("/signout", (req, res) => {
  req.session.userId = undefined;
  res.status(200).json({});
})

module.exports = router;
