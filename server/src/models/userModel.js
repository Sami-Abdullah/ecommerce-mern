const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');
const { defaultImagePath } = require("../private");

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    minlength: [3, 'User name can be minmum 3 characters'],
    maxlength: [31, 'User name can be maximum 31 characters']
  },
  email: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'User password is required'],
    minlength: [6, 'User password can be minmum 6 characters'],
    set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
  },
  image: {
    type: String,
    default: defaultImagePath
  },
  address: {
    type: String,
    required: [true, 'User address is required'],
  },
  phone: {
    type: String,
    required: [true, 'User phone is required'],
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const User =model('User',userSchema);
module.exports = User