const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const landSchema = new Schema(
  {
    ownerId: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    x_coordinate: {
      type: Number,
      required: true,
    },
    y_coordinate: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Land", landSchema);
