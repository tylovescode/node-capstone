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
});

const Record = mongoose.model('Record', recordSchema);

module.exports - {Record};