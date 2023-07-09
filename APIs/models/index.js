const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;


db.Setting = require('./setting.model');

db.UserRole = require('./user-role.model');
db.User = require('./user.model');
db.UserTemp = require('./user-temp.model');


module.exports = db;