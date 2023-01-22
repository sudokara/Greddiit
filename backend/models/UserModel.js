/// Imports
const mongoose = require('mongoose');

// Connect to MongoDB higher in the tree

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 2
    },
    lastname: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact_num: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    following: {
        type: [String],
        required: false,
        default: []
    },
    followers: {
        type: [String],
        required: false,
        default: []
    }
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;

// Ensure unique email
userSchema.path('email').validate(function (value, done) {
    this.model('User').count({ email: value }, function (err, count) {
        if (err) { return done(err) };
        done(!count);
    });
}, "There is already an account associated with this email.");