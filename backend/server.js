/// Imports
// Packages
const express = require("express");
const dotenv = require("dotenv").config();
const httpstatuscodes = require("http-status-codes");
const cookieparser = require("cookie-parser");
// const cors = require("cors");

// Modules
const connectDB = require("./config/dbConnection");
///


/// Initializations
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser())
connectDB();
///


app.get("/", (req, res) => {
  res.status(httpstatuscodes.StatusCodes.OK).send(httpstatuscodes.ReasonPhrases.OK);
});

app.use("/auth", require("./routes/AuthRoutes"));
// app.use("/protected", require("./routes/Protected")); //!

app.listen(process.env.BACKEND_PORT || 5000, () => {
  console.log(`Server started on port ${process.env.BACKEND_PORT || 5000}`);
});
