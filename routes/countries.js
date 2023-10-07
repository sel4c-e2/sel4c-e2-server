var express = require('express');
var connection = require('../db');
var router = express.Router();

router.get('/', function(req, res, next) {
    try {
        console.log("--GET: /countries--");

        connection.query('SELECT * FROM countries', (error, results, fields) => {
            if (error) {
                console.error('Error querying the database:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (results.length === 0) {
                console.log(`No countries found`);
                return res.status(404).json({ message: `No se encontraron paises` });
            }
            console.log(`${results.length} countries found`);
            return res.status(200).json({ message: `${results.length} paises encontradas`, countries: results });
        });
    } catch (tcErr) {
        console.error('Error:', tcErr);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;