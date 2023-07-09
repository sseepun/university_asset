const mongoose = require('mongoose');
const sanitizerPlugin = require('mongoose-sanitizer-plugin');

/*
  status :
    -1 = Request to delete
    0  = Inactive
    1  = Active
*/

const User = mongoose.model(
  'user',
  new mongoose.Schema({
    type: { type: String, default: '' },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user_role',
      required: true
    },
    
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telephone: { type: String, default: '' },
    description: { type: String, default: '' },
    
    avatar: { type: Object, default: null },

    apple: { type: String, default: null },
    facebook: { type: String, default: null },
    google: { type: String, default: null },
    line: { type: String, default: null },

    fcmToken: { type: String, default: '' },
    refreshToken: { type: String, default: '' },

    nickname: { type: String, default: '' },
    socialId: { type: String, default: '' },
    birthDate: { type: Date, default: null },
    gender: { type: Number, default: 0 },
    
    isConsent: { type: Number, default: 0 },
    consentDate: { type: Date, default: null },
    isPrivacy: { type: Number, default: 0 },
    privacyDate: { type: Date, default: null },

    status: { type: Number, default: 0 },
  }, { timestamps: true }).plugin(sanitizerPlugin)
);

module.exports = User;