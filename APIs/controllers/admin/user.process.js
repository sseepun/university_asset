const db = require('../../models');
const sanitize = require('mongo-sanitize');
const bcrypt = require('bcryptjs');
const { resProcess, utility } = require('../../helpers');

module.exports = {

  // START: User
  userList : async (req, res) => {
    try {
      const { paginate, dataFilter } = req.body;

      let condition = {};
      if(dataFilter){
        if(dataFilter.keywords){
          condition['$or'] = [
            { firstname: new RegExp(dataFilter.keywords, 'i') },
            { lastname: new RegExp(dataFilter.keywords, 'i') },
            { username: new RegExp(dataFilter.keywords, 'i') },
            { email: new RegExp(dataFilter.keywords, 'i') },
          ];
        }
        if(dataFilter.status || [0, -1].indexOf(dataFilter.status) > -1){
          condition['status'] = dataFilter.status;
        }
        
        if(dataFilter.levels && dataFilter.levels.length){
          let roles = await db.UserRole.find({ level: { $in: dataFilter.levels } }).select('_id');
          if(roles) condition['role'] = roles;
        }
      }

      let sort = utility.cleanSort({ firstname: 1, lastname: 1, createdAt: 1 }, dataFilter);

      let result = [];
      if(!paginate){
        result = await db.User.find(condition)
          .select('-password -fcmToken -refreshToken')
          .populate({ path: 'role' })
          .populate({ path: 'company', select: 'taxId code name image email' })
          .sort(sort); 
      }else{
        result = await db.User.find(condition)
          .select('-password -fcmToken -refreshToken')
          .populate({ path: 'role' })
          .populate({ path: 'company', select: 'taxId code name image email' })
          .sort(sort)
          .skip((paginate.page - 1) * paginate.pp)
          .limit(paginate.pp);
        paginate.total = await db.User.countDocuments(condition);
      }

      return resProcess['200'](res, {
        paginate: paginate? paginate: {},
        dataFilter: dataFilter? dataFilter: {},
        result: result
      });
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  userRead : async (req, res) => {
    try {
      var error = {};
      const { _id, isAdmin } = req.query;
      
      if(!_id) error['_id'] = '_id is required.';
      if(Object.keys(error).length) return resProcess['checkError'](res, error);

      let condition = { _id: sanitize(_id) };
      if(isAdmin){
        let roles = await db.UserRole.find({ level: { $gt: 97 } }).select('_id');
        if(roles) condition['role'] = roles;
        else{
          error['_id'] = 'role is invalid.';
          return resProcess['checkError'](res, error);
        }
      }

      var user = await db.User.findOne(condition)
        .select('-password -fcmToken -refreshToken')
        .populate({ path: 'role' })
        .populate({ path: 'company', select: 'taxId code name image email' });
      if(!user){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }

      return resProcess['200'](res, {
        result: user
      });

    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  userCreate : async (req, res) => {
    try {
      var error = {};
      const { 
        roleLevel, companyId, firstname, lastname, username, email, telephone,
        description, password, confirmPassword, avatar, url, banner, status 
      } = req.body;

      if(!roleLevel) error['roleLevel'] = 'roleLevel is required.';
      if(!username) error['username'] = 'username is required.';
      if(!email) error['email'] = 'email is required.';
      if(!password) error['password'] = 'password is required.';
      else{
        if(password.length < 6) error['password'] = 'password must be at least 6 characters.';
        else if(!(/^(?=.*[0-9]).*$/).test(password)) error['password'] = 'password must contain 0-9 least 1 character.';
        else if(!(/^(?=.*[!@#$&*?%^()]).*$/).test(password)) error['password'] = 'password must contain * ! @ # $ & ? % ^ ( ) at least 1 character.';
      }
      if(!confirmPassword) error['confirmPassword'] = 'confirmPassword is required.';
      if(!status && status!==0) error['status'] = 'status is required.';
      if(Object.keys(error).length) return resProcess['checkError'](res, error);

      if(password !== confirmPassword){
        error['confirmPassword'] = 'password and confirmPassword do not match.';
        return resProcess['checkError'](res, error);
      }
      
      const role = await db.UserRole.findOne({ level: roleLevel }).select('_id');
      if(!role){
        error['roleLevel'] = 'roleLevel is invalid.';
        return resProcess['checkError'](res, error);
      }else if(role.level >= req.user.role.level){
        error['roleLevel'] = 'No permission.';
        return resProcess['checkError'](res, error);
      }

      const duplicateUsername = await db.User.findOne({ username: username });
      if(duplicateUsername){
        error['username'] = 'username is already in use.';
        return resProcess['checkError'](res, error);
      }
      const duplicateEmail = await db.User.findOne({ email: email });
      if(duplicateEmail){
        error['email'] = 'email is already in use.';
        return resProcess['checkError'](res, error);
      }

      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(password, salt);
      let updateInput = {
        role: role,
        username: username,
        email: email,
        password: bcryptPassword,
        status: status
      };
      if(companyId!==undefined) {
        updateInput['companyId'] = null;
        if(companyId) {
          let company = await db.Company.findOne({ _id: sanitize(companyId)});
          if(company) updateInput['company'] = company;
        }
      }
      if(firstname!==undefined) updateInput['firstname'] = firstname;
      if(lastname!==undefined) updateInput['lastname'] = lastname;
      if(telephone!==undefined) updateInput['telephone'] = telephone;
      if(description!==undefined) updateInput['description'] = description;
      if(avatar!==undefined) updateInput['avatar'] = avatar;
      
      if(url!==undefined && role.level == 15) {
        const duplicateUrl = await db.User.findOne({ url: url });
        if(duplicateUrl){
          error['url'] = 'url is already in use.';
          return resProcess['checkError'](res, error);
        } else updateInput['url'] = url;
      }
 
      if(banner!==undefined) updateInput['banner'] = banner;

      await db.User(updateInput).save();

      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  userUpdate : async (req, res) => {
    try {
      var error = {};
      const {
        _id, companyId, firstname, lastname, username, email, telephone,
        description, password, confirmPassword, avatar, url, banner, status
      } = req.body;
      
      if(!_id) error['_id'] = '_id is required.';
      if(!username) error['username'] = 'username is required.';
      if(!email) error['email'] = 'email is required.';
      if(password){
        if(password.length < 6) error['password'] = 'password must be at least 6 characters.';
        else if(!(/^(?=.*[0-9]).*$/).test(password)) error['password'] = 'password must contain 0-9 least 1 character.';
        else if(!(/^(?=.*[!@#$&*?%^()]).*$/).test(password)) error['password'] = 'password must contain * ! @ # $ & ? % ^ ( ) at least 1 character.';
        if(!confirmPassword) error['confirmPassword'] = 'confirmPassword is required.';
        else if(password!==confirmPassword) error['confirmPassword'] = 'password and confirmPassword do not match.';
      }
      if(!status && status!==0) error['status'] = 'status is required.';
      if(Object.keys(error).length) return resProcess['checkError'](res, error);

      if(sanitize(_id) == sanitize(req.user._id)){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }

      const user = await db.User.findById(sanitize(_id))
        .populate('role');
      if(!user){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }else if(user.role && user.role.level >= req.user.role.level){
        error['_id'] = 'No permission.';
        return resProcess['checkError'](res, error);
      }
      
      const duplicateUsername = await db.User.findOne({ username: username, _id: { $ne: sanitize(_id) } }).select('_id');
      if(duplicateUsername){
        error['username'] = 'username is already in use.';
        return resProcess['checkError'](res, error);
      }
      const duplicateEmail = await db.User.findOne({ email: email, _id: { $ne: sanitize(_id) } }).select('_id');
      if(duplicateEmail){
        error['email'] = 'email is already in use.';
        return resProcess['checkError'](res, error);
      }

      let updateInput = {
        username: username,
        email: email,
        status: status
      };
      if(companyId!==undefined) {
        updateInput['companyId'] = null;
        if(companyId) {
          let company = await db.Company.findOne({ _id: sanitize(companyId)});
          if(company) updateInput['company'] = company;
        }
      }
      if(firstname!==undefined) updateInput['firstname'] = firstname;
      if(lastname!==undefined) updateInput['lastname'] = lastname;
      if(telephone!==undefined) updateInput['telephone'] = telephone;
      if(description!==undefined) updateInput['description'] = description;
      if(avatar!==undefined) updateInput['avatar'] = avatar;
      if(password!==undefined){
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);
        updateInput['password'] = bcryptPassword;
      }
      if(url!==undefined && user.role.level == 15) {
        const duplicateUrl = await db.User.findOne({ url: url, _id: { $ne: sanitize(_id) } }).select('_id');
        if(duplicateUrl){
          error['url'] = 'url is already in use.';
          return resProcess['checkError'](res, error);
        } else updateInput['url'] = url;
      }
 
      if(banner!==undefined) updateInput['banner'] = banner;

      await user.updateOne(updateInput, []);

      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  userDelete : async (req, res) => {
    try {
      var error = {};
      const { _id } = req.body;
      
      if(!_id) error['_id'] = '_id is required.';
      if(Object.keys(error).length) return resProcess['checkError'](res, error);

      const user = await db.User.findById(sanitize(_id))
        .populate({ path: 'role' });
      if(!user){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }else if(user.role && user.role.level >= req.user.role.level){
        error['roleLevel'] = 'No permission.';
        return resProcess['checkError'](res, error);
      }

      await user.remove();

      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },

  userUpdateProfile : async (req, res) => {
    try {
      var error = {};
      const { 
        _id, username, email, roleId, status,
        firstname, lastname, avatar
      } = req.body;

      if(!_id) error['_id'] = '_id is required.';
      if(!username) error['username'] = 'username is required.';
      if(!email) error['email'] = 'email is required.';
      if(!roleId) error['roleId'] = 'roleId is required.';
      if(!status && status!==0) error['status'] = 'status is required.';
      else if([-1, 0, 1].indexOf(status) < 0) error['status'] = 'status is invalid.';
      if(Object.keys(error).length) return resProcess['checkError'](res, error);

      if(sanitize(_id) == sanitize(req.user._id)){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }

      const user = await db.User.findById(sanitize(_id))
        .populate('role');
      if(!user){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }else if(!user.role || user.role.level >= req.user.role.level){
        error['_id'] = 'No permission.';
        return resProcess['checkError'](res, error);
      }
      
      const role = await db.UserRole.findById(sanitize(roleId));
      if(!role){
        error['roleId'] = 'roleId is invalid.';
        return resProcess['checkError'](res, error);
      }else if(role.level >= req.user.role.level){
        error['roleId'] = 'No permission.';
        return resProcess['checkError'](res, error);
      }
      
      const duplicateUsername = await db.User.findOne({
        username: username, _id: { $ne: sanitize(_id) }
      });
      if(duplicateUsername){
        error['username'] = 'username is already in use.';
        return resProcess['checkError'](res, error);
      }
      const duplicateEmail = await db.User.findOne({
        email: email, _id: { $ne: sanitize(_id) }
      });
      if(duplicateEmail){
        error['email'] = 'email is already in use.';
        return resProcess['checkError'](res, error);
      }

      var updateInput = {
        role: role,
        username: username,
        email: email,
        status: status
      };
      if(firstname!==undefined) updateInput['firstname'] = firstname;
      if(lastname!==undefined) updateInput['lastname'] = lastname;
      if(avatar!==undefined && typeof avatar==='object') updateInput['avatar'] = avatar;
      await db.User.findOneAndUpdate({ _id: sanitize(_id) }, updateInput);

      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  userUpdatePassword : async (req, res) => {
    try {
      var error = {};
      const { _id, password, newPassword, confirmNewPassword } = req.body;

      if(!_id) error['_id'] = '_id is required.';
      if(!password) error['password'] = 'password is required.';
      if(!newPassword) error['newPassword'] = 'newPassword is required.';
      if(!confirmNewPassword) error['confirmNewPassword'] = 'confirmNewPassword is required.';
      else{
        if(newPassword.length < 6) error['newPassword'] = 'newPassword must be at least 6 characters.';
        else if(!(/^(?=.*[0-9]).*$/).test(newPassword)) error['newPassword'] = 'newPassword must contain 0-9 least 1 character.';
        else if(!(/^(?=.*[!@#$&*?%^()]).*$/).test(newPassword)) error['newPassword'] = 'newPassword must contain * ! @ # $ & ? % ^ ( ) at least 1 character.';
      }
      if(Object.keys(error).length) return resProcess['checkError'](res, error);

      if(newPassword!==confirmNewPassword){
        error['confirmNewPassword'] = 'newPassword and confirmNewPassword do not match.';
        return resProcess['checkError'](res, error);
      }

      if(sanitize(_id) == sanitize(req.user._id)){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }

      const user = await db.User.findById(sanitize(_id))
        .populate('role');
      if(!user){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }else if(!user.role || user.role.level >= req.user.role.level){
        error['_id'] = 'No permission.';
        return resProcess['checkError'](res, error);
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if(!validPassword){
        error['password'] = 'password is invalid.';
        return resProcess['checkError'](res, error);
      }

      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(newPassword, salt);
      await db.User.findOneAndUpdate(
        { _id: sanitize(_id) }, { password: bcryptPassword }
      );

      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },

  roleList : async (req, res) => {
    try {
      const { paginate } = req.body;
      var result = [];
      result = await db.UserRole.find()
        .sort({ level: 1 });
      return resProcess['200'](res, {
        paginate: paginate? true: false,
        result: result
      });
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  roleRead : async (req, res) => {
    try {
      var error = {};
      const { _id } = req.query;
      
      if(!_id) error['_id'] = '_id is required.';
      if(Object.keys(error).length) return resProcess['checkError'](res, error);
      
      const role = await db.UserRole.findOne({ _id: sanitize(_id) });
      if(!role){
        error['_id'] = '_id is invalid.';
        return resProcess['checkError'](res, error);
      }

      return resProcess['200'](res, {
        result: role
      });
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  // END: User

};