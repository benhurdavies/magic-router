# magic-router

Simplify the MVC/api application routing pattern.

### Installation

```javascript
npm install --save magic-router
```

### API Guidelines

All the controllers in the controller folder are loaded using the consign package and the default routes are configured automatically using the controller-router.

From app.js
```javascript 

import controllerRouter from 'controller-router';

// adding contollers..
controllerRouter.addAll(app, { dirPath: './controllers' });

```

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

