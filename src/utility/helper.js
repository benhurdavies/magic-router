import colors from './consoleColors';

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
        colors.Black,
        colors.Yellow,
        `=> '${controllerName}' file have multiple module exports. Taking '${
          moduleName
        }' (export name) as controller name`,
        colors.Reset
      );
    return overrideControllerName ? moduleName : controllerName;
  }
}
