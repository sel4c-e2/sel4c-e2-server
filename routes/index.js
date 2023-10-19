var express = require('express');
const path = require('path');
var { connection } = require('../db');
var router = express.Router();

router.get('/uploads/:filePath', (req, res) => {
  try {
    const { filePath } = req.params;
    
    console.log(`--GET: /uploads/${filePath}--`);

    const file = path.resolve(__dirname, '../uploads/', filePath);
    return res.status(200).sendFile(file);
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/', function(req, res, next) {
  console.log("--GET: /--");
  return res.sendStatus(200);
});

module.exports = router;
