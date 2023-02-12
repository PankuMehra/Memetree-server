const express = require("express");
const {
  register,
  login,
  getProfile,
  patchUserFollow,
} = require("../controllers/user.controllers");
const { authorization } = require("../middleware/authorization");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const body = req.body;
  try {
    const user = await register(body);
    return res.send({
      data: {
        user,
      },
    });
  } catch (error) {
    if (error.message == "This email is already exist") {
      return res.status(400).send({
        data: error.message,
      });
    } else {
      return res.status(500).send({
        data: "Something went wrong",
      });
    }
  }
});

userRouter.post("/login", async (req, res) => {
  const body = req.body;

  try {
    const tokenData = await login(body);
    return res.send({
      tokenData,
    });
  } catch (error) {
    if (
      error.message == "This email is not registered" ||
      error.message == "Incorrect Password"
    ) {
      return res.status(400).send({
        data: error.message,
      });
    } else {
      return res.status(500).send({
        data: "Something went wrong",
      });
    }
  }
});

userRouter.get("/get-profile/:id", authorization, async (req, res) => {
  let userId = req.params.id;
  try {
    const data = await getProfile(userId);
    return res.send({
      data: data,
    });
  } catch (error) {
    if (
      error.message == "User does not exist"
    ) {
      return res.status(400).send({
        data: error.message,
      });
    } else {
      return res.status(500).send({
        data: "Something went wrong",
      });
    }
    // if (error.message == "User does not exist") {
    //   return res.status(400).send({
    //     data: error.message,
    //   });
    // } else {
    //   return res.status(500).send({
    //     data: "Something went wrong",
    //   });
    // }
  }
});

userRouter.get("/get-loggedIn-user", authorization, async (req, res) => {
  try {
    return res.send({
      data: req.user,
    });
  } catch (error) {
    return res.status(500).send({
      data: error.message,
    });
  }
});

userRouter.patch("/patch-follow", authorization, async (req, res) => {
  const userId = req.user._id;
  const patchData = req.body;
  const followingId = patchData.followingId;

  try {
    const updatedUser = patchUserFollow(userId, followingId, patchData);
    return res.send({
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).send({
      data: error.message,
    });
  }
});

module.exports = {
  userRouter,
};
