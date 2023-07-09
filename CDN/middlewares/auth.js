require('dotenv').config();
const resProcess = require('../helpers/res-process');


verifyPublicKey = async (req, res, next) => {
  try {
    var error = {};

    if(!req.headers['authorization']){
      error['publicKey'] = 'authorization is required.';
      return resProcess['checkError'](res, error);
    }

    const authHeader = req.headers['authorization'].split(' ');
    if(authHeader[0] != 'Bearer'){
      error['publicKey'] = 'authorization must be of type Bearer.';
      return resProcess['checkError'](res, error);
    }else if(authHeader.length != 2) {
      error['publicKey'] = 'publicKey is required in authorization.';
      return resProcess['checkError'](res, error);
    }
    
    if(authHeader[1] != process.env.PUBLIC_KEY) {
      error['publicKey'] = 'publicKey is invalid.';
      return resProcess['checkError'](res, error);
    }

    return next();
  } catch(err) {
    return resProcess['500'](res, err);
  }
};


const auth = {
  verifyPublicKey
};

module.exports = auth;