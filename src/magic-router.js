'use strict';

import loadFile from './loadFile';
import caller from './caller';

const ROUTER_NAME = 'router';
const TYPE_NAME = 'type';
const BEFORE_CONTROLLER_NAME = 'beforeController';
const BEFORE_ACTION_NAME = 'beforeAction';

class magicRouter {
  constructor() {
    this.defaultOptions = {
      dirPath: '',
    };
    this.options = null;
    this.app = null;
  }

  addAll(app, options) {
    this.app = app;
    //setting options
    let cwd = process.cwd();
    this.options = {
      ...this.defaultOptions,
      ...options,
      callerPath: caller(1),
    };
    //loading controller files
    let pathInfo = loadFile(
      this.app,
      this.options.dirPath,
      this.options.callerPath
    );
    //adding router.
    this.addRouters(pathInfo.dir);
  }

  addRouters(appNameSpace) {
    // dynamically include routes (Controller)
    Object.keys(this.app[appNameSpace]).forEach(controllerKey => {
      this.doRoute(
        controllerKey,
        this.app.controllers[controllerKey],
        this.app
      );
    });
  }

  doRoute(controllerName, handler, app) {
    if (typeof handler !== 'object') {
      throw Error('Expected an object');
    }

    for (let _module in handler) {
      // adding before controller middlewares to routing
      this.addBeforeControllers(handler[_module], controllerName, app);

      for (let property in handler[_module]) {
        if (typeof handler[_module][property] === 'function') {
          let methodRoute = this.getRouterConfig(handler[_module], property);
          let requestType = this.getRequestType(handler[_module], property);
          let fullRoute = `/${controllerName}/${methodRoute}`;

          //adding before Action middlewares to routing
          this.addBeforeActions(
            handler[_module],
            property,
            fullRoute,
            requestType,
            app
          );

          // adding current method routing
          this._addRoute(
            requestType,
            fullRoute,
            handler[_module][property],
            app
          );
        }
      }
    }
  }

  _addRoute(requestType, routePath, HandllerMethod, app) {
    try {
      app[requestType](routePath, (req, res, next) => {
        HandllerMethod(req, res, next);
      });
    } catch (err) {
      next(err);
    }
  }

  getPropertyFromHandler(handler, methodName, optionKey) {
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

  getRouterConfig(handler, methodName) {
    let routePath = this.getPropertyFromHandler(
      handler,
      methodName,
      ROUTER_NAME
    );
    routePath = routePath ? routePath : methodName;
    return routePath;
  }

  getRequestType(handler, methodName) {
    let type = RequestType.getRequestType(
      this.getPropertyFromHandler(handler, methodName, TYPE_NAME)
    );
    return type;
  }

  addBeforeControllers(handler, controllerName, app) {
    let beforeControllers = this.getBeforeControllers(handler);
    beforeControllers.forEach(method => {
      this._addRoute(RequestType.USE(), `/${controllerName}`, method, app);
    });
  }

  getBeforeControllers(handler) {
    let beforeControllers = [];
    if (
      handler.hasOwnProperty(BEFORE_CONTROLLER_NAME) &&
      Array.isArray(handler[BEFORE_CONTROLLER_NAME])
    ) {
      beforeControllers = handler[BEFORE_CONTROLLER_NAME];
    }
    return beforeControllers;
  }

  addBeforeActions(handler, methodName, route, requestType, app) {
    let beforeAction = this.getPropertyFromHandler(
      handler,
      methodName,
      BEFORE_ACTION_NAME
    );
    if (beforeAction && Array.isArray(beforeAction)) {
      beforeAction.forEach(method => {
        this._addRoute(requestType, route, method, app);
      });
    }
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

export default (magicRouter = new magicRouter());
