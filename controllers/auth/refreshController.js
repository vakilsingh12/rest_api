const Joi = require("joi")
const { REFRESH_SECRET } = require("../../config")
const { RefreshToken, User } = require("../../models")
const CustomErrorHandler = require("../../services/CustomErrorHandler")
const JwtService = require("../../services/JwtService")

const refreshController={
    async refresh(req,res,next){
    // validate request
    const refreshSchema=Joi.object({
        refresh_token:Joi.string().required()
    })
    const {error}=refreshSchema.validate(req.body)
    if(error){
        return next(error)
    }
    // database
    try{
       let refresh_tokens= await RefreshToken.findOne({token:req.body.refresh_token})
       if(!refresh_tokens){
           return next(CustomErrorHandler.unAuthorized('Invalid refresh token'))
       }
       let userid;
       try{
         const {_id}=await JwtService.verify(refresh_tokens.token,REFRESH_SECRET)
         userid=_id
       }catch(err){
        return next(CustomErrorHandler.unAuthorized('Invalid refresh token'))
       }
       const user=User.findOne({_id:userid})
       if(!user){
        return next(CustomErrorHandler.unAuthorized('No user found!'))
       }
    //    Token generate
        let access_token=JwtService.sign({_id:user._id,role:user.role})
        let refresh_token=JwtService.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET)
        await RefreshToken.create({token:refresh_token})
        res.json({access_token,refresh_token})
    }catch(err){
        return next(new Error('Something went wrong'+err.message))
    }









    }
}

module.exports=refreshController