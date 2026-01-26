const data = require("../data");
const User =require("../models/userModel")

const seedUser = async(req,res,next)=>{
  try{
    //deleteing all users
    await User.deleteMany({})
    
    //instering new users
    const users = await User.insertMany(data.users);

    // sucessfull response
    return res.status(201).json(users);
  }catch(error){
    next(error);
  }
}
module.exports ={seedUser}