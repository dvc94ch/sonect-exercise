const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';
const app = require('../src/app');
const auth = require('../src/user/auth');
const User = require('../src/user/user');

chai.should();
chai.use(chaiHttp);

const user1 = {
  name: 'James Bond',
  email: '007@mi6.uk',
  password: '007',
};

describe('User', () => {
  beforeEach((done) => {
    // Remove all users before test
    User.deleteMany({}, (err) => {
      done();
    });
  });

  describe('POST /user/register', () => {
    it('should register a new user', (done) => {
      chai.request(app)
        .post('/user/register')
        .send(user1)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.auth.should.be.eql(true);
          res.body.token.should.not.be.eql(null);
          done();
        });
    });
  });

  describe('GET /user/me', () => {
    it('should return 400', (done) => {
      chai.request(app)
        .get('/user/me')
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('should return 401', (done) => {
      User.create(user1, (err, user) => {
        chai.request(app)
          .get('/user/me')
          .set('x-access-token', 'abcd')
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });
    });

    it('should return user data', (done) => {
      User.create(user1, (err, user) => {
        const token = auth.createToken(user._id);
        chai.request(app)
          .get('/user/me')
          .set('x-access-token', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.name.should.be.eql(user1.name);
            res.body.email.should.be.eql(user1.email);
            done();
          });
      });
    });
  });

  describe('POST /user/login', () => {
    it('should return 401', (done) => {
      chai.request(app)
        .post('/user/register')
        .send(user1)
        .end((err, res) => {
          chai.request(app)
            .post('/user/login')
            .send({ email: user1.email, password: 'wrong_password' })
            .end((err, res) => {
              res.should.have.status(401);
              res.body.auth.should.be.eql(false);
              done();
            });
        });
    });

    it('should login user', (done) => {
      chai.request(app)
      .post('/user/register')
      .send(user1)
      .end((err, res) => {
        chai.request(app)
          .post('/user/login')
          .send({ email: user1.email, password: user1.password })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.auth.should.be.eql(true);
            res.body.token.should.not.be.eql(null);
            done();
          });
      });
    });
  });
});
