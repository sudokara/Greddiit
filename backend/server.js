/// Imports
// Packages
const express = require("express");
const dotenv = require("dotenv").config();
const httpstatuscodes = require("http-status-codes");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

// Modules
const connectDB = require("./config/dbConnection");
const AuthRoutes = require("./routes/AuthRoutes");
const UserRoutes = require("./routes/UserRoutes");
const SubGreddiitRoutes = require("./routes/SubGreddiitRoutes");
const PostRoutes = require("./routes/PostRoutes");
///

/// Initializations
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieparser());
app.use(morgan("combined"));
connectDB();
///

app.get("/", (req, res) => {
  res
    .status(httpstatuscodes.StatusCodes.OK)
    .send(httpstatuscodes.ReasonPhrases.OK);
});

app.use("/auth", AuthRoutes);
// app.use("/protected", require("./routes/Protected")); //!
app.use("/user", UserRoutes);
app.use("/gr", SubGreddiitRoutes);
app.use("/post", PostRoutes);

app.listen(process.env.BACKEND_PORT || 5000, () => {
  console.log(`Server started on port ${process.env.BACKEND_PORT || 5000}`);
});
