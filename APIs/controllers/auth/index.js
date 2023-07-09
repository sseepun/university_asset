const config = require('../../config');
const db = require('../../models');
const sanitize = require('mongo-sanitize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const { resProcess } = require('../../helpers');


var smtp = {
  host: config.smtpHost,
  port: Number(config.smtpPort),
  secure: false,
  auth: {
    user: config.smtpUsername,
    pass: config.smtpPassword
  }
};
var smtpConn = mailer.createTransport(smtp);

var readFileHTML = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function(err, html) {
    if(err) return callback(err);
    else return callback(null, html);
  });
};


module.exports = {

	signin : async (req, res) => {
		try {
			var error = {};
			const { username, password } = req.body;

			if(!username) error['username'] = 'username is required.';
			if(!password) error['password'] = 'password is required.';
			if(Object.keys(error).length) return resProcess['checkError'](res, error);

			const user = await db.User
				.findOne({ $or: [ { username: username }, { email: username }, ] })
				.populate({ path: 'role' })
				.populate({ path: 'company', select: 'taxId code name image email' });
			if(!user){
				error['username'] = 'Account associated with your credential is not found.';
				return resProcess['checkError'](res, error);
			}else if(user.status != 1){
				if(user.status == 0) error['username'] = 'Your account has not been activated.';
				else if(user.status == -1) error['username'] = 'We are processing to delete your account within 24 hours.';
				else error['username'] = 'Your account has been blocked.';
				return resProcess['checkError'](res, error);
			}

			const validPassword = await bcrypt.compare(password, user.password);
			if(!validPassword){
				error['username'] = 'Account associated with your credential is not found.';
				return resProcess['checkError'](res, error);
			}
			
			const accessToken = jwt.sign(
				{ _id: user._id }, 
				config.tokenSecret, 
				{ expiresIn: config.tokenLife }
			);
			const refreshToken = jwt.sign(
				{ _id: user._id }, 
				config.tokenRefreshSecret, 
				{ expiresIn: config.tokenRefreshLife }
			);
			await user.updateOne({ refreshToken: refreshToken }, []);

			return resProcess['200'](res, {
				accessToken: accessToken,
				refreshToken: refreshToken,
				user: user,
			});
		} catch (err) {
			return resProcess['500'](res, err);
		}
	},
	refresh : async (req, res) => {
		try {
			var error = {};
			const { refreshToken } = req.body;
			
			if(!refreshToken) error['refreshToken'] = 'refreshToken is required.';
			if(Object.keys(error).length) return resProcess['checkError'](res, error);

			jwt.verify(refreshToken, config.tokenRefreshSecret, async (err, decodedToken) => {
				if(err){
					error['refreshToken'] = 'refreshToken is invalid.';
					return resProcess['checkError'](res, error);
				}

				const user = await db.User.findOne({ _id: sanitize(decodedToken._id), refreshToken: refreshToken })
					.populate({ path: 'role' })
					.populate({ path: 'subjects' });
				if(!user){
					error['refreshToken'] = 'refreshToken is invalid.';
					return resProcess['checkError'](res, error);
				}
					
				const accessToken = jwt.sign(
					{ _id: user._id }, 
					config.tokenSecret, 
					{ expiresIn: config.tokenLife }
				);
				const newRefreshToken = jwt.sign(
					{ _id: user._id }, 
					config.tokenRefreshSecret, 
					{ expiresIn: config.tokenRefreshLife }
				);
				await user.updateOne({refreshToken: newRefreshToken}, []);

				return resProcess['200'](res, {
					accessToken: accessToken,
					refreshToken: newRefreshToken,
					user: {
						_id: user._id,
						role: user.role,
						firstname: user.firstname,
						lastname: user.lastname,
						username: user.username,
						email: user.email,
						avatar: user.avatar,
						status: user.status,
						subjects: user.subjects,
						isMainTeacher: user.isMainTeacher,
					}
				});
			});
		} catch (err) {
			return resProcess['500'](res, err);
		}
	},

	forgetPassword : async (req, res) => {
		try {
			var error = {};
			const { email } = req.body;
			
			if(!email) error['email'] = 'email is required.';
			if(Object.keys(error).length) return resProcess['checkError'](res, error);

			const user = await db.User.findOne({ email: email });
			if(!user){
				error['email'] = 'Account associated with this email is not found.';
				return resProcess['checkError'](res, error);
			}

			const resetToken = Buffer.from(Math.random().toString()).toString('base64').substr(0, 32);
			const temp = await db.UserTemp({
				action: 'RESET PASSWORD', user: user, token: resetToken
			}).save();
			
			// Send Email
			readFileHTML(path.join(__dirname, '../emails/forget-password.html'), function(err, html){
				if(err) console.log(err);
				var template = handlebars.compile(html);
				var mail = {
					from: config.emailFrom,
					to: req.body.email,
					subject: 'ตั้งรหัสผ่านใหม่ในระบบ NIDA Platform', 
					html: template({
						FRONTEND_URL: config.frontendUrl,
						VERIFY_URL: `${config.frontendUrl}auth/reset-password/${temp.token}`
					})
				};
				smtpConn.sendMail(mail, function(err) {
					smtpConn.close();
					if(err) console.log(err);
				});
			});
				
			return resProcess['200'](res, {
				resetToken: resetToken,
			});
		} catch (err) {
			return resProcess['500'](res, err);
		}
	},
	checkResetToken : async (req, res) => {
		try {
			var error = {};
			const { resetToken } = req.query;
			
			if(!resetToken) error['resetToken'] = 'resetToken is required.';
			if(Object.keys(error).length) return resProcess['checkError'](res, error);
			
			const temp = await db.UserTemp.findOne({
				action: 'RESET PASSWORD', token: resetToken, isUsed: 0
			});
			if(!temp){
				error['resetToken'] = 'resetToken is invalid.';
				return resProcess['checkError'](res, error);
			}

			return resProcess['200'](res);
		} catch (err) {
			return resProcess['500'](res, err);
		}
	},
	resetPassword : async (req, res) => {
		try {
			var error = {};
			const { resetToken, newPassword, confirmNewPassword } = req.body;
			
			if(!resetToken) error['resetToken'] = 'resetToken is required.';
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
			
			const temp = await db.UserTemp.findOne({
				action: 'RESET PASSWORD', token: resetToken, isUsed: 0
			});
			if(!temp){
				error['resetToken'] = 'resetToken is invalid.';
				return resProcess['checkError'](res, error);
			}

			const user = await db.User.findById(sanitize(temp.user));
			if(!user){
				error['resetToken'] = 'resetToken is invalid.';
				return resProcess['checkError'](res, error);
			}

			const salt = await bcrypt.genSalt(10);
			const password = await bcrypt.hash(newPassword, salt);
			user.salt = salt;
			user.password = password;
			user.save();

			temp.isUsed = 1;
			temp.save();

			return resProcess['200'](res);
		} catch (err) {
			return resProcess['500'](res, err);
		}
	},

};
