const db = require('../../models');
const sanitize = require('mongo-sanitize');
const bcrypt = require('bcryptjs');
const { resProcess, formater } = require('../../helpers');


module.exports = {
  
  signout : async (req, res) => {
    try {
      await db.User.findOneAndUpdate(
        { _id: sanitize(req.user._id) }, { refreshToken: '', fcmToken: '' }
      );
      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  verifySignIn : async (req, res) => {
    try {
      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },

  fcmTokenUpdate : async (req, res) => {
    try {
      const { fcmToken } = req.body;
      await db.User.findOneAndUpdate(
        { _id: sanitize(req.user._id) }, { fcmToken: fcmToken? fcmToken: '' }
      );
      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },

  accountRead : async (req, res) => {
    try {
      return resProcess['200'](res, {
        result: {
          _id: req.user._id,
          firstname: req.user.firstname,
          lastname: req.user.lastname,
          username: req.user.username,
          email: req.user.email,
          avatar: req.user.avatar,
          apple: req.user.apple,
          facebook: req.user.facebook,
          google: req.user.google,
          line: req.user.line,
          telephone: req.user.telephone,
          nickname: req.user.nickname,
          birthDate: req.user.birthDate,
          gender: req.user.gender,
          isConsent: req.user.isConsent,
          consentDate: req.user.consentDate,
          isPrivacy: req.user.isPrivacy,
          privacyDate: req.user.privacyDate,
          status: req.user.status,
          createdAt: req.user.createdAt,
          updatedAt: req.user.updatedAt,
        }
      });
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  accountUpdate : async (req, res) => {
    try {
      var error = {};
      const { firstname, lastname, username, telephone, email, nickname, gender, avatar } = req.body;

      if(!firstname) error['firstname'] = 'firstname is required.';
      if(!lastname) error['lastname'] = 'lastname is required.';
      if(!username) error['username'] = 'username is required.';
      if(!email) error['email'] = 'email is required.';
      if(Object.keys(error).length) return resProcess['checkError'](res, error);
      
      const duplicateUsername = await db.User.findOne({
        username: username, _id: { $ne: sanitize(req.user._id) }
      }).select('_id');
      if(duplicateUsername){
        error['username'] = 'username is already in use.';
        return resProcess['checkError'](res, error);
      }
      const duplicateEmail = await db.User.findOne({
        email: email, _id: { $ne: sanitize(req.user._id) }
      }).select('_id');
      if(duplicateEmail){
        error['email'] = 'email is already in use.';
        return resProcess['checkError'](res, error);
      }

      let updateInput = {
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email
      };
      if(telephone!==undefined) {
        const cleanTelephone = formater.cleanTelephone(telephone);
        const duplicateTelephone = await db.User
          .findOne({ telephone: cleanTelephone, _id: { $ne: sanitize(req.user._id) } }).select('_id');
        if(duplicateTelephone){
          error['telephone'] = 'telephone is already in use.';
          return resProcess['checkError'](res, error);
        }
        updateInput['telephone'] = cleanTelephone;
      }
      if(nickname!==undefined) updateInput['nickname'] = nickname;
      if(email!==undefined) updateInput['email'] = email;
      if(nickname!==undefined) updateInput['nickname'] = nickname;
      if(gender!==undefined) updateInput['gender'] = gender;
      if(avatar!==undefined) updateInput['avatar'] = avatar;
      await req.user.updateOne(updateInput, []);

      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },
  passwordUpdate : async (req, res) => {
    try {
      var error = {};
      const { oldPassword, newPassword, confirmNewPassword } = req.body;

      if(!oldPassword) error['oldPassword'] = 'oldPassword is required.';
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

      const validPassword = await bcrypt.compare(oldPassword, req.user.password);
      if(!validPassword){
        error['oldPassword'] = 'oldPassword is invalid.';
        return resProcess['checkError'](res, error);
      }

      const salt = await bcrypt.genSalt(10);
      const bcryptPassword = await bcrypt.hash(newPassword, salt);
      await req.user.updateOne({ password: bcryptPassword }, []);

      return resProcess['200'](res);
    } catch(err) {
      return resProcess['500'](res, err);
    }
  },

};