const { default: axios } = require('axios');

class authController {
    static isAuth= (req, res, next)=>{
        if(req.session.isAuth && req.user){
        return next()
        } else{
            return res.status(400).send({
                message: 'not authenticated',
                data: req.user,
                success: false
            })
        }
    }
    
    static verifyGoogleRecaptcha = async(req, res)=>{
        try {
            const response = await axios.post(
                `https://www.google.com/recaptcha/api/siteverify?secret=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe&response=${req.body.token}`
            );
            if(!response.data.success){
                return res.status(400).send({
                    message: 'google recaptcha verification failed',
                    success: false
                })
            }
            res.status(200).send({
                message: 'google recaptcha verification successfull',
                success: true
            })
        } catch (error) {
            res.status(200).send({
                message: error.message,
                success: false
            })
        }
    }
}
module.exports = authController