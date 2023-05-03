const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 30,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "subscriber",
    },
    profilePicture: { type: Buffer }
  },
  { timestamps: true }
);

const User = model("User", userSchema);
module.exports = User;
