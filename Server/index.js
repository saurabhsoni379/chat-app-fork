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
const onlineUsers = new Map();

io.on('connection', (socket) => {
  // When a user connects
  socket.on('add-user', (userId) => {
    // Add user to online users map
    onlineUsers.set(userId, socket.id);
    console.log('User connected:', userId, 'Socket ID:', socket.id);
    
    // Broadcast to ALL users that this user is online
    io.emit('user-status-change', {
      userId: userId,
      status: 'online'
    });

    // Send current online users list to the newly connected user
    const onlineUsersList = Array.from(onlineUsers.keys());
    socket.emit('online-users-list', onlineUsersList);
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    // Find and remove the disconnected user
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        // Broadcast to ALL users that this user is offline
        io.emit('user-status-change', {
          userId: userId,
          status: 'offline'
        });
        break;
      }
    }
  });

  // Add an endpoint to check if a user is online
  socket.on('check-online-status', (userId) => {
    const isOnline = onlineUsers.has(userId);
    console.log('Checking online status for user:', userId, 'Is online:', isOnline);
    socket.emit('online-status-response', {
      userId: userId,
      status: isOnline ? 'online' : 'offline'
    });
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

  // Handle typing events
  socket.on('typing', (data) => {
    const recipientSocket = onlineUsers.get(data.to);
    
    if (recipientSocket) {
      // Send typing event to the recipient
      io.to(recipientSocket).emit('typing', {
        from: data.from,
        isTyping: data.isTyping
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
