const Joi = require("joi")
const { RefreshToken } = require("../../models")
const CustomErrorHandler = require("../../services/CustomErrorHandler")

const logoutController={
    async logout(req,res,next){
        // Validation req
        const logoutSchema=Joi.object({
            refresh_token:Joi.string().required()
        })
        const {error}=logoutSchema.validate(req.body)
        if(error){
            return next(error)
        }
    try{
      await RefreshToken.deleteOne({token:req.body.refresh_token})
    }catch(err){
    return next(new Error('Something went wrong in the database!'))
    }
    res.json({status:"user logout successfully"})
    }
}

module.exports=logoutController