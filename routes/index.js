var express = require('express');
var { connection } = require('../db');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("--GET: /--");
  return res.sendStatus(200);
});

module.exports = router;
