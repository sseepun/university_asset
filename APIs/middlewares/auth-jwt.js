const config = require('../config');
const db = require('../models');
const sanitize = require('mongo-sanitize');
const jwt = require('jsonwebtoken');
const { resProcess } = require('../helpers');


const verifyToken = async (req, res, next) => {
  try {
    var error = {};

    if(!req.headers['authorization']){
      error['accessToken'] = 'authorization is required.';
      return resProcess['checkError'](res, error);
    }

    const authHeader = req.headers['authorization'].split(' ');
    if(authHeader[0] != 'Bearer'){
      error['accessToken'] = 'authorization must be of type Bearer.';
      return resProcess['checkError'](res, error);
    }else if(authHeader.length != 2) {
      error['accessToken'] = 'accessToken is required in authorization.';
      return resProcess['checkError'](res, error);
    }
    
    const token = authHeader[1];
    jwt.verify(token, config.tokenSecret, async (err, decoded) => {
      if(err){
        error['accessToken'] = 'accessToken is invalid.';
        return resProcess['checkError'](res, error);
      }

      const user = await db.User.findById(sanitize(decoded._id))
        .populate('role');
      if(user.refreshToken && user.role && user.role.level > 0){
        req.user = user;
        return next();
      }else{
        error['accessToken'] = 'accessToken is invalid.';
        return resProcess['checkError'](res, error);
      }
    });
  } catch(err) {
    return resProcess['500'](res, err);
  }
};


const isSuperAdmin = async (req, res, next) => {
  try {
    if(!req.user){
      error['user'] = 'user is invalid.';
      return resProcess['checkError'](res, error);
    }
    if(!req.user.role || req.user.role.level != 99){
      error['role'] = 'role is not an admin.';
      return resProcess['checkError'](res, error);
    }
    return next();
  } catch (err) {
    return resProcess['500'](res, err);
  }
};
const isAdmin = async (req, res, next) => {
  try {
    if(!req.user){
      error['user'] = 'user is invalid.';
      return resProcess['checkError'](res, error);
    }
    if(!req.user.role || req.user.role.level < 97){
      error['role'] = 'role is not an admin.';
      return resProcess['checkError'](res, error);
    }
    return next();
  } catch (err) {
    return resProcess['500'](res, err);
  }
};

const authJwt = {
  verifyToken,
  isSuperAdmin,
  isAdmin,
};

module.exports = authJwt;
