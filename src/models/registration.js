const mongoose =require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

//This collection doesn't include any custom(self-made) validations
const registrationSchema=new mongoose.Schema({   //schema_name for the collection registration
   name:{
       type:String,             //These are called validations ,They are defined in the schema_type.
       required:true,           // They are built-in validators.
       unique:true
   },
    email:{                       
       type:String,
       required:true,
       unique:true,                        
       validate(value){                                 //Got from validator package
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

//Syntax for model(collection_creation) 
// const class_name(model_name of the collection) = new mongoose.model("collection_name",collection_schema_name)
// class_name and collection_name can be same,,,infact use same to avoid confusions

const Registration = new mongoose.model('Registration',registrationSchema);  
module.exports=Registration;       //Export the module

