'use strict';

const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

// APP MIDDLEWARE
app.set('view engine', 'jade');


// ROUTE MIDDLEWARE
app.get('/', (req,res) => {
  res.render('index.jade');
});

app.post('/login', (req, res) => {
  res.render('index.jade')
});

app.listen(PORT, () => {
  console.log(`Listening YO, on PORT ${PORT}`);
});
