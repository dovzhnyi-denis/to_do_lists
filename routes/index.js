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

router.get("/signout", (req, res) => {
  req.session.userId = undefined;
  res.status(200).json({});
});

router.get("/profile", auth, (req, res) => {
  db.profile(req.session.userId, res);
});

router.post("/insertlist", auth, (req, res) => { 
  db.insertList(req.session.userId, req.body, res);  
});

router.post("/updlist", auth, (req, res) => {
  db.updList(req.session.userId, req.body, res);
});

router.post("/removelist", auth, (req, res) => {
  db.removeList(req.session.userId, req.body, res);
});

router.post("/inserttask", auth, (req, res) => {
  db.insertTask(req.session.userId, req.body, res);
});

router.post("/gettasks", auth, (req, res) => {
  db.getTasks(req.session.userId, req.body.listId, res);
});

router.post("/updtask", auth, (req, res) => {
  db.updTask(req.session.userId, req.body, res);
});

router.post("/removetask", auth, (req, res) => {
  db.removeTask(req.session.userId, req.body, res);
});

module.exports = router;
