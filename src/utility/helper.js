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
}
