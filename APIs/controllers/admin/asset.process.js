const db = require('../../models');
const sanitize = require('mongo-sanitize');
const bcrypt = require('bcryptjs');
const { resProcess, utility } = require('../../helpers');

module.exports = {

  assetCategoryList : async (req, res) => {
    try {
      const { paginate, dataFilter } = req.body;

      let condition = {};
      if(dataFilter){
        if(dataFilter.keywords){
          condition['$or'] = [
            { name: new RegExp(dataFilter.keywords, 'i') },
            { description: new RegExp(dataFilter.keywords, 'i') },
            { url: new RegExp(dataFilter.keywords, 'i') },
          ];
        }
        if([0, 1].indexOf(dataFilter.status) > -1){
          condition['status'] = dataFilter.status;
        }
      }

      const sort = utility.cleanSort({ order: 1, name: 1 }, dataFilter);

      let result = [];
      if(!paginate){
        result = await db.AssetCategory.find(condition)
          .sort(sort); 
      }else{
        result = await db.AssetCategory.find(condition)
          .sort(sort)
          .skip((paginate.page - 1) * paginate.pp)
          .limit(paginate.pp);
        paginate.total = await db.User.countDocuments(condition);
      }

      return resProcess['200'](res, {
        paginate: paginate? paginate: {},
        dataFilter: dataFilter? dataFilter: {},
        result: result,
      });
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  assetCategoryRead : async (req, res) => {
    try {
      var error = {};
      const { _id } = req.query;
      
      if(!_id) error['_id'] = '_id is required.';
      if(Object.keys(error).length) return resProcess['checkError'](res, error);

      const category = await db.AssetCategory.findOne({ _id: sanitize(_id) });
      if(!category){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }

      return resProcess['200'](res, { result: category });
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  assetCategoryCreate : async (req, res) => {
    try {
      var error = {};
      const { 
        name, description, url, image, gallery, order, status,
      } = req.body;

      if(!name) error['name'] = 'name is required.';
      if(!url) error['url'] = 'url is required.';
      if([0, 1].indexOf(status) < 0) error['status'] = 'status is required.';
      if(Object.keys(error).length) return resProcess['checkError'](res, error);

      let updateInput = {
        name: name,
        url: url,
        order: order? order: 1,
        status: status,
      };
      if(description!==undefined) updateInput['description'] = description;
      if(image!==undefined) updateInput['image'] = image;
      if(gallery!==undefined) updateInput['gallery'] = gallery;
      await db.AssetCategory(updateInput).save();

      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  assetCategoryUpdate : async (req, res) => {
    try {
      var error = {};
      const {
        _id, name, description, url, image, gallery, order, status,
      } = req.body;
      
      if(!_id) error['_id'] = '_id is required.';
      if(!name) error['name'] = 'name is required.';
      if(!url) error['url'] = 'url is required.';
      if([0, 1].indexOf(status) < 0) error['status'] = 'status is required.';
      if(Object.keys(error).length) return resProcess['checkError'](res, error);

      const category = await db.AssetCategory.findOne({ _id: sanitize(_id) });
      if(!category){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }

      let updateInput = {
        name: name,
        url: url,
        order: order? order: 1,
        status: status,
      };
      if(description!==undefined) updateInput['description'] = description;
      if(image!==undefined) updateInput['image'] = image;
      if(gallery!==undefined) updateInput['gallery'] = gallery;
      await category.updateOne(updateInput, []);

      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  assetCategoryDelete : async (req, res) => {
    try {
      var error = {};
      const { _id } = req.body;
      
      if(!_id) error['_id'] = '_id is required.';
      if(Object.keys(error).length) return resProcess['checkError'](res, error);

      const category = await db.AssetCategory.findOne({ _id: sanitize(_id) });
      if(!category){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }

      await category.remove();

      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },

};