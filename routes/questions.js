var express = require('express');
var connection = require('../db');
var router = express.Router();

router.get('/', function(req, res, next) {
    try {
        console.log("--GET: /questions--");

        connection.query('SELECT * FROM questions', (error, results, fields) => {
            if (error) {
                console.error('Error querying the database:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (results.length === 0) {
                console.log(`No questions found`);
                return res.status(404).json({ message: `No se encontraron preguntas` });
            }
            console.log(`${results.length} questions found`);
            return res.status(200).json({ message: `${results.length} preguntas encontradas`, questions: results });
        });
    } catch (tcErr) {
        console.error('Error:', tcErr);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.get('/:type', function(req, res, next) {
    try {
        const type = req.params.type;

        console.log(`--GET: /questions/${type}--`);

        const query = 'SELECT * FROM questions WHERE type = ?';

        connection.query(query, [type], (error, results, fields) => {
            if (error) {
                console.error('Error querying the database:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (results.length === 0) {
                console.log(`Questions from type "${type}" not found`);
                return res.status(404).json({ message: `No hay preguntas de la categoría "${type}"` });
            }
            console.log(`${results.length} questions from type "${type}" found`);
            return res.status(200).json({ message: `${results.length} preguntas de la categoria "${type}" encontradas`, questions: results });
        });
    } catch (tcErr) {
        console.error('Error:', tcErr);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;