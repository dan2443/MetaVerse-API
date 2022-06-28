const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    money: {
      type: Number,
      default: 0,
    },
    // land: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Land",
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
