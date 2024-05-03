const  express= require('express');
const cors =require('cors');
const mongoose= require('mongoose');
const userRoute =require("./routes/userRoute")
const messageRoute =require("./routes/messageRoute")
const app= express();
const socket=require('socket.io');
require('dotenv/config');


app.use(express.json())
app.use(cors({
     origin:["http://localhost:3000","https://chat-app-alpha-orcin.vercel.app/"],
  method:["POST","GET"],
credentials:true,
}))

mongoose.connect(process.env.MONGO_URL).then(
    ()=>{
        console.log("DB Connection Successfully")
    }
).catch((err)=>{
  console.log(err)
});
app.use("/api/auth" , userRoute);
app.use("/api/message" , messageRoute);

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server started at Port ${process.env.PORT}`)
})

const io=socket(server,{
    cors:{
        origin:["http://localhost:3000","https://chat-app-alpha-orcin.vercel.app/"],
  method:["POST","GET"],
credentials:true,
    },
});
const onlineUsers=new Map();

io.on('connection',(socket)=>{

  socket.on('add-user',(userId)=>{
onlineUsers.set(userId,socket.id);
 
  })


socket.on("send-msg",(data)=>{
const sendUserSocket= onlineUsers.get(data.to);
if(sendUserSocket){
    socket.to(sendUserSocket).emit("data-receive" ,  {message:data.message,time:data.time,from:data.from});
}
})
});
