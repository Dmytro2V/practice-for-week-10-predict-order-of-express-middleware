const express = require('express');
const app = express();

// First
app.use('/', (req, res, next) => {
  console.log('First');
  const error = new Error('First');
  next(error);
});

// Second
app.use((req, res, next) => {
  console.log('Second');
  next();
});

// Third
app.get('/other-resource', (req, res, next) => {
  console.log('Third');
  next();
}, (req, res, next) => {
  res.send('Message');
});

// Fourth
const fourth = (req, res, next) => {
  console.log('Fourth');
  const error = new Error('Fourth');
  throw error;
};

// Fifth
const fifth = (err, req, res, next) => {
  console.log('Fifth');
  next();
};

app.use('/', [fourth, fifth]);

// Sixth
app.get('/other-resource', (req, res, next) => {
  console.log('Sixth');
  next();
});

// Seventh
app.use((req, res, next) => {
  console.log('Seventh');
  res.send('Message');
});

// Eighth
app.use((err, req, res, next) => {
  console.log('Eighth');
  res.send('Message');
});

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));

// Scenario #1 GET / prediction:
// c:1 2 7th - // note: on error skips ordinary middles
// res - message (from 7)stop on Error

// Scenario 2 Scenario #2 GET /other-resource
// console: first fifth sixth seventh // note use '/' also covers '/*' 
// res - message (from sevrenth)

// Scenario #3 GET /not-found 
// c: 1,5, 7,, res: message