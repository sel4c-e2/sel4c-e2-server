var express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var { connection } = require('../db');
var router = express.Router();

// const users = [ //con base de datos
//   {username:'fernandogar', password:'holahola'},
// ];

// router.post('/prueba', (req, res) => {
//   const username = req.body.username
//   const password = req.body.password

//   const authUser = users.find(user => user.username == username && user.password == password) //con base de datos
//   if(authUser) {
//     const token =jwt.sign({username:username},process.env.JWT_KEY)
//     if(token) {
//       res.json({token: token})
//     } else {
//       res.json({message: "Authentication failed", success: false})
//     }
//   } else {
//     res.json({message: "Authentication failed", success:false})
//   }

// });

// Get all users
router.get('/', function(req, res, next) {
  try {
    console.log("--GET: /users--");

    const query = ` SELECT users.*, countries.name as country_name, universities.name as university_name FROM users LEFT JOIN countries ON users.country_id = countries.country_id LEFT JOIN universities ON users.university_id = universities.university_id`;
  
    connection.query(query, function (error, results, fields) {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.length == 0) {
        console.log('No users found');
        return res.status(404).json({ message: 'No se encontraron usuarios' });
      }
      console.log(`Found ${results.length} users`);
      return res.status(200).json({ message: `Se encontraron ${results.length} usuarios`, users: results });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Get a specific user by token
router.get('/user', function(req, res, next) {
  try {
    const token = req.headers.authorization;

    console.log(`--GET: /users/user--`);

    if (!token) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    jwt.verify(token.replace('Bearer ', ''), process.env.JWT_KEY, function(tokenErr, decoded) {
      if (tokenErr) {
        console.log("Error: ", tokenErr);
        return res.status(401).json({ message: 'Token no valido' });
      }
      const email = decoded.email;
      const query = 'SELECT * FROM users WHERE email = ?';
      connection.query(query, [email], function (error, results, fields) {
        if (error) {
          console.error('Error querying the database:', error);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
          console.log('User not found');
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        console.log(`User ${email} found`);
        return res.status(200).json({ message: `Usuario ${email} encontrado`, ...results[0] });
      });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Get a specific user by user_id
router.get('/:id', function(req, res, next) {
  try {
    const userId = req.params.id;
  
    console.log(`--GET: /users/${userId}--`);

    const query = 'SELECT * FROM users WHERE user_id = ?';

    connection.query(query, [userId], function (error, results, fields) {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.length === 0) {
        console.log('User not found');
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      console.log(`User ${userId} found`);
      return res.status(200).json({ message: `Usuario ${userId} encontrado`, ...results[0] });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Register user
router.post('/', function(req, res, next) {
  try {
    const { name, age, gender, email, country_id, university_id, password } = req.body;

    console.log("--POST: /users--");

    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }

      const query = 'INSERT INTO users (name, age, gender, email, country_id, university_id, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [name, age, gender, email, country_id, university_id, hash];

      connection.query(query, values, function (error, results, fields) {
        if (error) {
          console.error('Error creating new user:', error);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
        console.log('User created successfully');
        const user_id = results.insertId;
        const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '1h' });
        return res.status(201).json({ message: 'Usuario creada con éxito', user_id, name, age, gender, email, country_id, university_id, token });
      });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Login user
router.post('/login', function(req, res, next) {
  try {
    console.log(`--POST: /users/login--`);

    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';

    connection.query(query, [email], function (error, results, fields) {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.length === 0) {
        console.log('User not found');
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      const user = results[0];
      const hashedPassword = results[0].password;
      bcrypt.compare(password, hashedPassword, function(err, result) {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (!result) {
          console.error('Incorrect password');
          return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '1h' });
        console.error('Authentication successful');
        return res.status(200).json({ message: 'Autenticación exitosa', token, ...user});
      });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Update password for a specific user by user_id
router.put('/passwod/:id', function(req, res, next) {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    console.log(`--PUT: /users/${userId}/password--`);

    const checkPasswordQuery = 'SELECT password FROM users WHERE user_id = ?';

    connection.query(checkPasswordQuery, [userId], function (error, results, fields) {
      if (error) {
        console.error('Error checking password:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.length === 0) {
        console.error('User not found');
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const currentHashedPassword = results[0].password;

      bcrypt.compare(currentPassword, currentHashedPassword, function(err, result) {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }

        if (!result) {
          console.error('Incorrect current password');
          return res.status(403).json({ message: 'Contraseña actual incorrecta' });
        }

        // Hash the new password
        bcrypt.hash(newPassword, 10, function(hashErr, hash) {
          if (hashErr) {
            console.error('Error hashing password:', hashErr);
            return res.status(500).json({ message: 'Error interno del servidor' });
          }

          const updatePasswordQuery = 'UPDATE users SET password = ? WHERE user_id = ?';

          connection.query(updatePasswordQuery, [hash, userId], function (error, results, fields) {
            if (error) {
              console.error('Error updating password:', error);
              return res.status(500).json({ message: 'Error interno del servidor' });
            }

            console.error(`Password updated for user ${userId}`);
            return res.status(200).json({ message: `Contraseña actualizada para el usuario ${userId}` });
          });
        });
      });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Update a specific user by user_id
router.put('/:id', function(req, res, next) {
  try {
    const userId = req.params.id;
    const updates = req.body;

    console.log(`--PUT: /users/${userId}--`);
    if (updates.hasOwnProperty('password')) {
      console.log('Password cannot be updated throught this endpoint');
        return res.status(502).json({ message: 'No se puede actualizar el usuario' });
    }

    const query = 'UPDATE users SET ? WHERE user_id = ?';

    connection.query(query, [updates, userId], function (error, results, fields) {
      if (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }

      if (results.affectedRows === 0) {
        console.error('User not found');
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      console.error(`User ${userId} updated successfully`);
      return res.status(200).json({ message: `Usuario ${userId} actualizado exitosamente` });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Delete a specific user by user_id
router.delete('/:id', function(req, res, next) {
  try {
    const userId = req.params.id;

    console.log(`--DELETE: /users/${userId}--`);

    const query = 'DELETE FROM users WHERE user_id = ?';

    connection.query(query, [userId], function (error, results, fields) {
      if (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }

      if (results.affectedRows === 0) {
        console.error('User not found');
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      console.error(`User ${userId} deleted successfully`);
      return res.status(200).json({ message: `Usuario ${userId} eliminado exitosamente` });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;