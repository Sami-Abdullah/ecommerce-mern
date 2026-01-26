
require('dotenv').config();
const serverPort = process.env.SERVER_PORT || 3002;
const mongodbUrl = process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/ecommerceMERNDB';
const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || 'public/images/users/default.svg'
module.exports= {
  serverPort,
  mongodbUrl,
  defaultImagePath
}