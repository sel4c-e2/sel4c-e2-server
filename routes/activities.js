const express = require('express');
const multer = require('multer');
const path = require('path');
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

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }
});

router.get('/', function(req, res, next) {
  try {
    console.log(`--GET: /activities--`);
    const query = 'SELECT * FROM activities';
    connection.query(query, (queryError, queryResults, queryFields) => {
      if (queryError) {
        console.error('Error querying the database:', queryError);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (queryResults.length === 0) {
        console.log(`No activities found`);
        return res.status(404).json({ message: `No se encontraron actividades` });
      }
      console.log(`${queryResults.length} activities found`);
      // return res.status(200).json({ message: `${queryResults.length} actividades encontradas`, activities: queryResults });
      return res.status(200).json({ activities: queryResults });
    });

  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Get count of activities
router.get('/count/answers/:activityId', function(req, res, next) {
  try {
    const activityId = req.params.activityId;
    console.log(`--GET: /activities/count/answers/${activityId}--`);

    const query = `SELECT COUNT(*) AS count FROM activities_answers WHERE activity_id = ?`;
  
    connection.query(query, [activityId], function (error, results, fields) {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      const answersCount = results[0].count;
      console.log(`Found ${answersCount} answers for activity ${activityId}`);
      return res.status(200).json({ message: `Se encontraron ${answersCount} respuestas para la actividad ${activityId}`, count: answersCount });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Get count of activities
router.get('/count', function(req, res, next) {
  try {
    console.log("--GET: /activities/count--");

    const query = `SELECT COUNT(*) AS count FROM activities`;
  
    connection.query(query, function (error, results, fields) {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      const activitiesCount = results[0].count;
      console.log(`Found ${activitiesCount} activities`);
      return res.status(200).json({ message: `Se encontraron ${activitiesCount} actividades`, count: activitiesCount });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/answers/user/:userId', function(req, res, next) {
  try {
    const { userId } = req.params;
    
    console.log(`--GET: /activities/answers/user/${userId}--`);

    const query = 'SELECT * FROM activities_answers WHERE user_id = ? ORDER BY created_at';
    connection.query(query, [userId], (queryError, queryResults, queryFields) => {
      if (queryError) {
        console.error('Error querying the database:', queryError);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (queryResults.length === 0) {
        console.log(`User ${userId} has not answered any activity`);
        return res.status(404).json({ message: `El alumno no ha mandado su evidencia en ninguna actividad` });
      }
      console.log(`User ${userId} has ${queryResults.length} answers`);
      return res.status(200).json({ message: `El alumno ha mandado ${queryResults.length} evidencias`, answers: queryResults });
    });

  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/answers/:activityId/:userId', function(req, res, next) {
  try {
    const { activityId, userId } = req.params;
    
    console.log(`--GET: /activities/answers/${activityId}/${userId}--`);

    const query = 'SELECT * FROM activities_answers WHERE activity_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 1';
    connection.query(query, [activityId, userId], (queryError, queryResults, queryFields) => {
      if (queryError) {
        console.error('Error querying the database:', queryError);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (queryResults.length === 0) {
        console.log(`User ${userId} has no answers in activity ${activityId}`);
        return res.status(404).json({ message: `El alumno no ha mandado su evidencia en la actividad ${activityId}` });
      }
      console.log(`User ${userId} has answered activty ${activityId}`);
      return res.status(200).json({ message: `El alumno mando su evidencia de la actividad ${activityId}`, answer: queryResults[0] });
    });

  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/answers/:id', function(req, res, next) {
  try {
    const activityId = req.params.id;
    console.log(`--GET: /activities/answers/${activityId}--`);

    const query = 'SELECT activities_answers.*, users.user_id, users.name FROM activities_answers JOIN users ON activities_answers.user_id = users.user_id WHERE activities_answers.activity_id = ?';

    connection.query(query, [activityId], (queryError, queryResults, queryFields) => {
      if (queryError) {
        console.error('Error querying the database:', queryError);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (queryResults.length === 0) {
        console.log(`No answers in activity ${activityId}`);
        return res.status(404).json({ message: `No se encontraron evidencias en la actividad ${activityId}` });
      }
      console.log(`${queryResults.length} answers were found in activity ${activityId}`);
      return res.status(200).json({ message: `${queryResults.length} evidencias fueron encontradas en la actividad ${activityId}`, answers: queryResults });
    });

  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/:id', function(req, res, next) {
  try {
    const activityId = req.params.id;
    console.log(`--GET: /activities/${activityId}--`);

    const query = 'SELECT * FROM activities WHERE id = ?';
    connection.query(query, [activityId], (queryError, queryResults, queryFields) => {
      if (queryError) {
        console.error('Error querying the database:', queryError);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (queryResults.length === 0) {
        console.log(`No activities found`);
        return res.status(404).json({ message: `No se encontro la actividad ${activityId}` });
      }
      console.log(`Activity ${activityId} was found`);
      // return res.status(200).json({ message: `Actividad ${activityId} encontrada`, activity: queryResults[0] });
      return res.status(200).json({ ...queryResults[0] });
    });

  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/answers', upload.single('file'), function(req, res, next) {
  try {
    const { activityId, userId, answer } = req.body;
    const query = 'INSERT INTO activities_answers (activity_id, user_id, answer, file_path, file_name) VALUES (?, ?, ?, ?, ?)';
    let values;
    if (req.file) {
      const filePath = path.join('uploads', req.file.filename);
      console.log(`--POST: /activities/answers (file upload)--`);
      values = [activityId, userId, answer, filePath, req.file.originalname];
    } else {
      console.log(`--POST: /activities/answers (text answer)--`);
      values = [activityId, userId, answer, null, null];
    }
    connection.query(query, values, (queryError, queryResults, queryFields) => {
      if (queryError) {
        console.error('Error querying the database:', queryError);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      return res.status(200).json({ message: 'Respuesta guardada exitosamente' });
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

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
  try {
    const { user_id, activity_id } = req.params;
    
    console.log(`--GET: /download/${user_id}/${activity_id}--`);

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
      
      // Adjust the file path resolution here to match the upload destination
      const filePath = path.resolve(__dirname, '..', results[0].file_path);
      return res.status(200).sendFile(filePath);
    });
  } catch (tcErr) {
    console.error('Error:', tcErr);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;