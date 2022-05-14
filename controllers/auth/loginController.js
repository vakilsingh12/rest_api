const Joi = require('joi')
const {User, RefreshToken}=require('../../models');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const bcrypt=require('bcrypt');
const Jwtservice=require('../../services/JwtService');
const { REFRESH_SECRET } = require('../../config');
const loginController={
    async login(req,res,next){
    // validtion
    const loginSchema=Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    })
    const {error}=loginSchema.validate(req.body);
    if(error){
        return next(error)
    }
    // Check user exists or not in database
    try{
        const user=await User.findOne({email:req.body.email})
        if(!user){
         return next(CustomErrorHandler.wrondcredentials())
        } 
        // compare the password
        const match=await bcrypt.compare(req.body.password,user.password)
        if(!match){
            return next(CustomErrorHandler.wrondcredentials())
        }
        // token generate if user data is matched
        const access_token=Jwtservice.sign({_id:user._id,role:user.role})
        const refresh_token=Jwtservice.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET)
        await RefreshToken.create({token:refresh_token})
        res.json({access_token,refresh_token})
    }catch(err){
        return next(err)
    }

    }
}



module.exports=loginController