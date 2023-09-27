require('dotenv').config()
const express = require("express");
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const app = express();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});