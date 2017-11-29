import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../../example/server';

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe('route URL test', () => {
  const _req = chai.request(server);

  after(done => server.close(done));

  it('/user/get', done => {
    _req.get('/user/get').end((err, res) => {
      res.should.have.status(200);
      res.body.msg.should.equal('hello user');
      res.body.name.should.equal('user');
      // checking before_Controller worked or not
      res.header.beforecontroller.should.equal('controllerLogger1');
      done();
    });
  });

  it('/user/get/:id by id', done => {
    _req.get('/user/get/5').end((err, res) => {
      res.should.have.status(200);
      res.body.id.should.equal(5);
      // checking beforeController worked or not
      res.header.beforecontroller.should.equal('controllerLogger1');
      // checking beforeAction worked or not
      res.header.actioncontroller.should.equal('actionLogger1');
      done();
    });
  });

  it('/user for default index routing', done => {
    _req.get('/user').end((err, res) => {
      res.should.have.status(200);
      res.body[0].id.should.equal(1);
      res.body[1].id.should.equal(2);
      // checking beforeController worked or not
      res.header.beforecontroller.should.equal('controllerLogger1');
      done();
    });
  });

  it('/user/index for default index routing', done => {
    _req.get('/user/index').end((err, res) => {
      res.should.have.status(200);
      res.body[0].id.should.equal(1);
      res.body[1].id.should.equal(2);
      // checking beforeController worked or not
      res.header.beforecontroller.should.equal('controllerLogger1');
      done();
    });
  });
});
