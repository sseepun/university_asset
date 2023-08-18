const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

/*
  status :
    1 = Active
    0 = Inactive
*/

const AssetCategory = mongoose.model(
  'asset_category',
  new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    url: { type: String, required: true, unique: true },
    
    image: { type: Object, default: null },
    gallery: { type: Array, default: [] },
    
    order: { type: Number, default: 1 },
    status: { type: Number, default: 0 },
  }, { timestamps: true }).plugin(sanitizerPlugin)
);

module.exports = AssetCategory;