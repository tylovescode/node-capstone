'use strict';

const mongoose = require('mongoose');

//This is the schema to represent an individual record
const recordSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    genre: {
        type: String
    },
    release_date: {
        type:String
    },
    image_url: {
        type: String
    }
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;