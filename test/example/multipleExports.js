import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../../example/server';

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe('multiple exports in a file', () => {
  const _req = chai.request(server);

  after(done => server.close(done));

  it('/pdf one the module exported', done => {
    _req.get('/pdf').end((err, res) => {
      res.should.have.status(200);
      res.body.file.should.equal('pdf files');
      done();
    });
  });

  it('/pdf/get one the module exported', done => {
    _req.get('/pdf/get').end((err, res) => {
      res.should.have.status(200);
      res.body.file.should.equal('pdf files');
      done();
    });
  });

  it('/txt one the module exported', done => {
    _req.get('/txt').end((err, res) => {
      res.should.have.status(200);
      res.body.file.should.equal('txt files');
      done();
    });
  });
});
