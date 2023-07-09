const util = require('util');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const resProcess = require('../helpers/res-process');

require('dotenv').config();


// Upload Service
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const random = Math.round(Math.random() * 10**7).toFixed(0);
    const fileName = `${req.params.folder? req.params.folder: 'uploads'}/file-${Date.now()}-${random}${path.extname(file.originalname)}`;
    cb(null, fileName)
  },
});

const uploadSingle = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if(file.mimetype && ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf'].indexOf(file.mimetype) > -1) {
      cb(null, true);
    } else {
      cb(null, false);
      req.validationError = true;
      return cb(null, false, 'Forbidden file extension.');
    }
  }
}).single('file');
const UploadSingleService = util.promisify(uploadSingle);

const uploadMultiple = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if(file.mimetype && ['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.mimetype) > -1) {
      cb(null, true);
    } else {
      cb(null, false);
      req.validationError = true;
      return cb(null, false, 'Forbidden file extension.');
    }
  }
}).array('files', 10);
const UploadMultipleService = util.promisify(uploadMultiple);


exports.fileUpload = async (req, res) => {
  try {
    var error = {};
    await UploadSingleService(req, res);
    
    if(req.validationError){
      error['file'] = 'file extension is invalid.';
      return resProcess['checkError'](res, error);
    }else if(!req.file){
      error['file'] = 'file is required.';
      return resProcess['checkError'](res, error);
    }

    let filename = req.file.filename;
    if(req.params.resize){
      let resize = parseInt(req.params.resize);
      filename = '';
      let names = req.file.filename.split('/');
      names.forEach((d, i) => {
        if(i == names.length-1) filename += `resized-${d}`;
        else filename += `${d}/`;
      });
      await sharp(req.file.path)
        .rotate()
        .resize(resize)
        .jpeg({ mozjpeg: true })
        .toFile(path.resolve(req.file.destination, filename));
      fs.unlinkSync(req.file.path);
    }

    return resProcess['200'](res, {
      file: {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        filename: filename,
        size: req.file.size,
        path: `${process.env.SERVER_URL}${filename}`
      }
    });
  } catch(err) {
    console.log(err)
    return resProcess['500'](res, err);
  };
};
exports.fileDelete = async (req, res) => {
	try {
    var error = {};
    const { file } = req.body;
    
    if(file === undefined){
      error['file'] = 'file is required.';
      return resProcess['checkError'](res, error);
    }

    if(file.indexOf(process.env.SERVER_URL) > -1){
      let path = file.replace(process.env.SERVER_URL, '');
      try {
        fs.unlinkSync(`public/${path}`);
      } catch (err) {
        console.log(`Failed to delete: ${path} does not exists.`);
      }
    }
    return resProcess['200'](res);
	} catch (err) {
    return resProcess['500'](res, err);
	}
};

exports.filesUpload = async (req, res) => {
  try {
    var error = {};
    await UploadMultipleService(req, res);
    
    if(req.validationError){
      error['files'] = 'files extension is invalid.';
      return resProcess['checkError'](res, error);
    }else if(!req.files || !req.files.length){
      error['files'] = 'files is required.';
      return resProcess['checkError'](res, error);
    }

    return resProcess['200'](res, {
      files: req.files.map(file => {
        return {
          originalname: file.originalname,
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size,
          path: `${process.env.SERVER_URL}${file.filename}`
        };
      })
    });
  } catch(err) {
    return resProcess['500'](res, err);
  };
};
exports.filesDelete = async (req, res) => {
	try {
    var error = {};
    const { files } = req.body;
    
    if(files === undefined){
      error['files'] = 'files is required.';
      return resProcess['checkError'](res, error);
    }else if(typeof files !== 'object'){
      error['files'] = 'files must be an array.';
      return resProcess['checkError'](res, error);
    }

		files.forEach(file => {
			if(file.indexOf(process.env.SERVER_URL) > -1){
				let path = file.replace(process.env.SERVER_URL, '');
				try {
					fs.unlinkSync(`public/${path}`);
				} catch (err) {
					console.log(`Failed to delete: ${path} does not exists.`);
				}
			}
		});
    return resProcess['200'](res);
	} catch (err) {
    return resProcess['500'](res, err);
	}
};
