const  express= require('express');
const cors =require('cors');
const mongoose= require('mongoose');
const userRoute =require("./routes/userRoute")
const app= express();
require('dotenv/config');


app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URL).then(
    ()=>{
        console.log("DB Connection Successfully")
    }
).catch((err)=>{
  console.log(err)
});
app.use("/api/auth" , userRoute);

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server started at Port ${process.env.PORT}`)
})