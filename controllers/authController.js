const User = require('../models/user.js');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const {
  attachCookiesToResponse,
  createTokenUser,
} = require('../utils/index.js');

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
  const tokenUser = createTokenUser(user);

  //Attaching the cookie here (not sending the response)
  attachCookiesToResponse({ res, tokenUser });
  //Sending the response here
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials ');
  }

  const isPasswordCorrect = await user.comparePasswords(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials ');
  }
  const tokenUser = createTokenUser(user);

  //Attaching the cookie here (not sending the response)
  attachCookiesToResponse({ res, tokenUser });
  //Sending the response here
  res
    .status(StatusCodes.OK)
    .json({ user: tokenUser, message: 'User Logged In' });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};

module.exports = {
  register,
  login,
  logout,
};
