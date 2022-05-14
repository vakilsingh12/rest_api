const Joi=require('joi');
const {User, RefreshToken}=require('../../models')
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const bcrypt=require('bcrypt');
const JwtService=require('../../services/JwtService')
const {REFRESH_SECRET}=require('../../config')
let registerController={
    async register(req,res,next){
        // Validation
        const registerSchema=Joi.object({
        name:Joi.string().min(3).max(30).required(),
        email:Joi.string().email().required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password:Joi.ref('password')
        });
        const {error} =registerSchema.validate(req.body);
        if(error){
           return next(error)
        }
        // check if user already in the database
        try{
          const exists=await User.exists({email:req.body.email})
          if(exists){
              return next(CustomErrorHandler.alreadyExists('This email is already taken'))
          }
        }catch(err){
              return next(err)
        }
        // Hash password for store data
        let {name,email,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,10)
        const user={
           name,email,password:hashedPassword
        }
        const user_data=new User(user)
        let access_token
        let refresh_token
        try{
        const result=await user_data.save();
        // Token generate
        access_token=JwtService.sign({_id:result._id,role:result.role})
        refresh_token=JwtService.sign({_id:result._id,role:result.role},'1y',REFRESH_SECRET)
        await RefreshToken.create({token:refresh_token})

        }catch(err){
          return next(err)
        }
        res.json({access_token,refresh_token})
    }
}


module.exports=registerController