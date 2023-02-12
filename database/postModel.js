const mongoose = require("mongoose");
const { UserModel } = require("./userModel");

const PostSchema = new mongoose.Schema(
  {
    postImage: {
      type: String,
    },
    postDescription: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model("Post", PostSchema);

module.exports = {
  PostModel,
};
