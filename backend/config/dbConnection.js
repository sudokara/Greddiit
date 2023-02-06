/// Imports
const mongoose = require("mongoose");
///

const connectDB = async () => {
  console.log(mongoose.connection.readyState); //logs 0

  mongoose.connection.on("connecting", () => {
    console.log("connecting");
    console.log(mongoose.connection.readyState); //logs 2
  });

  mongoose.connection.on("connected", () => {
    console.log("connected");
    console.log(mongoose.connection.readyState); //logs 1
  });

  mongoose.connection.on("disconnecting", () => {
    console.log("disconnecting");
    console.log(mongoose.connection.readyState); // logs 3
  });

  mongoose.connection.on("disconnected", () => {
    console.log("disconnected");
    console.log(mongoose.connection.readyState); //logs 0
  });

  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
