const express=require("express");
const bcrypt=require("bcryptjs");
const path=require("path");
require("./db/conn");
const Registration=require("../src/models/registration");    //import the module

// const async = require("hbs/lib/async");

const app=express();
const port = process.env.PORT || 3002;

//hosting static website
const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));              
app.set("view engine","hbs");                //telling the express about hbs
app.set("views",template_path);               //setting views path to template_path


//read registration record (read api)
app.get('/records',async(req,res)=>{
    const records=await Registration.find();
    res.status(422).json(records);
});

//form fillup (create api)
app.post("/form",async(req,res)=>{
    const {name ,email ,phone ,password ,confirmpassword}=req.body
    if (!name||!email||!phone||!password||!confirmpassword){
        return res.status(422).json({error:"Please fill all the forms!!"}) 
    }
    try{
        const userExits=await Registration.findOne({email});
        let num=phone.toString().length;
        if(userExits){
            return res.status(422).json({error:"User already exists!!"})
        }
        else if(num<10){
            return res.status(422).json({error:"Phone number Invalid!!"})
        }
        else if(password!==confirmpassword){
            return res.status(422).json({error:"Passwords doesn't match!!"})
        }
        else{
            const user=new Registration({name ,email ,phone ,password ,confirmpassword});
            await user.save();
            res.status(201).json({message:"User registered!!"})
        }
    }catch(error){
       console.log(error);
    }
})

//login form (create api)
app.post("/login",async(req,res)=>{
    const {name ,password,confirmpassword}=req.body
    if (!name||!password){
        return res.status(422).json({error:"Please fill all the forms!!"}) 
    }
    try{
        const userExits=await Registration.findOne({name});
        const isMatch=bcrypt.compare(password,confirmpassword);
        if(userExits){
            if(isMatch){
                return res.status(201).json({message:"Login Successful!!"})
                // res.render("welcome");
            }
            else{
                return res.status(422).json({error:"Password Incorrect!!"})
            }    
        }else{
            return res.status(422).json({error:"User doesn't exist!!"})   
        } 
    }catch(err){
        console.log(err);
    }
})


//change form detail (update api)

app.put('/api/update/:id',async(req,res)=>{

     let record=await Registration.findById(req.params.id);

     if(!record){
        res.status(200).json({
            sucess:false,
            message:'Record not found'
        })
    }
    
     record = await Registration.findByIdAndUpdate(req.params.id,req.body,{new:true,useFindAndModify:true,runValidators:true})
          
  
     res.status(200).json({sucess:true})
})


//delete detail of a student

app.delete('/api/delete/:id',async(req,res)=>{
  
  let record=await Registration.findById(req.params.id);
  if(!record){
    res.status(200).json({
        sucess:false,
        message:'Record not found'
    })
}
  await record.remove();
  
   res.status(200).json({
    sucess:true,
    message:'Record deleted succesfully'
   }) 
})

app.listen(port,(req,res)=>{
    console.log(`Connection succesful at port ${port}`);
})