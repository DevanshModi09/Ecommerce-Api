const User = require('../models/user.js');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const jwt = require('jsonwebtoken');
const { createJWT, isTokenValid } = require('../utils/index.js');

const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    throw new CustomError.BadRequestError(
      'Please all fields : email , password and name',
    );
  }
  const isEmailAlreadyExists = await User.findOne({ email });
  if (isEmailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }
  const user = await User.create({ email, password, name });
  const tokenUser = { name: user.name, userId: user._id, role: user.role };
  const token = createJWT({ payload: tokenUser });
  res.status(StatusCodes.CREATED).json({ user: tokenUser, token });
};
const login = async (req, res) => {};
const logout = async (req, res) => {};

module.exports = {
  register,
  login,
  logout,
};
