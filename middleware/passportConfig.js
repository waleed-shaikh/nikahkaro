const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const passport = require('passport');
const mongoose = require('mongoose');


module.exports = function (passport) {
  passport.use(new localStrategy({usernameField: 'email'}, async(email, password, done) => {
    const user = await User.findOne({ email: email })
    if(!user){
      return done(null, false, {message:'wrong mail', success: false});
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) throw err;
      if (result === true) {
        return done(null, user);
      } else {
        return done(null, false, {message: 'wrong password', success: false});
      }
    })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async(id, done) => {
    const user = await User.findById(id)
    if(!user){
      return done(null, false);
    } else{
      return done(null, user)
    } 
  });
};