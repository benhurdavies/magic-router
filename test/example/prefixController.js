import chai from 'chai';
import chaiHttp from 'chai-http';

import magicRouter from '../../src/magic-router';
import { testServer } from './excludeFiles';

const expect = chai.expect;
const should = chai.should();

let _port = 3500;

describe('prefix on route', () => {
  let prefixTest = function(app) {
    magicRouter.addAll(app, {
      dirPath: '../../example/controllers',
      prefix: 'api/',
    });
  };
  const server = testServer(prefixTest);
  const _req = chai.request(server);

  after(done => server.close(done));

  it('/api/user/default', done => {
    _req.get('/api/user/default').end((err, res) => {
      res.should.have.status(200);
      res.body.msg.should.equal('hello user');
      res.body.name.should.equal('user');
      // checking before_Controller worked or not
      res.header.beforecontroller.should.equal('controllerLogger1');
      done();
    });
  });

  it('/user/default request failer', done => {
    _req.get('/user/default').end((err, res) => {
      res.should.have.status(200);
      res.body.msg.should.equal('no router defined');
      done();
    });
  });

  it('/api/user => prefix => for default index routing', done => {
    _req.get('/api/user').end((err, res) => {
      res.should.have.status(200);
      res.body[0].id.should.equal(1);
      res.body[1].id.should.equal(2);
      // checking beforeController worked or not
      res.header.beforecontroller.should.equal('controllerLogger1');
      done();
    });
  });

  it('/api/user => prefix => failer case', done => {
    _req.get('/user').end((err, res) => {
      res.should.have.status(200);
      res.body.msg.should.equal('no router defined');
      done();
    });
  });

  it('/api/auth => prefix => for default get routing', done => {
    _req.get('/api/auth').end((err, res) => {
      res.should.have.status(200);
      res.body.msg.should.equal('Please login');
      done();
    });
  });
});
