// In this case we have multiple module exports in the same file. So magic-router takes controller name as export name.
// pdf as controller name.
export const pdf = {
  // uri => /pdf or /pdf/get
  get(req, res) {
    res.send({ file: 'pdf files' });
  },
};

// txt as controller name.
export const txt = {
  // uri => /txt or /txt/get
  get(req, res) {
    res.send({ file: 'txt files' });
  },
};
