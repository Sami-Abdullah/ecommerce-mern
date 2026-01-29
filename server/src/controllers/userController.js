const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const fs = require('fs').promises
const User = require('../models/userModel');
const { sucessResponse } = require('./responseController');

const { findWithId } = require('../services/findItem');
const deleteImg = require('../helper/deleteImg');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtactivationKey, clientURL } = require('../private');
const emailWithNodeMailer = require('../helper/email');
const { decode } = require('punycode');



const getUsers = async (req, res, next) => {
  try {

    const search = req.query.search || ""
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp('.*' + search + ".*", "i")

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ]
    }

    const options = { password: 0 }
    const users = await User.find(filter, options).limit(limit).skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "no users found")


    return sucessResponse(res, {
      statusCode: 200,
      message: 'users were returned sucessfully',
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          previousPage: page + 1 > Math.ceil(count / limit) ? page + 1 : null
        }
      }

    })
  } catch (error) {
    next(error)
  }
}

const getUserById = async (req, res, next) => {
  try {

    const id = req.params.id;
    const options = { password: 0 }
    const user = await findWithId(User, id, options);
    return sucessResponse(res, {
      statusCode: 200,
      message: 'user were returned sucessfully',
      payload: {
        user,
      }

    })
  } catch (error) {

    next(error)
  }
}


const deleteUserById = async (req, res, next) => {
  try {

    const id = req.params.id;
    const options = { password: 0 }
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;
    deleteImg(userImagePath)
    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false
    })


    return sucessResponse(res, {
      statusCode: 200,
      message: 'user were deleted sucessfully',


    })
  } catch (error) {

    next(error)
  }
}
const processRegister = async (req, res, next) => {
  try {

    const { name, email, password, phone, address, image} = req.body

    const userExists = await User.exists({ email: email })
    if (userExists) {
      throw createError(409, 'email already exist,please sign in')
    }
    if (!req.body || !req.body.email) {
      throw createError(400, 'Email is required to process registration');
    }
    const token = createJSONWebToken({ name, email, password, phone, address }, jwtactivationKey, '10m')

    const emailData = {
      email,
      subject: 'Account Activation Email',
      html: `
        <h2>Hello${name}</h2>  
        <p>Please click here <a href="${clientURL}/api/users/activate/${token} target ="_blank">activate your account</a></p>
      `
    }

    try {
      await emailWithNodeMailer(emailData)

    } catch (emailError) {
      next(createError(500, 'failed to send verification email'))
      return
    }
    return sucessResponse(res, {
      statusCode: 200,
      message: `please go to your email:${emailData.email} to compelete the verification`,
      payload: {
        token
      }

    })
  } catch (error) {

    next(error)
  }
}
const activateUserAccount = async (req, res, next) => {
  try {

    const token = req.body.token;
    if (!token) {
      throw createError(404, 'token not found')
    }
    try {
      const decoded = jwt.verify(token, jwtactivationKey)
      if (!decoded) {
        throw createError(401, 'unable to verify user')
      }
      const userExists = await User.exists({ email: decoded.email })
      if (userExists) {
        throw createError(409, 'email already exist,please sign in')
      }

      await User.create(decoded)
      return sucessResponse(res, {
        statusCode: 201,
        message: `User was registered successfully`,

      })
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw createError(401, 'Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw createError(401, 'invalid token');
      } else {
        throw error
      }
    }

  } catch (error) {

    next(error)
  }
}
module.exports = { getUsers, getUserById, deleteUserById, processRegister, activateUserAccount }