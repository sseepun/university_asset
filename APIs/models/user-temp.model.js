const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

/*
  action :
    RESET PASSWORD
*/

const UserTemp = mongoose.model(
  'user_temp',
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user', required: true
    },
    action: { type: String, default: '' },
    token: { type: String, default: '' },
    isUsed: { type: Number, default: 0 }
  }, { timestamps: true }).plugin(sanitizerPlugin)
);

module.exports = UserTemp;