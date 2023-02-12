const jwt = require("jsonwebtoken");
const config = require("../config");

const authorization = async (req, res, next) => {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ").pop();    
    try {
      if (token) {
        jwt.verify(token, config.JWT_SECRET_KEY);
        const user = jwt.decode(token);
        req.user = user;
        next();
      }
    } catch (error) {
      return res.status(400).send({
        error: "Invalid token provided",
      });
    }
  } else {
    return res.status(400).send({
      error: "No token provided",
    });
  }
};

module.exports = {
  authorization,
};
