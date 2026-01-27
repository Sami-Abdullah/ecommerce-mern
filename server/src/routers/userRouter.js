const express = require('express');
const { getUsers, getUserById, deleteUserById, processRegister } = require('../controllers/userController');

const userRouter = express.Router();



userRouter.get('/', getUsers);
userRouter.get('/process-register', processRegister);
userRouter.get('/:id', getUserById);
userRouter.delete('/:id', deleteUserById);

module.exports = userRouter;

