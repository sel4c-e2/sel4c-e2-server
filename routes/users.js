var express = require('express');
var connection = require('../db');
var router = express.Router();
var jwt = require('jsonwebtoken');

const users = [ //con base de datos
  {username:'fernandogar', password:'holahola'},
]

router.post('/prueba', (req, res) => {
  const username = req.body.username
  const password = req.body.username

  const authUser = users.find(user => user.username == username && user.password == password) //con base de datos
  if(authUser) {
    const token =jwt.sign({username:username},"SECRET")
    if(token) {
      res.json({token: token})
    } else {
      res.json({message: "Authentication failed", success: false})
    }
  } else {
    res.json({message: "Authentication failed", success:false})
  }

})

// Get all users
router.get('/', function(req, res, next) {
  console.log("--GET: /users--");

  const query = 'SELECT * FROM users';
  
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.error('Error querying the database:', error);
      return res.status(500).json({ message: 'Internal Server Error', ...results });
    }
    if (results.length == 0) {
      console.log("No content");
      return res.status(404).json({ message: 'No users found', ...results });
    }
    console.log("OK");
    return res.status(200).json({ message: `Found ${results.length} users`, ...results });
  });
});

// Register user
router.post('/', function(req, res, next) {
  console.log("--POST: /users--");

  const { name, lastname, email, password, gender, country_id } = req.body;

  const query = 'INSERT INTO users (name, lastname, email, password, gender, country_id) VALUES (?, ?, ?, PASSWORD(?), ?, ?)';
  const values = [name, lastname, email, password, gender, country_id];

  connection.query(query, values, function (error, results, fields) {
    if (error) {
      console.error('Error creating new user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log("Created");
    return res.status(201).json({ message: 'User created successfully' });
  });
});

// Get a specific user by user_id
router.get('/:id', function(req, res, next) {
  const userId = req.params.id;
  console.log(`--GET: /users/${userId}--`);
  const query = 'SELECT * FROM users WHERE user_id = ? LIMIT 1';

  connection.query(query, [userId], function (error, results, fields) {
    if (error) {
      console.error('Error querying the database:', error);
      return res.status(500).json({ message: 'Internal Server Error', ...results[0] });
    }
    if (results.length === 0) {
      console.log("Not found");
      return res.status(404).json({ message: 'User not found', ...results[0] });
    }
    console.log("OK");
    return res.status(200).json({ message: `User ${userId} found`, ...results[0] });
  });
});

module.exports = router;