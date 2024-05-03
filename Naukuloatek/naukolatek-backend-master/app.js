const express = require('express');
const bodyParser = require('body-parser');
const sensorsRouter = require('./sensors');
const gradesRouter = require('./grades');
const lessonsRouter = require('./lessons');
const app = express();
const port = 3001;

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack); 
  const statusCode = err.statusCode || 500; 
  const errorMessage = err.message || 'An unexpected error occurred';
  res.status(statusCode).json({ error: errorMessage });
});

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With'); 

  if ('OPTIONS' == req.method) {
      res.sendStatus(200);
  } else {
      next();
  }
};

app.use(allowCrossDomain);

app.use('/sensor', sensorsRouter);
app.use('/grade', gradesRouter);
app.use('/lesson', lessonsRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});