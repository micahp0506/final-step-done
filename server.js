'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./db/appData.sqlite');

const PORT = process.env.PORT || 3000;

// APP MIDDLEWARE
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({"extended": false}));


// ROUTE MIDDLEWARE
app.get('/dashboard', (req,res) => {
  res.render('dashboard.jade');
});


app.post('/dashboard/entries/new', (req,res) => {
  const QUERY = `
    INSERT INTO DailyEntries (UserID, StepCount, Weight, TimeStamp)
    VALUES ($UserID,$StepCount,$Weight, $TimeStamp)
    `;

  const date = new Date();

  db.run(QUERY, {
    $UserID: 2,
    $StepCount: req.body.steps,
    $Weight: req.body.weight,
    $TimeStamp: date
    },
    (error) => { console.log(error); }
  );
  res.redirect('/dashboard/entries');
});

app.get('/dashboard/entries', (req,res) => {
  const QUERY = `
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

app.get('/', (req, res) => {
    res.render('login');
})


app.post('/login', (req, res) => {
  res.render('index.jade')
});


app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    if (req.body.password === req.body.verify) {

        const QUERY = `
            SELECT * FROM Users WHERE Users.email = $email`;

            db.run(QUERY, {$email: req.body.email},
                (err) => {
                    if (err) throw (err);

                    if (null === false) {
                        res.redirect('/');
                    } else {
                        const ENTRY = `
                            INSERT INTO Users (Email, passwordHash)
                            VALUES ($email, $passwordHash)`;

                            db.run(ENTRY, {
                                $email: req.body.email,
                                $passwordHash: req.body.password
                            })

                            res.redirect('/');
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
