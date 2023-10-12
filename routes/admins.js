var express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var { connection } = require('../db');
var router = express.Router();

// Get all admins
router.get('/', function(req, res, next) {
  try {
    console.log("--GET: /admins--");

    const query = 'SELECT * FROM admins';
  
    connection.query(query, function (error, results, fields) {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.length == 0) {
        console.log('No admins found');
        return res.status(404).json({ message: 'No se encontraron administradores' });
      }
      console.log(`Found ${results.length} admins`);
      return res.status(200).json({ message: `Se encontraron ${results.length} administradores`, admins: results });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Get a specific admin with token
router.get('/admin', function(req, res, next) {
  try {
    const token = req.headers.authorization;
  
    console.log(`--GET: /admins/admin--`);

    if (!token) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    jwt.verify(token.replace('Bearer ', ''), process.env.JWT_KEY, function(tokenErr, decoded) {
      if (tokenErr) {
        console.log("Error: ", tokenErr);
        return res.status(401).json({ message: 'Token no valido' });
      }
      const email = decoded.email;
      const query = 'SELECT * FROM admins WHERE email = ?';
      connection.query(query, [email], function (error, results, fields) {
        if (error) {
          console.error('Error querying the database:', error);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (results.length === 0) {
          console.log('Admin not found');
          return res.status(404).json({ message: 'Administrador no encontrado' });
        }
        console.log(`Admin ${email} found`);
        return res.status(200).json({ message: `Administrador ${email} encontrado`, ...results[0] });
      });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/login', function(req, res, next) {
  try {
    const { email, password } = req.body;

    console.log(`--POST: /admins/login--`);

    const query = 'SELECT password, access FROM admins WHERE email = ?';

    connection.query(query, [email], function (error, results, fields) {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.length === 0) {
        console.log('Admin not found');
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }
      if (!results[0].access) {
        console.log('This user does not have access to the platform');
        return res.status(403).json({ message: 'Usuario sin acceso' });
      }
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
        const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '2h' });
        console.error('Authentication successful');
        return res.status(200).json({ message: 'Autenticación exitosa', token });
      });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Register admin
router.post('/', function(req, res, next) {
  try {
    const { name, lastname, email, password } = req.body;

    console.log("--POST: /admins--");

    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }

      const query = 'INSERT INTO admins (name, lastname, email, password) VALUES (?, ?, ?, ?)';
      const values = [name, lastname, email, hash];

      connection.query(query, values, function (error, results, fields) {
        if (error) {
          console.error('Error creating new admin:', error);
          return res.status(500).json({ message: 'Error interno del servidor' });
        }
        console.log('Admin created successfully');
        // const token = jwt.sign({ email }, process.env.JWT_KEY, { expiresIn: '1h' });
        return res.status(201).json({ message: 'Usuario creada con éxito' });
      });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Get a specific admin by admin_id
router.get('/:id', function(req, res, next) {
  try {
    const adminId = req.params.id;
  
    console.log(`--GET: /admins/${adminId}--`);

    const query = 'SELECT * FROM admins WHERE admin_id = ?';

    connection.query(query, [adminId], function (error, results, fields) {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.length === 0) {
        console.log('Admin not found');
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }
      console.log(`Admin ${adminId} found`);
      return res.status(200).json({ message: `Administrador ${userId} encontrado`, ...results[0] });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Update password for a specific admin by admin_id
router.put('/password/:id', function(req, res, next) {
  try {
    const adminId = req.params.id;
    const { currentPassword, newPassword } = req.body;

    console.log(`--PUT: /admins/${adminId}/password--`);

    const checkPasswordQuery = 'SELECT password FROM admins WHERE admin_id = ?';

    connection.query(checkPasswordQuery, [adminId], function (error, results, fields) {
      if (error) {
        console.error('Error checking password:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.length === 0) {
        console.error('Admin not found');
        return res.status(404).json({ message: 'Administrador no encontrado' });
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

          const updatePasswordQuery = 'UPDATE admins SET password = ? WHERE admin_id = ?';

          connection.query(updatePasswordQuery, [hash, adminId], function (error, results, fields) {
            if (error) {
              console.error('Error updating password:', error);
              return res.status(500).json({ message: 'Error interno del servidor' });
            }

            console.error(`Password updated for admin ${adminId}`);
            return res.status(200).json({ message: `Contraseña actualizada para el administrador ${adminId}` });
          });
        });
      });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Update a specific admin by admin_id
router.put('/:id', function(req, res, next) {
  try {
    const adminId = req.params.id;
    const updates = req.body;

    console.log(`--PUT: /admins/${adminId}--`);
    if (updates.hasOwnProperty('password')) {
      console.log('Password cannot be updated throught this endpoint');
        return res.status(502).json({ message: 'No se puede actualizar el administrador' });
    }

    const query = 'UPDATE admins SET ? WHERE admin_id = ?';

    connection.query(query, [updates, adminId], function (error, results, fields) {
      if (error) {
        console.error('Error updating admin:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }

      if (results.affectedRows === 0) {
        console.error('Admin not found');
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }
      console.error(`Admin ${adminId} updated successfully`);
      return res.status(200).json({ message: `Administrador ${adminId} actualizado exitosamente` });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Delete a specific admin by admin_id
router.delete('/:id', function(req, res, next) {
  try {
    const adminId = req.params.id;

    console.log(`--DELETE: /admins/${adminId}--`);

    const query = 'DELETE FROM admins WHERE admin_id = ?';

    connection.query(query, [adminId], function (error, results, fields) {
      if (error) {
        console.error('Error deleting admin:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }

      if (results.affectedRows === 0) {
        console.error('Admin not found');
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }

      console.error(`Admin ${adminId} deleted successfully`);
      return res.status(200).json({ message: `Administrador ${adminId} eliminado exitosamente` });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;