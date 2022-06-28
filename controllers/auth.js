const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const throwError = require("../errors/throwError");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throwError("Validation failed.", 422);
  const username = req.body.username;
  const name = req.body.name;
  const password = req.body.password;
  const role = req.body.role;
  let money;
  if (role === "BUSINESS") money = 1000;
  else if (role === "GUEST") money = 0;
  else throwError("Role field can be BUSINESS and GUEST only.", 400);
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        username: username,
        password: hashedPw,
        name: name,
        role: role,
        money: money,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ username: username })
    .then((user) => {
      if (!user)
        throwError("A user with this username could not be found.", 404);
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) throwError("Wrong password!", 401);
      const token = jwt.sign(
        {
          username: loadedUser.username,
          userRole: loadedUser.role,
          userId: loadedUser._id.toString(),
        },
        "DanAndZoharProjectsSecret",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
