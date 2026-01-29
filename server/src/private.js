
require('dotenv').config();
const serverPort = process.env.SERVER_PORT || 3002;
const mongodbUrl = process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/ecommerceMERNDB';
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/default.svg'

const jwtactivationKey = process.env.JWT_ACTIVATION_KEY || 'yuidfkshdfuih98240kJKGHJaeG'
const smtpUserName =process.env.SMTP_USRERNAME||''
const smtpPassword =process.env.SMTP_PASSWORD||''
const clientURL =process.env.CLIENT_URL||''
module.exports= {
  serverPort,
  mongodbUrl,
  defaultImagePath,
  jwtactivationKey,
  smtpUserName,
  smtpPassword,
  clientURL,
}