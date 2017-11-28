'use strict';

import consign from 'consign';
import path from 'path';

export default (app, options) => {
  let pathInfo = makePath(options.dirPath, options.callerPath);
  let _consign = consign({ cwd: pathInfo.cwd }).include(pathInfo.dir);

  //excluding files or directorys.
  options.exclude.forEach(item => {
    let eachPathInfo = makePath(item, options.callerPath);
    let _filePath = excludePath(pathInfo.cwd, eachPathInfo);
    _consign.exclude(_filePath);
  });

  _consign.into(app);
  return pathInfo;
};

function excludePath(rootPath, pathInfo) {
  let remainPath = pathInfo.cwd.replace(rootPath, '');
  return path.join(remainPath, pathInfo.dir);
}

function makePath(dirPath, callerPath) {
  let _path = path.join(callerPath, '..', dirPath, '..');
  let dir = path.basename(dirPath);
  return { cwd: _path, dir: dir };
}
