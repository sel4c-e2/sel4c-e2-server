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

router.get('/type/:type', function(req, res, next) {
    try {
        const type = req.params.type;

        console.log(`--GET: /questions/type/${type}--`);

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

router.get('/results/userId/:userId', function(req, res, next) {
    try {
        const userId = req.params.userId;

        console.log(`--GET: /questions/results/userId/${userId}--`);

        const query = 'SELECT * FROM questions WHERE user_id = ?';

        connection.query(query, [type], (error, results, fields) => {
            if (error) {
                console.error('Error querying the database:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (results.length === 0) {
                console.log(`User: "${userId}" has not answered any questions`);
                return res.status(404).json({ message: `Este alumno no ha contestado ninguna pregunta` });
            }
            console.log(`User ${userId} has answered ${results.length} questions`);
            return res.status(200).json({ message: `El usuario ${userId} ha contestado ${results.length} preguntas`, data: results });
        });
    } catch (tcErr) {
        console.error('Error:', tcErr);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;