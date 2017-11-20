import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../../example/server';

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe('checking error handling', () => {
  const _req = chai.request(server);

  after(done => server.close(done));

  it('/user/get/:id by id => Violating param type', done => {
    _req.get('/user/get/five').end((err, res) => {
      res.should.have.status(500);
      // checking beforeController worked or not
      res.header.beforecontroller.should.equal('controllerLogger1');
      // checking beforeAction worked or not
      res.header.actioncontroller.should.equal('actionLogger1');
      res.body.should.have.property('errorMessage');
      done();
    });
  });
});
