export default class Helper {
  static prefixMaker(options) {
    let prefix = options.prefix;
    // if (prefix && prefix !== '') {
    //     if (prefix.slice(-1) !== '/')
    //         prefix += '/';
    // }
    return prefix;
  }
}
