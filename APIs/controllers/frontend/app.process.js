const db = require('../../models');
const sanitize = require('mongo-sanitize');
const path = require('path');
const { resProcess } = require('../../helpers');


module.exports = {
  
  settingsRead : async (req, res) => {
    try {
      let settings = {};
      const tempSettings = await db.Setting.find({}).select('name value');
      tempSettings.map(d => d._doc).forEach(d => settings[d.name] = d.value);
      return resProcess['200'](res, {
        result: settings
      });
    } catch(err) {
      console.log(err)
      return resProcess['500'](res, err);
    }
  },

  download : async (req, res) => {
    try {
      const fileName = req.params.fileName;
      const filePath = path.join(__dirname, `../../public/export/${fileName}`);
      res.download(filePath, fileName, (err) => {
        if(err) resProcess['500'](res, err);
      });
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },

};