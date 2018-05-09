const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');
const {Record} = require('./models');

app.use(express.static('public'));
app.listen(process.env.PORT || 8080);

module.exports = app;