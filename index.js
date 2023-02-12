const express = require("express");
const cors = require("cors");
const connect = require("./database/connect");
const { userRouter } = require("./routes/user.routes");
const { postRouter } = require("./routes/post.routes");
const { commentRouter } = require("./routes/comment.routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/", userRouter);
app.use("/", postRouter);
app.use("/", commentRouter);

connect()
  .then(() => {
    app.listen(3005, () => {
      console.log("Server is running at port no. 3005");
    });
  })
  .catch((err) => {
    console.log("Database connection failed");
  });
