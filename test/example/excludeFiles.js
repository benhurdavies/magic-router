import chai from 'chai';
import chaiHttp from 'chai-http';

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';

import magicRouter from '../../src/magic-router';

const expect = chai.expect;
const should = chai.should();

let _port = 3500;

// creating custom server
function getServer(addRouter) {
  const port = _port++;
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  addRouter(app);

  app.use('*', function(req, res) {
    res.send({ msg: 'no router defined' });
  });

  //error handling
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      errorMessage: err.message,
      error: err,
    });
  });

  var server = http.createServer(app);
  return server.listen(port);
}

describe('include all controller test', () => {
  let includeAllController = function(app) {
    magicRouter.addAll(app, { dirPath: '../../example/controllers' });
  };
  const server = getServer(includeAllController);
  const _req = chai.request(server);

  after(done => server.close(done));

  it('/user/default', done => {
    _req.get('/user/default').end((err, res) => {
      res.should.have.status(200);
      res.body.msg.should.equal('hello user');
      res.body.name.should.equal('user');
      // checking before_Controller worked or not
      res.header.beforecontroller.should.equal('controllerLogger1');
      done();
    });
  });

  it('/auth/login post', done => {
    _req
      .post('/auth/login')
      .send({ email: 'email@example.com', password: 'password' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.isAuthenticated.should.equal(true);
        done();
      });
  });
});

describe('exclude some controller test', () => {
  let includeAllController = function(app) {
    magicRouter.addAll(app, {
      dirPath: '../../example/controllers',
      exclude: ['../../example/controllers/auth.js'], // excluding files
    });
  };
  const server = getServer(includeAllController);
  const _req = chai.request(server);

  after(done => server.close(done));

  it('/user/default', done => {
    _req.get('/user/default').end((err, res) => {
      res.should.have.status(200);
      res.body.msg.should.equal('hello user');
      res.body.name.should.equal('user');
      // checking before_Controller worked or not
      res.header.beforecontroller.should.equal('controllerLogger1');
      done();
    });
  });

  it('/auth/login post', done => {
    _req
      .post('/auth/login')
      .send({ email: 'email@example.com', password: 'password' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.msg.should.equal('no router defined');
        done();
      });
  });
});

export const testServer = getServer;
