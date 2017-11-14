'use strict';

import consign from 'consign';
import path from 'path';

export default (app, dirPath, callerPath) => {
  let pathInfo = makePath(dirPath, callerPath);
  consign({ cwd: pathInfo.cwd })
    .include(pathInfo.dir)
    .into(app);
  return pathInfo;
};

function makePath(dirPath, callerPath) {
  let _path = path.join(callerPath, '..', dirPath, '..');
  let dir = path.basename(dirPath);
  return { cwd: _path, dir: dir };
}
