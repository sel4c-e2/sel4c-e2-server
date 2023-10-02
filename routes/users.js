var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.send('login');
});

const users = [ //con base de datos
  {username:'fernandogar', password:'holahola'},
]

router.post('/prueba', (req, res) => {
  const username = req.body.username
  const password = req.body.username

  const authUser = users.find(user => user.username == username && user.password == password) //con base de datos
  if(authUser) {
    const token =jwt.sign({username:username},"SECRET")
    if(token) {
      res.json({token: token})
    } else {
      res.json({message: "Authentication failed", success: false})
    }
  } else {
    res.json({message: "Authentication failed", success:false})
  }

})

module.exports = router;
