import express, { NextFunction, Request, Response, json } from 'express'
// import { testConnection } from "./config/sqlConfig";
import cors from 'cors'

import http  from 'http'
import { Server  } from 'socket.io';
import user_router from "./routes/userRoutes";
import post_router from './routes/postRoutes';





const app = express();
const server = http.createServer(app)

app.use(cors())
app.use(json())

app.use('/user', user_router)
app.use('/post', post_router)


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});

app.use((error: Error, req:Request, res:Response, next:NextFunction)=>{
  res.json({
      message: error.message
  })
})

app.listen(4400, ()=>{
  console.log("Server running on port 4400");
})


io.on('connection', (socket) => {

  socket.on('join', (data) => {
      socket.join(data.room);
      socket.broadcast.to(data.room).emit('user joined');
  });

  socket.on('message', (data) => {
    console.log(data);
 
    
      io.in(data.room).emit('new message', {user: data.user, message: data.message});
  });
});





const PORT = 5000;



server.listen(PORT, () => {
  console.log(`server is running on  ${PORT} `);

});