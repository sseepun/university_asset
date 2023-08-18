module.exports = function(app) {
  var router = require('express').Router();
  const { authJwt } = require('../middlewares');
  const AdminController = require('../controllers/admin');

  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });


  // START: User
  router.post(
    '/users',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.userList
  );
  router.get(
    '/user',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.userRead
  );
  router.post(
    '/user',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.userCreate
  );
  router.patch(
    '/user',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.userUpdate
  );
  router.delete(
    '/user',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.userDelete
  );

  router.patch(
    '/user-profile',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.userUpdateProfile
  );
  router.patch(
    '/user-password',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.userUpdatePassword
  );

  router.post(
    '/roles',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.roleList
  );
  router.get(
    '/role',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.roleRead
  );
  // END: User


  // START: Asset
  router.post(
    '/asset-categories',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.assetCategoryList
  );
  router.get(
    '/asset-category',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.assetCategoryRead
  );
  router.post(
    '/asset-category',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.assetCategoryCreate
  );
  router.patch(
    '/asset-category',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.assetCategoryUpdate
  );
  router.delete(
    '/asset-category',
    [ authJwt.verifyToken, authJwt.isAdmin ],
    AdminController.assetCategoryDelete
  );
  // END: Asset


  app.use('/admin', router);
};