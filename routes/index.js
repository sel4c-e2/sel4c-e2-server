var express = require('express');
var connection = require('../db');
var router = express.Router();

router.get('/', function(req, res, next) {
  const query = 'SELECT * FROM countries';
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.error('Error querying the database:', error);
      return res.status(500).send('Internal Server Error');
    }
    res.json(results);
  });
});

module.exports = router;
