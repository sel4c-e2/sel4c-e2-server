const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
var { connection } = require('../db');
var router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });


router.post('/upload', upload.single('file'), (req, res) => {
    const { user_id, activity_id } = req.body;
    const filePath = path.join('uploads', req.file.filename);
    
    const query = 'INSERT INTO files (user_id, activity_id, file_path, original_filename) VALUES (?, ?, ?, ?)';
    const values = [user_id, activity_id, filePath, req.file.originalname];
    
    connection.query(query, values, (error, results, fields) => {
      if (error) {
        console.error('Error saving file metadata:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      
      console.log('File uploaded successfully');
      res.status(200).json({ message: 'Archivo cargado con éxito', file_id: results.insertId });
    });
  });



  router.get('/download/:user_id/:activity_id', (req, res) => {
    const { user_id, activity_id } = req.params;
    
    const query = 'SELECT file_path FROM files WHERE user_id = ? AND activity_id = ? ORDER BY upload_timestamp DESC LIMIT 1';
    
    connection.query(query, [user_id, activity_id], (error, results, fields) => {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      
      if (results.length === 0) {
        console.log('File not found');
        return res.status(404).json({ message: 'Archivo no encontrado' });
      }
      
      const filePath = path.resolve(__dirname, results[0].file_path);
      res.sendFile(filePath);
    });
  });

module.exports = router;