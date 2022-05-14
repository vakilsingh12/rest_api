const { User } = require("../models")
const CustomErrorHandler = require("../services/CustomErrorHandler")

const admin=async(req,res,next)=>{
    try{
        // console.log(req.user._id)
   const user=await User.findOne({_id:req.user._id})
   if(user.role=='admin'){
       next()
   }else{
       return next(CustomErrorHandler.unAuthorized())
   }
    }catch(err){
        return next(CustomErrorHandler.serverError())
    }
}

module.exports=admin