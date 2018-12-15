const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';
const app = require('../src/app');
const auth = require('../src/user/auth');
const User = require('../src/user/user');
const Atm = require('../src/atm/atm');

chai.should();
chai.use(chaiHttp);

const user1 = {
  name: 'James Bond',
  email: '007@mi6.uk',
  password: '007',
};

const user_position = {
  lat: 47.245400,
  long: 7.971640,
};

const atm1 = {
  name: 'Raiffeisen',
  lat: 47.243620,
  long: 7.971380,
};

const atm2 = {
  name: 'LUKB',
  lat: 47.247395,
  long: 7.971450,
};

const atm3 = {
  name: 'far far away',
  lat: 10,
  long: 10,
};

describe('Atm', () => {
  let auth_token;

  before((done) => {
    // Remove all users before test
    User.deleteMany({}, () => {
      chai.request(app)
        .post('/user/register')
        .send(user1)
        .end((err, res) => {
          auth_token = res.body.token;
          Atm.deleteMany({}, () => {
            Atm.create([atm1, atm2, atm3], () => {
              done();
            });
          });
        });
    });
  });

  describe('GET /atm', () => {
    it('should return atms', (done) => {
      chai.request(app)
        .get('/atm')
        .set('x-access-token', auth_token)
        .query({
          radius: 5000,
          lat: user_position.lat,
          long: user_position.long,
        })
        .end((err, res) => {
          res.should.have.status(200);
          console.log(res.body);
          done();
        });
    });
  });
});
