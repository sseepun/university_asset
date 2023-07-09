module.exports = function(app) {
  var router = require('express').Router();
  const { auth } = require('../middlewares');
  const FileController = require('../controllers/file.controller');

  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    req.header('Content-Type', 'multipart/form-data');
    next();
  });


  router.post(
    '/single',
    [ auth.verifyPublicKey ],
    FileController.fileUpload
  );
  router.post(
    '/single/:folder',
    [ auth.verifyPublicKey ],
    FileController.fileUpload
  );
  router.post(
    '/single/:folder/:resize',
    [ auth.verifyPublicKey ],
    FileController.fileUpload
  );
  router.delete(
    '/single',
    [ auth.verifyPublicKey ],
    FileController.fileDelete
  );

  router.post(
    '/multiple',
    [ auth.verifyPublicKey ],
    FileController.filesUpload
  );
  router.post(
    '/multiple/:folder',
    [ auth.verifyPublicKey ],
    FileController.filesUpload
  );
  router.delete(
    '/multiple',
    [ auth.verifyPublicKey ],
    FileController.filesDelete
  );


  app.use('/file', router);
};