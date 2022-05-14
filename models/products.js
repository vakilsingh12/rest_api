const mongoose=require('mongoose');
const {APP_URL}=require('../config')
const Schema=mongoose.Schema;
const productSchema=new Schema({
      name:{type:String,required:true},
      price:{type:Number,required:true},
      size:{type:String,required:true},
      image:{type:String,required:true,get:(image)=>{
      return `${APP_URL}/${image}`
      }}
},
{timestamps:true,toJSON:{getters:true},id:false})  //id false bcz this one also give new id 

module.exports=mongoose.model('Product',productSchema,'products')