const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

/*
  level :
    1  = User
    98 = Admin
    99 = Super Admin
*/

const UserRole = mongoose.model(
  'user_role',
  new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, default: 1 },
    isDefault: { type: Number, default: 0 }
  }, { timestamps: true }).plugin(sanitizerPlugin)
);

module.exports = UserRole;