const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const Record = require('./models');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

//GET REQUEST TO API/RECORDS
app.get('/api/records', (req, res) => {
    Record
    .find()
    .then(records => {
        res.json(records);
    })
    .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
    });
});

//GET A RECORD BY ID
app.get('/api/records/:id', (req, res) => {
    Record
    .findById(req.params.id)
    .then(record => res.json(record))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    });
});

//ADD A RECORD
app.post('/api/records', (req, res) => {
    const requiredFields = ['title', 'artist', 'format'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    Record
        .create({
            title: req.body.title,
            artist: req.body.artist,
            format: req.body.format,
            genre: req.body.genre,
            release_date: req.body.release_date,
            image_url: req.body.image_url
        })
        .then(record => res.status(201).json(record))
        .catch(err => {
            console.error(err);
            res.status(500).json({message: 'Internal Server Error'});
        });
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        console.log("mongoose connect");
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          console.log(error);
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };