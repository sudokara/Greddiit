const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contactnum: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    followers: {
      type: [String],
      required: false,
    },
    following: {
      type: [String],
      required: false,
    },
    left_subgreddiits: {
      type: [String],
      required: false,
      default: [],
    },
    saved_posts: {
      type: [Number],
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// });

// module.exports = mongoose.model('User', userSchema);
