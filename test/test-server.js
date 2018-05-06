'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');

const expect = chai.expect;

chai.use(chaiHttp);

describe('index page', function () {
  it('should exist', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.have.status(200);
      });
  });
});

describe('add page', function () {
  it('should exist', function () {
    return chai.request(app)
      .get('/add.html')
      .then(function (res) {
        expect(res).to.have.status(200);
      });
  });
});

describe('update page', function () {
  it('should exist', function () {
    return chai.request(app)
      .get('/update.html')
      .then(function (res) {
        expect(res).to.have.status(200);
      });
  });
});

describe('delete page', function () {
  it('should exist', function () {
    return chai.request(app)
      .get('/delete.html')
      .then(function (res) {
        expect(res).to.have.status(200);
      });
  });
});