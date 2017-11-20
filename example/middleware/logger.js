export const controllerLogger = (req, res, next) => {
  res.setHeader('beforeController', 'controllerLogger1');
  next();
};

export const actionLogger = (req, res, next) => {
  res.setHeader('actionController', 'actionLogger1');
  next();
};
