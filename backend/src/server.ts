import express, { NextFunction, Request, Response, json } from 'express'
// import { testConnection } from "./config/sqlConfig";
import cors from 'cors'
import {v4} from 'uuid'
import http  from 'http'
import { Server  } from 'socket.io';
import user_router from "./routes/userRoutes";
import post_router from './routes/postRoutes';
import dbHelper from './dbhelpers/dbhelpers'




const app = express();
const server = http.createServer(app)

app.use(cors())
app.use(json())

app.use('/user', user_router)
app.use('/post', post_router)


// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:4200',
//     methods: ['GET', 'POST'],
//   },
// });

app.use((error: Error, req:Request, res:Response, next:NextFunction)=>{
  res.json({
      message: error.message
  })
})

app.listen(4400, ()=>{
  console.log("Server running on port 4400");
})


// io.on('connection', (socket) => {

//   socket.on('join', (data) => {
//       socket.join(data.room);
//       socket.broadcast.to(data.room).emit('user joined');
//   });

//   socket.on('message', async(data,req:Request,res:Response) => {
//     console.log(data);
//     let created_at  = new Date().toISOString();
//     let message_id = v4()
//     let from_user_id = data.user.user_id;
//     let to_user_id = data.room
//     let message_text = data.message

//             let result = await dbHelper.execute('sendMessage', {
//               message_id,from_user_id, to_user_id,message_text,created_at
//         })

//         console.log(result);
        
        
//         if(result.rowsAffected[0] === 0){
//             return res.status(404).json({
//                 message: "Something went wrong, user not registered"
//             })
//         }else{
//           io.in(data.room).emit('new message', {user: data.user.fullName, message: data.message});

//         }

//   });
// });





const PORT = 5000;



server.listen(PORT, () => {
  console.log(`server is running on  ${PORT} `);

});