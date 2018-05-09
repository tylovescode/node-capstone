'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/'; //input local database here
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/'; //input local database here
exports.PORT = process.env.PORT || 8080;