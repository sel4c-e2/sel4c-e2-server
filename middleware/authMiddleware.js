const jwt = require('jsonwebtoken');
const { connection } = require('../db.js');

function authSuperAdmin(req, res, next) {
  const token = req.headers.authorization;

  console.log(`Checking admin's authorization`);
  console.log(token);

  if (!token) {
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
        console.log('Admin not found');
        return res.status(404).json({ message: 'Administrador no encontrado' });
      }
      const isSuper = results[0].super;
      if (isSuper) {
        next();
      } else {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    });
  });
}

module.exports = { authSuperAdmin };
