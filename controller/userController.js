const User = require('../models/userModel');
const Otp = require('../models/otpModel');
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");

class userController {

    //otp send routes
    static otpSend = async (req, res)=>{
        try {
            const user = await User.findOne({email: req.body.email}) 
            if(user){
                return res.status(400).send({
                    message: 'this email is already registered',
                    success: false
                })
            }
            const otpCode = Math.floor((Math.random()*1000000)+1);
            const otpData = new Otp({
                email: req.body.email,
                otp: otpCode,
                expireIn: new Date().getTime() + 300*1000
            })
            const response = await otpData.save();
            if(response){
                let transporter = nodemailer.createTransport({
                    host: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                      user: 'b3dcdbee80bc5e', 
                      pass: '2b843945cf7344', 
                    },
                  });
                  await transporter.sendMail({
                    from: '"Fred Foo 👻" <waleedsdev@gmail.com>',
                    to: req.body.email, 
                    subject: "Otp Confirmation", 
                    text: 'otp confirmation', 
                    html: `<h2>OTP: ${otpCode}</h2>`
                    // html: `<button>${req.body.url}</button>`, 
                  });
            }
            res.status(200).send({
                message: 'please check your email id',
                success: true,    
            })
            
        } catch (error) {
            res.status(500).send({
                message: error.message,
                success: true,    
            })
        }
    }

    // otp confirmation routes
    static otpConfirmation = async (req, res)=>{
        try {
            const data = await Otp.findOne({
                email: req.body.email,
                otp: req.body.otp
            })
            if(!data){
                return res.status(400).send({
                    message: 'otp not found',
                    success: false
                })
            }
            let currentTime = new Date().getTime();
            let diff = data.expireIn - currentTime
            if(diff<0){
                return res.status(400).send({
                    message: 'otp expired',
                    success: false
                })
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
            const user = new User(req.body);
            await user.save();
            res.status(200).send({
                message: 'user resgistration successfully',
                success: true
            })
            
        } catch (error) {
            res.status(500).send({
                message: error.message,
                success: true
            })
        }
    }

    // forgot password
    static forgotPassword = async(req,res)=>{
        try {
            const user = await User.findOne({email: req.body.email});
            if(!user){
                return res.status(400).send({
                    message: 'user not found',
                    success: false
                })
            }
            const otpCode = Math.floor((Math.random()*1000000)+1);
            const otpData = new Otp({
                email: req.body.email,
                otp: otpCode,
                expireIn: new Date().getTime() + 300*1000
            })
            const response = await otpData.save();
            if(response){
                let transporter = nodemailer.createTransport({
                    host: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                      user: 'b3dcdbee80bc5e', 
                      pass: '2b843945cf7344', 
                    },
                  });
                  await transporter.sendMail({
                    from: '"Fred Foo 👻" <waleedsdev@gmail.com>',
                    to: req.body.email, 
                    subject: "Otp Confirmation", 
                    text: 'otp confirmation', 
                    html: `<h2>OTP: ${otpCode}</h2>`
                    // html: `<button>${req.body.url}</button>`, 
                  });
            }
            res.status(200).send({
                message: 'otp sent to your registered email id',
                success: true,    
            })
        } catch (error) {
            res.status(500).send({
                message: error.message,
                success: false
            })
        }
    }

    // save password
    static savePassword = async(req,res)=>{
        try {
            const data = await Otp.findOne({
                email: req.body.email,
                otp: req.body.otp
            })
            if(!data){
                return res.status(400).send({
                    message: 'otp not found',
                    success: false
                })
            }
            let currentTime = new Date().getTime();
            let diff = data.expireIn - currentTime
            if(diff<0){
                return res.status(400).send({
                    message: 'otp expired',
                    success: false
                })
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            req.body.password = hashedPassword;
            const user = await User.findOne({email: req.body.email})
            if(!user){
                return res.status(400).send({
                    message: 'user not found',
                    success: false
                })
            }
            user.password = req.body.password 
            await user.save();
            res.status(200).send({
                message: 'Password reset successfully',
                success: true
            })
        } catch (error) {
            res.status(500).send({
                message: error.message,
                success: false
            })
        }
    }
}

module.exports = userController

