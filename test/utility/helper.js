import chai from 'chai';
import helper from '../../src/utility/helper';

const expect = chai.expect;
const should = chai.should();

describe('helper => check_DEFAULT_CONTROLLER_ROUTE_METHOD', () => {
  it('only one default case index', () => {
    const DEFAULT_CONTROLLER_ROUTE_METHOD = ['index', 'get'];
    helper
      .check_DEFAULT_CONTROLLER_ROUTE_METHOD(
        DEFAULT_CONTROLLER_ROUTE_METHOD,
        'index',
        {
          index: () => {},
        }
      )
      .should.equal(true);
  });

  it('only multipe default case', () => {
    const DEFAULT_CONTROLLER_ROUTE_METHOD = ['index', 'get'];
    helper
      .check_DEFAULT_CONTROLLER_ROUTE_METHOD(
        DEFAULT_CONTROLLER_ROUTE_METHOD,
        'index',
        {
          index: () => {},
          get: () => {},
        }
      )
      .should.equal(false);
  });

  it('only one default case get', () => {
    const DEFAULT_CONTROLLER_ROUTE_METHOD = ['index', 'get'];
    helper
      .check_DEFAULT_CONTROLLER_ROUTE_METHOD(
        DEFAULT_CONTROLLER_ROUTE_METHOD,
        'get',
        {
          get: () => {},
        }
      )
      .should.equal(true);
  });
});

describe('helper => check_DEFAULT_CONTROLLER_ROUTE_METHOD case check', () => {
  it('only one default case index', () => {
    const DEFAULT_CONTROLLER_ROUTE_METHOD = ['index', 'get'];
    helper
      .check_DEFAULT_CONTROLLER_ROUTE_METHOD(
        DEFAULT_CONTROLLER_ROUTE_METHOD,
        'IndeX',
        {
          index: () => {},
        }
      )
      .should.equal(true);
  });
});
