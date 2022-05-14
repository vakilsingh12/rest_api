const registerController = require('./auth/registerController');
const loginController=require('./auth/loginController')
const userController=require('./auth/userController')
const refreshController=require('./auth/refreshController')
const logoutController=require('./auth/logoutController')
const productsController=require('./Products/productsController')
module.exports={
    registerController,loginController,userController,refreshController,logoutController,
    productsController
}