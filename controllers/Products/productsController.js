const products = require("../../models/products")
const CustomErrorHandler=require('../../services/CustomErrorHandler')
const multer=require('multer')
const path=require('path')
const Joi = require("joi")
const fs = require("fs")
const productSchema=require('../../validators/productValidator')
const storage=multer.diskStorage({
      destination:(req,file,cb)=>cb(null,'uploads/'),
      filename:(req,file,cb)=>{
            const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
            cb(null,uniqueName);

      }
})
const handleMultipartData=multer({storage,limits:{fieldSize:1000000*5}}).single('image')   //5MB
const productsController={
      async store(req,res,next){
            // multipart form data
             handleMultipartData(req,res,async(err)=>{
                   if(err){
                         return next(CustomErrorHandler.serverError())
                   }
                   const filepath=req.file.path;
                  //  validate data
                  const {error}=productSchema.validate(req.body)
                  if(error){
                        // delete the uploaded file if validation is failed
                        fs.unlink(`${appRoot}/${filepath}`,(err)=>{
                              if(err){
                                 return next(CustomErrorHandler.serverError(err.message))  
                              }
                        })
                        return next(error)  
                  }
                  //  res.json({stats:'File uploaded'})
                   const {name,price,size}=req.body;
                   let document;
                   try{
                       document=await products.create({
                             name,price,size,image:filepath
                       })
                   }catch(err){
                        return next(err)
                   }
                   res.status(201).json(document)
             })
      },
      async update(req,res,next){
            handleMultipartData(req,res,async(err)=>{
                  if(err){
                        return next(CustomErrorHandler.serverError())
                  }
                  let filepath;
                  if(req.file){
                        filepath=req.file.path;
                  }
                  
                 //  validate data
                 const {error}=productSchema.validate(req.body)
                 if(error){
                       // delete the uploaded file if validation is failed
                       console.log(req.file)
                      if(req.file){
                        fs.unlink(`${appRoot}/${filepath}`,(err)=>{
                              if(err){
                                 return next(CustomErrorHandler.serverError(err.message))  
                              }
                        })
                      }
                       return next(error)  
                 }
                 console.log(req.file)
                 if(req.file){
                  fs.unlink(`${appRoot}/${filepath}`,(err)=>{
                        if(err){
                           return next(CustomErrorHandler.serverError(err.message))  
                        }
                  })
            }
                 //  res.json({stats:'File uploaded'})
                  const {name,price,size}=req.body;
                  let document;
                  try{
                      document=await products.findOneAndUpdate({_id:req.params.id},{
                            name,price,size,...(req.file&&{image:filepath})
                      },{new:true})
                  }catch(err){
                       return next(err)
                  }
                  res.status(201).json(document)
            })
      },

      // delete project API ******************
     async destroy(req,res,next){
       const document=await products.findOneAndRemove({_id:req.params.id});
       if(!document){
             return next(new Error('Nothing to delete!'))
       }
      //  image delete
      const imagePath=document._doc.image; //to prevent getter call used _doc
      fs.unlink(`${appRoot}/${imagePath}`,(err)=>{
            if(err){
                  return next(CustomErrorHandler.serverError())
            }
      })
      res.json(document)
      },
      
      // get all products data API*********************
      async index(req,res,next){
      let data;
      // pagination mongoose-pagination
      const {page=1,limit=2}=req.query;
      try{
            data=await products.find().select('-updatedAt -__v').sort({_id:-1}).limit(limit*1).skip((page-1)*limit);
            if(!data){
                  return next(new Error('Data Not found'))
            }
      }catch(err){
         return next(CustomErrorHandler.serverError())
      }
      return res.json({MinPrice:Math.min(...data.map(res=>res.price)),data}) //here spread operator convert array to list
},
async show(req,res,next){
      let document;
      try{
      document=await products.findOne({_id:req.params.id}).select('-updatedAt -__v');
      if(!document){
            return next(new Error('Data Not found'))
      }
      res.json(document)
      }catch(err){
      return next(CustomErrorHandler.serverError())
      }
}
}

module.exports=productsController