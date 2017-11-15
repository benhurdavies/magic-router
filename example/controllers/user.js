import logger from '../middleware/logger';

export default {
  beforeController: [logger],

  router: {
    getUser: 'get/:id',
  },

  type: {
    get: 'get',
  },

  get(req, res) {
    res.send('hello world');
  },

  getUser(req, res) {
    res.send('The user is : ' + req.params['id']);
  },
};
