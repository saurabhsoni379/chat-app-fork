const  express= require('express');
const cors =require('cors');
const mongoose= require('mongoose');
const userRoute =require("./routes/userRoute")
const messageRoute =require("./routes/messageRoute")
const contactRoute = require("./routes/contactRoute");
const notificationRoute = require("./routes/notificationRoute");
const app= express();
const socket=require('socket.io');
require('dotenv/config');


app.use(express.json())
app.use(cors({
     origin:["http://localhost:3000","https://chat-app-s5w5.vercel.app"],
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
app.use("/api/contact" , contactRoute);
app.use("/api/notification", notificationRoute);
app.get("*",(req,res)=>{
 res.status(200).json({message:'good request'});
})
const server=app.listen(process.env.PORT,()=>{
    console.log(`Server started at Port ${process.env.PORT}`)
})

const io=socket(server,{
    cors:{
        origin:["http://localhost:3000","https://chat-app-s5w5.vercel.app"],
  method:["POST","GET"],
credentials:true,
    },
});
const onlineUsers=new Map();

io.on('connection',(socket)=>{

  socket.on('add-user',(userId)=>{
    onlineUsers.set(userId,socket.id);
    console.log('User connected:', userId);
  });

  // Add an event for contact status changes
  socket.on('contact-status-change', (data) => {
    console.log('Contact status change:', data);
    const recipientSocket = onlineUsers.get(data.recipientId);
    if (recipientSocket) {
      // Notify the recipient that their contact status has changed
      socket.to(recipientSocket).emit('contact-update', {
        senderId: data.senderId,
        status: data.status
      });
    }
  });

  socket.on("send-msg",(data)=>{
    const sendUserSocket= onlineUsers.get(data.to);
    if(sendUserSocket){
        socket.to(sendUserSocket).emit("data-receive" ,  {message:data.message,time:data.time,from:data.from});
    }
  });
});
