module.exports = function(app) {
  var router = require('express').Router();
  const { authJwt } = require('../middlewares');
  const UserController = require('../controllers/user');

  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });


  router.patch(
    '/signout',
    [ authJwt.verifyToken ],
    UserController.signout
  );
  router.post(
    '/verify-signin',
    [ authJwt.verifyToken ],
    UserController.verifySignIn
  );

  router.patch(
    '/fcm-token',
    [ authJwt.verifyToken ],
    UserController.fcmTokenUpdate
  );
  
  router.get(
    '/account',
    [ authJwt.verifyToken ],
    UserController.accountRead
  );
  router.patch(
    '/account',
    [ authJwt.verifyToken ],
    UserController.accountUpdate
  );
  router.patch(
    '/password',
    [ authJwt.verifyToken ],
    UserController.passwordUpdate
  );

  
  app.use('/user', router);
};