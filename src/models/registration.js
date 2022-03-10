const mongoose =require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
// const async = require('hbs/lib/async');

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

registrationSchema.pre("save",async function(next){
    if(this.isModified("password")){
        console.log(`the current password is ${this.password}`);
        this.password=await bcrypt.hash(this.password,10);
        console.log(`the current password is ${this.password}`);
        this.confirmpassword=undefined;
    }
    next();
})

const Registration = new mongoose.model('Registration',registrationSchema);
module.exports=Registration;
