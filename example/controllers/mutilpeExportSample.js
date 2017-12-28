export const pdf = {
  get(req, res) {
    res.send({ file: 'pdf files' });
  },
};

export const txt = {
  get(req, res) {
    res.send({ file: 'txt files' });
  },
};
