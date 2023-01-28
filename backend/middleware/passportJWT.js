/// Imports
const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/User');
///

/// Passport Initialisation
const opts = {}; // Options for JWT
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken(); // Get the JWT Token from Header with Authorization key as Bearer Token
opts.secretOrKey = process.env.JWT_KEY;
///

/// Implementing JWT Strategy
passport.use(new JWTStrategy(opts, function (jwt_payload, done) {
    UserModel.findOne({ id: jwt_payload.id }, (err, user) => {
        if (err) { return done(err, false); } // error fetching from MongoDB, pass error to next middleware
        if (user) { return done(null, user); } // no error, user found
        return done(null, false); // no error, user was not found
    });
}));
///
