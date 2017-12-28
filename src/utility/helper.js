import { fail } from 'assert';
import { triggerAsyncId } from 'async_hooks';

export default class Helper {
  static getRoutePrefix(options) {
    let prefix = options.prefix;
    return prefix;
  }

  static check_DEFAULT_CONTROLLER_ROUTE_METHOD(
    DEFAULT_CONTROLLER_ROUTE_METHOD,
    methodRoute,
    handler
  ) {
    let isCheck = false;
    let curMethodCheck = false,
      noOfDefaultMethod = 0;
    DEFAULT_CONTROLLER_ROUTE_METHOD.forEach(item => {
      if (item === methodRoute.toLowerCase()) {
        curMethodCheck = true;
      }
      //count checking
      if (handler.hasOwnProperty(item) && typeof handler[item] === 'function') {
        noOfDefaultMethod++;
      }
    });
    if (curMethodCheck && noOfDefaultMethod <= 1) isCheck = true;
    return isCheck;
  }

  static overrideControllerName(fileObj) {
    // Object.keys(fileObj).length => getting module count
    return Object.keys(fileObj).length > 1;
  }

  // controllerName => old controller name if we new one, otherwise old one return.
  static getControllerName(fileObj, moduleName, controllerName) {
    // checking need to override default controllerName (fileName)
    const overrideControllerName = this.overrideControllerName(fileObj);
    if (overrideControllerName)
      console.log(
        colors.bg.Black,
        colors.fg.Yellow,
        `=> '${controllerName}' file have multiple module exports. Taking '${
          moduleName
        }' (export name) as controller name`,
        colors.Reset
      );
    return overrideControllerName ? moduleName : controllerName;
  }
}

export const colors = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',
  fg: {
    Black: '\x1b[30m',
    Red: '\x1b[31m',
    Green: '\x1b[32m',
    Yellow: '\x1b[33m',
    Blue: '\x1b[34m',
    Magenta: '\x1b[35m',
    Cyan: '\x1b[36m',
    White: '\x1b[37m',
    Crimson: '\x1b[38m',
  },
  bg: {
    Black: '\x1b[40m',
    Red: '\x1b[41m',
    Green: '\x1b[42m',
    Yellow: '\x1b[43m',
    Blue: '\x1b[44m',
    Magenta: '\x1b[45m',
    Cyan: '\x1b[46m',
    White: '\x1b[47m',
    Crimson: '\x1b[48m',
  },
};
