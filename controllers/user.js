const throwError = require("../errors/throwError");
const User = require("../models/user");

exports.getUserDetails = (req, res, next) => {
  const userId = req.userId;
  User.findById(userId)
    .then((user) => {
      if (!user) throwError("Coudn't found user with this userId.", 404);
      res.status(200).json({
        message: "User details found!",
        money: user.money,
        role: user.role,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
