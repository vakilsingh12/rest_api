const express=require('express')
const router=express.Router();
const {registerController,loginController,userController,refreshController,logoutController,productsController}=require('../controllers'); 
const auth = require('../middlewares/auth');
const admin=require('../middlewares/admin')
router.post('/register',registerController.register)
router.post('/login',loginController.login)
router.get('/me',auth,userController.me)
router.post('/refresh_token',refreshController.refresh)
router.post('/logout',auth,logoutController.logout)
router.post('/products',[auth,admin],productsController.store)
router.put('/products/:id',[auth,admin],productsController.update)
router.delete('/products/:id',[auth,admin],productsController.destroy)
router.get('/products',productsController.index)
router.get('/products/:id',productsController.show)
module.exports=router