const mongoose=require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/registration")   //database_name = registration
.then(()=>{
    console.log(`connection success`)
}).catch((err)=>{
    console.log(err)
});

