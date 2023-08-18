const userProcess = require('./user.process');
const assetProcess = require('./asset.process');

module.exports = {
  ...userProcess,
  ...assetProcess
};