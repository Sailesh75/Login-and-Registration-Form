const express=require("express");
const path=require("path");
require("./db/conn")
const hbs=require("hbs");
const Registration=require("../src/models/registration");
const async = require("hbs/lib/async");

const app=express();
const port = process.env.PORT || 3000;

//hosting static website
const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));              
app.set("view engine","hbs");                //telling the express about hbs
app.set("views",template_path);               //setting views path to template_path

app.get('/',(req,res)=>{
    res.render("index")
});

app.get('/register',(req,res)=>{
    res.render("register")
});

app.get('/recover',(req,res)=>{
    res.render("recover")
});

app.post("/form",async(req,res)=>{
    const {name ,email ,phone ,password ,confirmpassword}=req.body
    if (!name||!email||!phone||!password||!confirmpassword){
        return res.status(422).json({error:"Please fill all the forms!!"}) 
    }
    try{
        const userExits=await Registration.findOne({email});
        if(userExits){
            return res.status(422).json({error:"Email already exists!!"})
        }
        else if(!password===confirmpassword){
            return res.status(422).json({error:"Passwords doesn't match!!"})
        }
        else{
            const user=new Registration({name ,email ,phone ,password ,confirmpassword});
            await user.save();
            res.status(201).json({message:"Successful!!"})
        }
    }catch(error){
       console.log(error);
    }
})

app.post("/login",async(req,res)=>{
    const {name ,password}=req.body
    if (!name||!password){
        return res.status(422).json({error:"Please fill all the forms!!"}) 
    }
    try{
        const userExits=await Registration.findOne({name});
        if(userExits){
            if(password===userExits.password){
                return res.status(201).json({message:"Login Successful!!"})
            }
        }
        else{
            return res.status(422).json({error:"User doesn't exists!!"})
        }
        
    }catch(err){
        console.log(err);
    }
})

app.listen(port,(req,res)=>{
    console.log(`Connection succesful at port ${port}`);
})
