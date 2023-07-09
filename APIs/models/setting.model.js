const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

const Setting = mongoose.model(
  'setting',
  new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, default: '' },
  }, { timestamps: true }).plugin(sanitizerPlugin)
);

module.exports = Setting;