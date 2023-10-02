'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app;

  const _jwt = middleware.jwtErr(app.config.jwt.secret);

  router.get('/', controller.home.index);

  router.post('/api/register', controller.user.register);
  router.post('/api/login', controller.user.login);

  router.get('/api/users', _jwt, controller.user.getUserInfo);
  router.put('/api/users', _jwt, controller.user.editUserInfo);

  router.post('/api/bills', _jwt, controller.bill.addBill);
  router.get('/api/bills', _jwt, controller.bill.getBill);
};
