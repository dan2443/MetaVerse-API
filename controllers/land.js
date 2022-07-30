const { validationResult } = require("express-validator");

const throwError = require("../errors/throwError");

const Land = require("../models/land");
const User = require("../models/user");

exports.getLands = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const size = req.query.size || 10000;
  let totalItems;
  Land.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Land.find()
        .skip((currentPage - 1) * size)
        .limit(size);
    })
    .then((lands) => {
      res.status(200).json({
        message: "lands fetched.",
        lands: lands,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateLand = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throwError("Validation failed, entered data is incorrect.", 422);
  const landId = req.params.landId;
  const price = req.body.price;
  const isOnSale = req.body.isOnSale;
  const userId = req.userId;
  Land.findById(landId)
    .then((land) => {
      if (!land) throwError("Could not find land by landId.", 404);
      if (land.ownerId != userId)
        throwError(
          "User which is not owner of the land cannot modify it.",
          403
        );
      if (price !== undefined && price <= 0)
        throwError("Cannot set 0 or negative price.", 400);
      land.isOnSale = isOnSale || land.isOnSale;
      land.price = price || land.price;
      return land.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Land updated!", land: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.buyLand = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throwError("Validation failed, entered data is incorrect.", 422);
  const landId = req.params.landId;
  const userId = req.userId;
  Land.findById(landId)
    .then((land) => {
      if (!land) throwError("Could not find land by landId.", 404);
      if (!land.isOnSale)
        throwError("Could not buy land because it is not on sale.", 400);
      if (land.ownerId == userId)
        throwError(
          "Could not buy land because it is already owned by this user.",
          403
        );
      User.findById(userId).then((user) => {
        if (user.money <= land.price)
          throwError("Could not buy land because not enough money.", 400);
        User.findById(land.ownerId)
          .then((owner) => {
            if (!owner) throwError("Current owner not found by ownerId.", 404);
            owner.money += land.price;
            land.ownerId = userId;
            land.ownerName = user.name;
            land.isOnSale = false;
            //land.save();
            //user.lands.push(land)
            user.money -= land.price;
            owner.save();
            user.save();
            return land.save();
          })
          .then((result) => {
            res
              .status(200)
              .json({ message: "Land was bought sucessfully!", land: result });
          });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
