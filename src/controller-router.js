const ROUTER_NAME = 'router';
const TYPE_NAME = 'type';
const BEFORE_CONTROLLER_NAME = 'beforeController';
const BEFORE_ACTION_NAME = 'beforeAction';

export default (controllerName, handler, app) => {
  if (typeof handler !== 'object') {
    throw Error('Expected an object');
  }

  for (let _module in handler) {
    // adding before controller middlewares to routing
    addBeforeControllers(handler[_module], controllerName, app);

    for (let property in handler[_module]) {
      if (typeof handler[_module][property] === 'function') {
        let methodRoute = getRouterConfig(handler[_module], property);
        let requestType = getRequestType(handler[_module], property);
        let fullRoute = `/${controllerName}/${methodRoute}`;

        //adding before Action middlewares to routing
        addBeforeActions(handler[_module], property, fullRoute, app);

        // adding current method routing
        app[requestType](fullRoute, (req, res, next) => {
          handler[_module][property](req, res, next);
        });
      }
    }
  }
};

function getPropertyFromHandler(handler, methodName, optionKey) {
  let value = null;
  if (
    handler.hasOwnProperty(optionKey) &&
    typeof handler[optionKey] === 'object'
  ) {
    if (handler[optionKey].hasOwnProperty(methodName))
      value = handler[optionKey][methodName];
  }
  return value;
}

function getRouterConfig(handler, methodName) {
  let routePath = getPropertyFromHandler(handler, methodName, ROUTER_NAME);
  routePath = routePath ? routePath : methodName;
  return routePath;
}

function getRequestType(handler, methodName) {
  let type = RequestType.getRequestType(
    getPropertyFromHandler(handler, methodName, TYPE_NAME)
  );
  return type;
}

function addBeforeControllers(handler, controllerName, app) {
  let beforeControllers = getBeforeControllers(handler);
  beforeControllers.forEach(method => {
    app.use(`/${controllerName}`, (req, res, next) => {
      method(req, res, next);
    });
  });
}

function getBeforeControllers(handler) {
  let beforeControllers = [];
  if (
    handler.hasOwnProperty(BEFORE_CONTROLLER_NAME) &&
    Array.isArray(handler[BEFORE_CONTROLLER_NAME])
  ) {
    beforeControllers = handler[BEFORE_CONTROLLER_NAME];
  }
  return beforeControllers;
}

function addBeforeActions(handler, methodName, route, app) {
  let beforeAction = getPropertyFromHandler(
    handler,
    methodName,
    BEFORE_ACTION_NAME
  );
  if (beforeAction && Array.isArray(beforeAction)) {
    beforeAction.forEach(method => {
      app.use(route, (req, res, next) => {
        method(req, res, next);
      });
    });
  }
}

class RequestType {
  static USE() {
    return 'use';
  }
  static GET() {
    return 'get';
  }
  static POST() {
    return 'post';
  }
  static PUT() {
    return 'put';
  }
  static PATCH() {
    return 'patch';
  }
  static DELETE() {
    return 'delete';
  }

  static getRequestType(name) {
    let lowerCaseName = name ? name.toLowerCase() : name;
    switch (lowerCaseName) {
      case null:
        return this.USE();
      case 'use':
        return this.USE();
      case 'get':
        return this.GET();
      case 'post':
        return this.POST();
      case 'put':
        return this.PUT();
      case 'patch':
        return this.PATCH();
      case 'delete':
        return this.DELETE();
      default:
        throw Error('invalid request type');
    }
  }
}