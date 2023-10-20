const jwt = require('jsonwebtoken');
const { connection } = require('../db.js');

function authAdmin(req, res, next) {
  const token = req.headers.authorization;

  console.log(`Checking admin's authorization`);

  if (!token) {
    console.log('Unauthorized');
    return res.status(401).json({ message: 'No autorizado' });
  }
  jwt.verify(token.replace('Bearer ', ''), process.env.JWT_KEY, function(tokenErr, decoded) {
    if (tokenErr) {
      console.log("Error: ", tokenErr);
      return res.status(401).json({ message: 'Token no valido' });
    }
    const email = decoded.email;
    const query = 'SELECT COUNT(*) AS count FROM admins WHERE email = ?';
    connection.query(query, [email], function (error, results, fields) {
      if (error) {
        console.error('Error checking permissions:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      const count = results[0].count;
      if (count > 0) {
        console.log('Authorized');
        next();
      } else {
        console.log('Unauthorized');
        return res.status(401).json({ message: 'Unauthorized' });
      }
    });
  });
}

function authSuperAdmin(req, res, next) {
  const token = req.headers.authorization;

  console.log(`Checking super admin's authorization`);

  if (!token) {
    console.log('Unauthorized');
    return res.status(401).json({ message: 'No autorizado' });
  }
  jwt.verify(token.replace('Bearer ', ''), process.env.JWT_KEY, function(tokenErr, decoded) {
    if (tokenErr) {
      console.log("Error: ", tokenErr);
      return res.status(401).json({ message: 'Token no valido' });
    }
    const email = decoded.email;
    const query = 'SELECT super FROM admins WHERE email = ?';
    connection.query(query, [email], function (error, results, fields) {
      if (error) {
        console.error('Error checking permissions:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (results.length === 0) {
        console.log('Unauthorized');
        return res.status(401).json({ message: 'No autorizado' });
      }
      const isSuper = results[0].super;
      if (isSuper) {
        console.log('Authorized');
        next();
      } else {
        console.log('Unauthorized');
        return res.status(401).json({ message: 'No autorizado' });
      }
    });
  });
}

module.exports = { authAdmin, authSuperAdmin };
