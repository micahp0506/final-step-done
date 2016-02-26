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

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    if (req.body.password === req.body.verify) {
        User.findOne({email: req.body.email}, (err, user) => {
            if (err) throw (err);

            if (user) {
                res.redirect('/login');
            } else {
                User.create(req.body, (err) => {
                    if (err) throw (err);

                    res.redirect('/login');
                });
            }
        });
    }   else {
            res.render('register', {
                email: req.body.email,
                message: 'Passwords do not match'
            });
        }
});

app.listen(PORT, () => {
  console.log(`Listening YO, on PORT ${PORT}`);
});
