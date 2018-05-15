'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

//POST to register a new user
router.post('/', jsonParser, (req, res) => {
    //Defines username and password
    console.log(req.body);
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    //Check to make sure all the fields are strings
    const stringFields = ['username', 'password', 'firstName', 'lastName'];
    const nonStringField = stringFields.find(field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect firld type: expected string',
            location: nonStringField
        });
    }

    // If the username and password aren't trimmed we give an error.
    // Username and password cannot have spaces at beginning or end
    //We need to reject if a space is present and let user know
    //rather than silently trimming them and expecting the user to understand.
    // We'll silently trim the other fields, because they aren't credentials used
    // to log in, so it's less of a problem.
    const explicitlyTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicitlyTrimmedFields.find(field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with space',
            location: nonTrimmedField
        });
    }

    const sizedFields = {
        username: {
            min: 1
        },
        password: {
            min: 10,
            max: 72
        }
    };

    const tooSmallField = Object.keys(sizedFields).find(
        field => 'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
        field => 'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
            ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
            : `Cannot exceed ${sizedFields[tooLargeField].max} characters`,
            location: tooSmallField || tooLargeField
        });
    }
    let {username, password, firstName = '', lastName = ''} = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();

    return User.find({username})
    .count()
    .then(count => {
        if (count > 0) {
            //Username already exists
            return Promise.reject({
                code: 422,
                reason: 'ValidationError',
                message: 'Username already exists',
                location: 'username'
            });
        }
        //If there is no existing user, hash the password
        return User.hashPassword(password);
    })
    .then(hash => {
        return User.create({
            username,
            password: hash,
            firstName,
            lastName
        });
    })
    .then(user => {
        // return res.status(201).json(user.serialize());
        // FOR NOW, AFTER USER SUBMITS INFO THEY ARE DIRECTED TO HOME PAGE
        return res.redirect('../../');
        
    })
    .catch(err => {
        //Send validation errors to client, otherwise give 500 error
        if (err.reason === 'ValidationError') {
            return res.status(err.code).json(err);
        }
        res.status(500).json({code: 500, message: 'Internal Server Error'});
    });
});


module.exports = {router};