const express = require('express');
const app = express();
const env = require('dotenv');
const dbConnect = require('./config/db');
const userRoutes = require('./router/userRouter');
const chatRoutes = require('./router/chatRoute');
const messageRoutes = require('./router/messageroute');
const cors = require('cors');
const {
  notFound,
  errorHandler,
} = require('./middleware/errorHandlingMiddleWare');

env.config();
const PORT = process.env.PORT;

dbConnect();

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server=app.listen(PORT, () => {
  console.log(`server started on ${PORT}`);
});

const io=require("socket.io")(server,{
  pingTimeout:60000,
  cors:{
    origin:"http://localhost:5173"
  }
})
io.on("connect",(socket)=>{
  console.log("connected to socket");

  socket.on("setup",(userData)=>{
    socket.join(userData._id);
    socket.emit("connected")
  })

  socket.on("join chat",(room)=>{
    socket.join(room)
    console.log("user jioned room"+room);
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageRecieved) => {
    // console.log("New message received:", newMessageRecieved);
    var chat = newMessageRecieved.chat;
    // console.log("chat "+chat);

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
})


