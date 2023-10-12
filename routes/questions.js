var express = require('express');
var { connection } = require('../db');
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
            // return res.status(200).json({ message: `${results.length} preguntas encontradas`, questions: results });
            return res.status(200).json({ questions: results });
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

router.get('/display/:display', function(req, res, next) {
    try {
        const display = req.params.display;

        console.log(`--GET: /questions/display/${display}--`);

        const query = 'SELECT * FROM questions WHERE display = ?';

        connection.query(query, [display], (error, results, fields) => {
            if (error) {
                console.error('Error querying the database:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (results.length === 0) {
                console.log(`Questions with display: "${display}" not found`);
                return res.status(404).json({ message: `No hay preguntas con el display: "${display}"` });
            }
            console.log(`${results.length} questions with display "${display}" found`);
            return res.status(200).json({ message: `${results.length} preguntas con display "${display}" encontradas`, questions: results });
        });
    } catch (tcErr) {
        console.error('Error:', tcErr);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.get('/answers/userId/:userId', function(req, res, next) {
    try {
        const userId = req.params.userId;

        console.log(`--GET: /questions/answers/userId/${userId}--`);

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

router.post('/answers', function(req, res, next) {
    try {
        const { userId, questionId, answer } = req.body;
        console.log(`--POST: /questions/answers--`);

        const checkQuery = 'SELECT * FROM questions_answers WHERE user_id = ? AND question_id = ?';

        connection.query(checkQuery, [userId, questionId], (checkError, checkResults, checkFields) => {
            if (checkError) {
                console.error('Error querying the database:', checkError);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
            if (checkResults.length === 0) {
                const addQuery = 'INSERT INTO questions_answers (user_id, question_id, answer) VALUES (?, ?, ?)';
                connection.query(addQuery, [userId, questionId, answer], (addError, addResults, addFields) => {
                    if (addError) {
                        console.error('Error querying the database:', addError);
                        return res.status(500).json({ message: 'Error interno del servidor' });
                    }
                    console.log("Answered registered successfully");
                    return res.status(201).json({ message: "Respuesta registrada con exito", questionId, answer });
                });
            } else {
                const alterQuery = 'UPDATE questions_answers SET answer = ? WHERE user_id = ? AND question_id = ?';
                connection.query(alterQuery, [answer, userId, questionId], (alterError, alterResults, alterFields) => {
                    if (alterError) {
                        console.error('Error querying the database:', alterError);
                        return res.status(500).json({ message: 'Error interno del servidor' });
                    }
                    console.log("Answered changed successfully");
                    return res.status(200).json({ message: "Respuesta cambiada con exito", questionId, answer });
                });
            }
        });
    } catch (tcErr) {
        console.error('Error:', tcErr);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;