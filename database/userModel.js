const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      require: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // defaultImage: {
    //   type: String,
    //   default: "https://i.ibb.co/vZ78hbt/default-profile.jpg"
    // },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = {
  UserModel,
};
