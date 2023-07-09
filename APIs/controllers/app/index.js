const db = require('../../models');
const { resProcess } = require('../../helpers');


module.exports = {

  settingList : async (req, res) => {
    try {
      const settings = await db.Setting.find();
      return resProcess['200'](res, {
        result: settings
      });
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },

};