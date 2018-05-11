const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const Record = require('./models');

//GET REQUEST TO API/RECORDS
router.get('/', (req, res) => {
    Record
    .find()
    .sort({title: 1})
    .then(records => {
        res.json(records);
    })
    .catch(err => {
    console.error(err);
    res.status(500).json({message: 'Internal Server Error'});
    });
});

//GET A RECORD BY ID
router.get('/:id', (req, res) => {
    Record
    .findById(req.params.id)
    .then(record => res.json(record))
    .catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal Server Error'});
    });
});

//ADD A RECORD
router.post('/', (req, res) => {
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

//UPDATE A RECORD
router.put('/:id', (req, res) => {
  //Ensure the ids in the request path and request body match
  if (!(req.params.id && req.body.id === req.body.id)) {
    const message = (`Request path id ${req.params.id} and request body id ${req.body.id} must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }
  const toUpdate = {};
  const updateableFields = ['title', 'artist', 'format', 'genre', 'release_date', 'image_url'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  Record
  //All key value pairs in toUpdate will be updated - that's what $set does
  .findByIdAndUpdate(req.params.id, { $set: toUpdate })
  .then(record => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal Server Error'}));
});

//DELETE A RECORD
router.delete('/:id', (req, res) => {
  Record
  .findByIdAndRemove(req.params.id)
  .then(record => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal Server Error'}));
});

module.exports = router;