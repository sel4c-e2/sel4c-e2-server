var express = require('express');
var connection = require('../db');
var router = express.Router();

router.get('/questions', async (req, res) => {
    try {
        connection.query('SELECT * FROM questions', (error, results, fields) => {
            if (error) throw error;
            res.json(results); 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error de servidor'); 
    }
});
