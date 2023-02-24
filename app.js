const express = require('express');
const logger = require('morgan');
const cors = require('cors');

require('dotenv').config();

const listRouter = require('./routes/api/list');
const cardRouter = require('./routes/api/card');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'; 

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("public"))

app.use('/api/lists', listRouter);
app.use('/api/lists/cards', cardRouter);


app.use((req, res, next) => {
  res.status(404).json({message: 'Something went wrong'});
})

app.use((err, req, res, next) => {
  const {status = 500, message = "Server error"} = err;
  res.status(status).json({ message, })
})

module.exports = app;

