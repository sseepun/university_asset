module.exports = function(app) {
  var router = require('express').Router();
  const FrontendController = require('../controllers/frontend');

  app.use(function(req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });


  // START: App
  router.get(
    '/settings',
    FrontendController.settingsRead
  );
  
  router.get(
    '/download/:fileName',
    FrontendController.download
  );
  // END: App


  app.use('/frontend', router);
};