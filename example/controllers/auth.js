export default {
  type: {
    login: 'post',
  },

  get(req, res) {
    res.send({ msg: 'Please login' });
  },

  // this will access by /auth/login as POST request
  login(req, res) {
    const { email, password } = req.body;
    if (email === 'email@example.com' && password === 'password') {
      return res.send({ isAuthenticated: true });
    } else {
      return res.send({ isAuthenticated: false });
    }
  },
};
