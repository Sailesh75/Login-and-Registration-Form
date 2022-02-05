const mongoose =require('mongoose');
const validator=require('validator');

const registrationSchema=new mongoose.Schema({
   name:{
       type:String,
       required:true,
       unique:true
   },
   email:{
       type:String,
       required:true,
       unique:true,
       validate(value){
           if(!validator.isEmail(value)){
               throw new Error("Invalid Email")
           }
       }
   },
   phone:{
       type:Number,
       required:true,
       unique:true,
       min:10
   },
   password:{
       type:String,
       required:true
   },
   confirmpassword:{
       type:String,
       required:true
   }
})

const Registration = new mongoose.model('Registration',registrationSchema);
module.exports=Registration;
