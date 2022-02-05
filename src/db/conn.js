const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/registration")
.then(()=>{
    console.log(`connection success`)
}).catch((err)=>{
    console.log('no connection')
});

