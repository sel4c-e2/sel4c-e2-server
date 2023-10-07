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

router.get('/:id', function(req, res, next) {
    try {
        const countryId = req.params.id;

        console.log(`--GET: /countries/${countryId}--`);

        const query = 'SELECT * FROM countries WHERE country_id = ?';

        connection.query(query, [countryId], (error, results, fields) => {
            if (error) {
                console.error('Error querying the database:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (results.length === 0) {
                console.log(`No country with id "${countryId}" found`);
                return res.status(404).json({ message: `No hay pais con el id "${countryId}"` });
            }
            console.log(`Country with id "${countryId}" found`);
            return res.status(200).json({ message: `Pais con id "${countryId}" encontrado`, ...results[0] });
        });
    } catch (tcErr) {
        console.error('Error:', tcErr);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;