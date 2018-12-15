const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../src/app');
const User = require('../src/user/user');

chai.should();
chai.use(chaiHttp);

describe('User', () => {
  beforeEach((done) => {
    // Remove all users before test
    User.remove({}, (err) => {
      done();
    });
  });

  describe('GET /user', () => {
    it('should GET all users', (done) => {
      chai.request(app)
        .get('/user')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});
