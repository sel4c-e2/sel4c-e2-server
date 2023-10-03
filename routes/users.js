var express = require('express');
var connection = require('../db');
var router = express.Router();
var jwt = require('jsonwebtoken');

const users = [ //con base de datos
  {username:'fernandogar', password:'holahola'},
]

router.post('/prueba', (req, res) => {
  const username = req.body.username
  const password = req.body.password

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
      console.log('No users found');
      return res.status(404).json({ message: 'No users found', ...results });
    }
    console.log(`Found ${results.length} users`);
    return res.status(200).json({ message: `Found ${results.length} users`, ...results });
  });
});

// Register user
router.post('/', function(req, res, next) {
  const { name, lastname, email, password, gender, country_id } = req.body;

  console.log("--POST: /users--");

  const query = 'INSERT INTO users (name, lastname, email, password, gender, country_id) VALUES (?, ?, ?, PASSWORD(?), ?, ?)';
  const values = [name, lastname, email, password, gender, country_id];

  connection.query(query, values, function (error, results, fields) {
    if (error) {
      console.error('Error creating new user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.log('User created successfully');
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
      console.log('User not found');
      return res.status(404).json({ message: 'User not found', ...results[0] });
    }
    console.log(`User ${userId} found`);
    return res.status(200).json({ message: `User ${userId} found`, ...results[0] });
  });
});

// Update a specific user by user_id
router.put('/:id', function(req, res, next) {
  const userId = req.params.id;
  const updates = req.body;

  console.log(`--PUT: /users/${userId}--`);
  if (updates.hasOwnProperty('password')) {
    console.log('Password cannot be updated throught this endpoint');
      return res.status(502).json({ message: 'Unable to update user' });
  }

  const query = 'UPDATE users SET ? WHERE user_id = ?';

  connection.query(query, [updates, userId], function (error, results, fields) {
    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.affectedRows === 0) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    console.error(`User ${userId} updated successfully`);
    return res.status(200).json({ message: `User ${userId} updated successfully` });
  });
});

// Update password for a specific user by user_id
router.put('/:id/password', function(req, res, next) {
  const userId = req.params.id;
  const { password, newPassword } = req.body;

  console.log(`--PUT: /users/${userId}/password--`);
});


module.exports = router;