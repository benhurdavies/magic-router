import { controllerLogger, actionLogger } from '../middleware/logger';
import { throws } from 'assert';

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

  // can access by => /user
  // also can access by /user/index
  // index method in controller have default routing.
  index(req, res) {
    res.send([{ id: 1, name: 'user1' }, { id: 2, name: 'user2' }]);
  },

  // this method can access by /user/get
  get(req, res) {
    res.send({ msg: 'hello user', name: 'user' });
  },

  // can access by /user/get/:id => eg: /user/get/5
  getUser(req, res) {
    const id = parseInt(req.params['id'], 10);
    if (!id) throw new Error("Expected param 'Id' is not a number");
    res.send({ id, name: `user:${id}` });
  },
};
