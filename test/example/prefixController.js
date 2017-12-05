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

  it('/api/user/get', done => {
    _req.get('/api/user/get').end((err, res) => {
      res.should.have.status(200);
      res.body.msg.should.equal('hello user');
      res.body.name.should.equal('user');
      // checking before_Controller worked or not
      res.header.beforecontroller.should.equal('controllerLogger1');
      done();
    });
  });

  it('/user/get request failer', done => {
    _req.get('/user/get').end((err, res) => {
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
});
