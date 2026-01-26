const mongoose = require("mongoose");
const { mongodbUrl } = require("../private");

const connectDatabse = async (options={}) => {
  try {
    await mongoose.connect(mongodbUrl,options);
    console.log('connected to mongodb')
    mongoose.connection.on('error', (error) => {
      console.error('db connection error:', error)
    });
  } catch (error) {
    console.error('could not connect to DB',error.toString());
  }
};
module.exports = connectDatabse