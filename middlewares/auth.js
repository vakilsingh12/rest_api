const CustomErrorHandler = require("../services/CustomErrorHandler")
const JwtService = require("../services/JwtService")

const auth=async(req,res,next)=>{
const authHeader=req.headers.authorization
// console.log(authHeader)
if(!authHeader){
    return next(CustomErrorHandler.unAuthorized())
}
const token=authHeader.split(" ")[1];
try{
 const {_id,role}=await JwtService.verify(token)
 const user={
     _id,role
 }
 req.user=user
}catch(err){
return next(CustomErrorHandler.unAuthorized())
}
next()

}

module.exports=auth