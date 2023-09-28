'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/users', controller.home.getUser);
  router.post('/users', controller.home.addUser);
  router.put('/users', controller.home.editUser);
  router.del('/users', controller.home.deleteUser);
};
