module.exports = function(app) {
  var router = require('express').Router();
  const AuthController = require('../controllers/auth');

  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });


  router.post(
    '/signin',
    AuthController.signin
  );
  router.patch(
    '/refresh',
    AuthController.refresh
  );

  router.post(
    '/forget-password',
    AuthController.forgetPassword
  );
  router.get(
    '/check-reset-token',
    AuthController.checkResetToken
  );
  router.patch(
    '/reset-password',
    AuthController.resetPassword
  );

  
  app.use('/auth', router);
};