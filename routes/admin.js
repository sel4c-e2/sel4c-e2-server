var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('admin');
});

router.get('/login', function(req, res, next) {
    const json = {
        "Hoola": "dieff"
    }
    res.json(json);
});

module.exports = router;
