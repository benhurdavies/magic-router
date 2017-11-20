import { controllerLogger, actionLogger } from '../middleware/logger';

export default {
  beforeController: [controllerLogger],

  router: {
    getUser: 'get/:id',
  },

  type: {
    get: 'get',
  },

  beforeAction: {
    getUser: [actionLogger],
  },

  // this method can access by /user/get
  get(req, res) {
    res.send({ msg: 'hello user', name: 'user' });
  },

  // can access by /user/get/:id => eg: /user/get/5
  getUser(req, res) {
    const id = parseInt(req.params['id'], 10);
    res.send({ id, name: `user:${id}` });
  },
};
