'use strict';

const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./db/appData.sqlite');

const PORT = process.env.PORT || 3000;

// APP MIDDLEWARE
app.set('view engine', 'jade');


// ROUTE MIDDLEWARE
app.get('/dashboard', (req,res) => {
  res.render('index.jade');
});


app.post('/dashboard/entries/new', (req,res) => {
  const QUERY = `
    INSERT INTO DailyEntries(UserID,StepCount,Weight,TimeStamp)
    VALUES ($UserID,$StepCount,$Weight, $TimeStamp
    `;

    db.run(QUERY, {
      $UserID: 2,
      $StepCount: 12,
      $Weight: 180,
      $TimeStamp: Date()
      },
      () => { console.log(this); }
    );
    res.send('Entry Inserted');
});

app.get('/dashboard/entries', (req,res) => {
  let QUERY = `
    SELECT *
    FROM DailyEntries
    LEFT OUTER JOIN Users
    ON Users.UserID = DailyEntries.EntryID
    `;

  db.all( QUERY, (error, rows) => {
    console.log(rows);
    res.send(rows);
  });
});


app.post('/login', (req, res) => {
  res.render('index.jade')
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
