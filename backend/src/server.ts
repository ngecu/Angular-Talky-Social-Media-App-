import express from 'express'
import http  from 'http'
import { Server  } from 'socket.io';



const app = express();


const server = http.createServer(app)


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});


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


app.listen(5000, () => 'Server is running on port 5000');

app.on('error', (error) => {
  console.error(`Server failed to start: ${error}`);
});