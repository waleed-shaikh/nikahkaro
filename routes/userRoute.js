const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const app = express();
const passport = require("passport");
require("../middleware/passportConfig")(passport);
const UserController = require('../controller/userController');
const authController = require('../controller/authController');


// otp send 
router.post('/send-otp', UserController.otpSend);

// otp confirmation 
router.post('/otp-confirmation', UserController.otpConfirmation);

// forgot password 
router.post('/forgot-password', UserController.forgotPassword);

// save password 
router.post('/save-password', UserController.savePassword);

// verify google recaptcha
router.post('/verifyRecaptcha', authController.verifyGoogleRecaptcha);


// user registration;
router.post('/register', async(req, res)=>{
  try {
    const user = await User.findOne({email: req.body.email})
    if(user){
      return res.status(400).send({
        message: 'User Already Exist',
        success: false
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save()
    return res.status(200).send({
      message: 'User Registered Succesfully',
      success: true
    })
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false
    })
  }
});


// user login
 router.post("/login", (req, res, next) => { passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user){
      res.status(400).send({
        message: 'No User exist',
        success: false
      })
    }
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        req.session.isAuth = true;
        res.send({
          message: "Successfully Authenticated",
          sucess: true
        });
      });
    }
  })(req, res, next);
});


router.get('/isLogin', authController.isAuth, async(req, res)=>{
  res.status(200).send({
    user: req.user 
  });
});

router.post('/logout', async(req, res)=>{
  req.user = null
  req.session.destroy((err)=>{
    if(err){
      return res.status(400).send({
        message: err.message,
        success: false
      })
    }
    res.status(200).send({
      message: 'logout successfully',
      success: true
    })
  })
});


module.exports = router;
