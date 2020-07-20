const express = require('express');
const router = express.Router();
const {errHandler} = require('../midware/errors');
const path = require('path');

router.get('/stuff', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

module.exports = router;
