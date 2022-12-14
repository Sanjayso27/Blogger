const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { v4 } = require("uuid");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  // projection
  // for getting all the items without the password key
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("couldn't get all users", 500));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// by default none of the file in our server is available from outside
// every request will go through a funnel of middleware functions
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  // 1.Create real image url and link to user
  // 2.Also roll back  the creation of the filee if we have validation error for example
  if (!errors.isEmpty()) {
    return next(new HttpError("Provided data is invalid,Please check!", 422));
  }

  // multer will provide us the text part of the body of our requests
  const { name, email, password } = req.body;

  let existingUser;
  try {
    // find the document having email key
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Signup Failed.Try again later !"), 500);
  }
  if (existingUser) {
    return next(new HttpError("User already exist.Signup Failed!", 422));
  }
  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    // we will keep password as of now,later we will encrypt the password now
    password,
    blogs: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError("Couldn't Signup!", 500));
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    // find the document having email key
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Logging In Failed.Try again later !"), 500);
  }
  if (!existingUser || existingUser.password !== password) {
    return next(new HttpError("Authentication Failed!", 401));
  }
  res.json({
    message: "Logged In!",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
