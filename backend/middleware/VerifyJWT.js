const jwt = require("jsonwebtoken");
const httpstatuscodes = require("http-status-codes");
const User = require("../models/UserModel");

const verifyJWT = (req, res, next) => {
  const bearertoken = req.headers.Authorization || req.headers.authorization;

  if (!bearertoken || !bearertoken.startsWith("Bearer ")) {
    return res.status(httpstatuscodes.StatusCodes.UNAUTHORIZED).send({
      error: httpstatuscodes.ReasonPhrases.UNAUTHORIZED,
      message: "No token received",
    });
  }

  const jwt_token = bearertoken.split(" ")[1];
  jwt.verify(jwt_token, process.env.JWT_ACCESS_KEY, async (err, decoded) => {
    if (err) {
      return res.status(httpstatuscodes.StatusCodes.FORBIDDEN).send({
        error: httpstatuscodes.ReasonPhrases.FORBIDDEN,
        message: "Invalid token",
      });
    }

    const foundUser = await User.findOne(
      { username: decoded.username },
      { lastname: 1 }
    ).lean();
    if (!foundUser) {
      return res.status(httpstatuscodes.StatusCodes.FORBIDDEN).send({
        error: httpstatuscodes.ReasonPhrases.FORBIDDEN,
        message: "User not found",
      });
    }

    req.user = decoded.username;
    req.roles = decoded.id;
    next();
  });
};

module.exports = verifyJWT;
