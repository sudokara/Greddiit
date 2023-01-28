const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const httpstatuscodes = require("http-status-codes");
const UserModel = require("../models/UserModel");

const login = async (req, res) => {
  if (process.env.MODE === "dev") {
    console.log("Login attempt");
  }
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
      message: "Please fill required fields",
      error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
    });
  }

  //!
  // Find the user
  const foundUser = await UserModel.findOne({ username: username }).exec();
  if (!foundUser) {
    console.log("Invalid login attempt");
    return res.status(httpstatuscodes.StatusCodes.UNAUTHORIZED).send({
      error: httpstatuscodes.ReasonPhrases.UNAUTHORIZED,
      message: "Incorrect username or password",
    });
  }

  // Verify Password
  const valid = await bcrypt.compare(password, foundUser.password);
  //!

  // Invalid password
  if (!valid) {
    console.log("Invalid login attempt");
    return res.status(httpstatuscodes.StatusCodes.UNAUTHORIZED).send({
      error: httpstatuscodes.ReasonPhrases.UNAUTHORIZED,
      message: "Incorrect username or password",
    });
  }

  //! update fields
  // User has now been verified, issue them an access and refresh token
  const accessJWT = jwt.sign(
    {
      username: req.body.username,
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRY_TIME,
    }
  );

  const refreshJWT = jwt.sign(
    {
      username: req.body.username,
    },
    process.env.JWT_REFRESH_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRY_TIME,
    }
  );

  // Send the refresh JWT as a cookie
  res.cookie("Greddiijwt", refreshJWT, {
    httpOnly: true,
    //! secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, //!
  });

  // Send the access JWT in response
  res.send({ accessJWT });
};

const register = async (req, res) => {
  if (process.env.MODE === "dev") {
    console.log("Register attempt");
  }

  //! get all fields
  const properties = ["username", "password"];
  const hasAllProps = properties.every((item) => req.body.hasOwnProperty(item));

  if (!hasAllProps) {
    return res.status(httpstatuscodes.StatusCodes.BAD_REQUEST).send({
      message: "Please fill required fields",
      error: httpstatuscodes.ReasonPhrases.BAD_REQUEST,
    });
  }

  //! handle all fields
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      return res
        .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
        .send({
          error: err,
          message: "Could not hash password",
        });
    }

    const newUser = new UserModel({
      username: req.body.username,
      password: hashedPassword,
    });

    newUser.save((err, doc) => {
      if (err) {
        console.error(err);
        return res
          .status(httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR)
          .send({
            error: err,
            message: "Could not save user",
          });
      }
    });
  });

  //! update fields
  // User has now been verified, issue them an access and refresh token
  const accessJWT = jwt.sign(
    {
      username: req.body.username,
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRY_TIME,
    }
  );

  const refreshJWT = jwt.sign(
    {
      username: req.body.username,
    },
    process.env.JWT_REFRESH_KEY,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRY_TIME,
    }
  );

  // Send the refresh JWT as a cookie
  res.cookie("Greddiijwt", refreshJWT, {
    httpOnly: true,
    //! secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, //!
  });

  // Send the access JWT in response
  return res.status(httpstatuscodes.StatusCodes.CREATED).send({ accessJWT });
};

const refresh = async (req, res) => {
  if (process.env.MODE === "dev") {
    console.log("Refresh attempt");
  }

  const cookies = req.cookies;
  if (!cookies || !cookies.Greddiijwt) {
    return res
      .status(httpstatuscodes.StatusCodes.UNAUTHORIZED)
      .send({ error: httpstatuscodes.ReasonPhrases.UNAUTHORIZED });
  }

  const refreshJWT = cookies.Greddiijwt;
  jwt.verify(refreshJWT, process.env.JWT_REFRESH_KEY, async (err, decoded) => {
    if (err) {
      return res
        .status(httpstatuscodes.StatusCodes.FORBIDDEN)
        .send({ error: httpstatuscodes.ReasonPhrases.FORBIDDEN });
    }

    // ! find user
    const foundUser = await UserModel.findOne({ username: username }).exec();
    if (!foundUser) {
      console.log("Invalid login attempt");
      return res.status(httpstatuscodes.StatusCodes.UNAUTHORIZED).send({
        error: httpstatuscodes.ReasonPhrases.UNAUTHORIZED,
        message: "Incorrect username or password",
      });
    }

    const newAccessJWT = jwt.sign(
      { username: "admin" },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY_TIME }
    );

    res.send({ newAccessJWT });
  });
};

const logout = async (req, res) => {
  console.log("logout");

  const cookies = req.cookies;
  if (!cookies || !cookies.Greddiijwt) {
    return res
      .status(httpstatuscodes.StatusCodes.NO_CONTENT)
      .send({ message: httpstatuscodes.ReasonPhrases.NO_CONTENT });
  }

  //   res.clearCookie("Grediijwt", {
  //     httpOnly: true,
  //     //! secure: true,
  //     sameSite: "None",
  //   });

  res.clearCookie("Greddiijwt");

  return res
    .status(httpstatuscodes.StatusCodes.OK)
    .send({ message: "Cookie cleared" });
};

module.exports = { login, refresh, logout, register };
