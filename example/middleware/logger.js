export default (req, res, next) => {
  console.log(`logger (${new Date()}) : ${req.originalUrl}`);
  next();
};
