var express = require('express');
var { connection } = require('../db');
var router = express.Router();

router.get('/', function(req, res, next) {
    try {
        console.log("--GET: /universities--");

        connection.query('SELECT * FROM universites', (error, results, fields) => {
            if (error) {
                console.error('Error querying the database:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (results.length === 0) {
                console.log(`No universities found`);
                return res.status(404).json({ message: `No se encontraron universidades` });
            }
            console.log(`${results.length} universities found`);
            return res.status(200).json({ message: `${results.length} universities encontradas`, universities: results });
        });
    } catch (tcErr) {
        console.error('Error:', tcErr);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.get('/country/:countryId', function(req, res, next) {
    try {
        const countryId = req.params.countryId;

        console.log(`--GET: /universities/country/${countryId}--`);

        const query = 'SELECT * FROM universities WHERE country_id = ?';

        connection.query(query, [countryId], (error, results, fields) => {
            if (error) {
                console.error('Error querying the database:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (results.length === 0) {
                console.log(`No universities from countryId "${countryId}" found`);
                return res.status(404).json({ message: `No hay universidades en el pais "${countryId}"` });
            }
            console.log(`${results.length} questions from type "${type}" found`);
            return res.status(200).json({ message: `${results.length} preguntas de la categoria "${type}" encontradas`, universities: results });
        });
    } catch (tcErr) {
        console.error('Error:', tcErr);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.get('/:id', function(req, res, next) {
    try {
        const universityId = req.params.id;

        console.log(`--GET: /universities/${universityId}--`);

        const query = 'SELECT * FROM universities WHERE university_id = ?';

        connection.query(query, [universityId], (error, results, fields) => {
            if (error) {
                console.error('Error querying the database:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (results.length === 0) {
                console.log(`No university with id "${universityId}" found`);
                return res.status(404).json({ message: `No hay universidad con el id "${universityId}"` });
            }
            console.log(`Unniversity with id "${universityId}" found`);
            return res.status(200).json({ message: `Universidad con id "${universityId}" encontrado`, ...results[0] });
        });
    } catch (tcErr) {
        console.error('Error:', tcErr);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;