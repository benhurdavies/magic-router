'use strict';

import path from 'path';

import loadFile from './loadFile';
import caller from './caller';
import Helper from './utility/helper';

const pack = require(path.join(__dirname, '..', 'package'));

const ROUTER_NAME = 'router';
const TYPE_NAME = 'type';
const BEFORE_CONTROLLER_NAME = 'beforeController';
const BEFORE_ACTION_NAME = 'beforeAction';
const DEFAULT_CONTROLLER_ROUTE_METHOD = ['index', 'get'];

class magicRouter {
  constructor() {
    this.defaultOptions = {
      dirPath: './controllers',
      exclude: [],
      prefix: '',
    };
    this.options = null;
    this.app = null;
    this.addDefaultIndexRoutes = this.addDefaultIndexRoutes.bind(this);
  }

  addAll(app, options) {
    this.app = app;
    this.makeOptions(options);
    //loading controller files
    let pathInfo = loadFile(this.app, this.options);
    //adding router.
    console.log(`${pack.name} v${pack.version} Initialized`);
    this.addRouters(pathInfo.dir);
  }

  makeOptions(options) {
    //setting options
    this.options = {
      ...this.defaultOptions,
      ...options,
      //if you are creating an npm module with magic router as an internal module,
      //please pass the relative path of the controllers of the applicaiton that consumes your module
      //eg: magicRouter.addAll(app, { dirPath: './controllers' });
      callerPath: caller(2),
    };
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
    const _backupControllerName = controllerName;
    for (let _module in handler) {
      controllerName = Helper.getControllerName(
        handler,
        _module,
        _backupControllerName
      );
      // adding before controller middlewares to routing
      let prefix = Helper.getRoutePrefix({ ...this.options });
      this.addBeforeControllers(
        handler[_module],
        `${prefix}${controllerName}`,
        app
      );

      let additionalRoutes = [];

      for (let property in handler[_module]) {
        if (typeof handler[_module][property] === 'function') {
          let methodRoute = this.getRouterConfig(handler[_module], property);
          let requestType = this.getRequestType(handler[_module], property);
          let fullRoute = `/${prefix}${controllerName}/${methodRoute}`;

          //adding before Action middlewares to routing
          this.addBeforeActions(
            handler[_module],
            property,
            fullRoute,
            requestType,
            app
          );

          // adding current method routing
          console.log(`+ ${fullRoute}`);
          this._addRoute(
            requestType,
            fullRoute,
            handler[_module][property],
            app
          );

          //index default routing
          if (
            Helper.check_DEFAULT_CONTROLLER_ROUTE_METHOD(
              DEFAULT_CONTROLLER_ROUTE_METHOD,
              methodRoute,
              handler[_module]
            )
          ) {
            additionalRoutes.push({
              method: this.addDefaultIndexRoutes,
              args: [
                `${prefix}${controllerName}`,
                methodRoute,
                requestType,
                handler[_module][property],
                app,
              ],
            });
          }
        }
      }
      additionalRoutes.forEach(_method => {
        _method.method(..._method.args);
      });
    }
  }

  _addRoute(requestType, routePath, HandlerMethod, app) {
    app[requestType](routePath, (req, res, next) => {
      try {
        HandlerMethod(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  }

  addDefaultIndexRoutes(
    controllerName,
    methodName,
    requestType,
    HandlerMethod,
    app
  ) {
    let routePath = `/${controllerName}`;
    console.log(`+ defaultIndexRoute => ${routePath}`);
    this._addRoute(requestType, routePath, HandlerMethod, app);
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
    beforeControllers.forEach((method, key) => {
      let routePath = `/${controllerName}`;
      console.log(`+ beforeControllers(${key}) => ${routePath}`);
      this._addRoute(RequestType.USE(), routePath, method, app);
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
      beforeAction.forEach((method, key) => {
        console.log(`+ beforeAction(${key}) => ${route}`);
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
  static ALL() {
    return 'all';
  }

  static getRequestType(name) {
    let lowerCaseName = name ? name.toLowerCase() : name;
    switch (lowerCaseName) {
      case null:
        return this.ALL();
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
      case 'all':
        return this.ALL();
      default:
        throw Error('invalid request type');
    }
  }
}

module.exports = magicRouter = new magicRouter();
