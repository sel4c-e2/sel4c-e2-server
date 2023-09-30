var express = require('express');
var router = express.Router();

router.get('/:email', function(req, res, next) {
  const { email } = req.params;
  console.log(email);
  res.sendStatus(202);
});

router.post('/login', function(req, res, next) {
  const { email, pwd } = res.body;
  res.sendStatus(200);
});

module.exports = router;
