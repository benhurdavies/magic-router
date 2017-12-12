# magic-router

<div align="center">

[![Build Status](https://travis-ci.org/benhurdavies/magic-router.png?branch=master)](https://travis-ci.org/benhurdavies/magic-router)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/benhurdavies/magic-router)
[![HitCount](http://hits.dwyl.io/benhurdavies/benhurdavies/magic-router.svg)](http://hits.dwyl.io/benhurdavies/benhurdavies/magic-router)
[![GitHub license](https://img.shields.io/github/license/benhurdavies/magic-router.svg)](https://github.com/benhurdavies/magic-router/blob/master/LICENSE)

</div>

Simplify the MVC/api applications routing.

### Installation

```javascript
npm install --save magic-router
```

### API Guidelines

All the controllers in the controller folder are loaded and the default routes are configured automatically by the magic-router.

* The default router will be : Hostname/controller(controller filename without extension)/action(method name)
* if the action/method name in controller file have the name of `index` or `get` (default index routing) it have default as Hostname/controller too. if a controller have multiple `default index routing` action/method name in a file this feature will not work

From app.js

```javascript
import express from 'express';
const app = express();
```
....
.....
```javascript 
import magicRouter from 'magic-router';

//adding all contollers..

// magicRouter.addAll(express_app_instance, options);
magicRouter.addAll(app, { dirPath: './controllers' });

```
* Usage in [example](./example) 

#### Initializing Opitons

```javascript
let options = {
  dirPath:'./controllers', // path of controller directory
  exclude:[], // optional files path for removing from magic-routering
  prefix:'', // global prefix for routing
};

magicRouter.addAll(app, options);
```

##### Exclude some controller files from magic-routering

```javascript
  magicRouter.addAll(app, {
    dirPath: '../../example/controllers',
    // excluding files
    exclude: ['../../example/controllers/auth.js'],
  });
```
* Usage in [exclude file test](https://github.com/benhurdavies/magic-router/blob/d1e20a4b67224f92e16a2188af049a194ad59866/test/example/excludeFiles.js#L77)

The developers need to focus only on the controllers.

## How to write a controller

* Controller should be an object.

```javascript
export default {
    // OPTIONAL
    // specifying the router is optional for customizing the router path
    // default will be action name.
  router: {
    // route overrides will come here <methodname>:<route>
    // a route with specific param will look like the one below
    foo1: 'foo/:id',
  },

  // OPTIONAL
  // type is optional for customizing the request type for methods.
  // It can be 'get', 'post' or any verb. 
  // default will be 'use' as in app.use(...
  type: {
    // type overrides will come here  <methodname>:<verb> 
    foo: 'get',   
  },

  // OPTIONAL
  // beforeController is optional for customizing filters or middlewares before request enters
  // controller object.
  beforeController: [
    (req, res, next) => {
      console.log('This will be hit before the control is passed to the controller object.');      
      next();
    },
    ... 
    // multiple middleware can be configured here in the same way.
    // say, authenticate, auditlog etc
  ],

  // OPTIONAL
  // beforeAction is optional for customizing filters or middlewares before request enters
  // current action corresponding to the route
  beforeAction: {
    // <methodname>:[middleware1, middleware2, ...]  
    foo: [print],
  },

  // foo is an action in this controller
  foo(req, res, next) {
    res.send('Foo');
  },

  // foo1 is an action in this controller with a parameter: id
  foo1(req, res, next) {
    res.send('id :' + req.param('id'));
  },
};
```

Everything except the action methods are optional and you need to write 
those only if you need to override the default behaviors.

### Screenshots

* Get user

![Alt text](./Readme/user_get.png "Get user")

* Get user with id

![Alt text](./Readme/user_get_id.png "Get user with id")

* Get user with invalid id - exception handling

![Alt text](./Readme/user_get_invalidId.png "Get user with invalid id - exception handling")

### Release version

#### 1.1.1 : Add global Prefix for routing.
* Adding global prefix for routing in magic-router. [Usage example from test](./test/example/prefixController.js)

#### 1.0.9 : Default index router
* Automatically/default add router for "index" action. eg: invoke index method in controller by
```javascript
`${host}/${controllerName}`
`${host}/${controllerName}/${index}`
```

#### 1.0.8 : Exclude controller files
* Feature to exclude some controller files from magic-routering. 
* Logging the router details.

#### 1.0.7 : Exception handling
* All action methods in controller are exception handled, If any exception caused inside an action, Error will forewarded automatically to (_next(err);_) outside/global (app.js) error hooked methods. The implemented at [example](./example).
* Added [test](./test) for testing the framework.

#### 1.0.6 : Initial release
* Basic structure of routing and it's implementation.
* Feature for adding multiple middileware/methods before route enter into controller. Define the same in _beforeController: [method1,method2,..]_ at controller files/object.
* Feature for adding multiple middileware/methods before route enter into action. Define the same in _beforeAction: {actionName1:[method1,method2,..],...}_ at controller files/object.
* Adding all controller files in an directory for magic-routering.
