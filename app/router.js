'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app;

  const _jwt = middleware.jwtErr(app.config.jwt.secret);

  router.get('/', controller.home.index);
  router.get('/users', controller.home.getUser);
  router.put('/users', controller.home.editUser);
  router.del('/users', controller.home.deleteUser);
  router.put('/users', controller.home.editUser);
  router.del('/users', controller.home.deleteUser);
  router.post('/api/register', controller.user.register);
  router.post('/api/login', controller.user.login);
  router.get('/api/test', _jwt, controller.user.test);
};
