"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
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
        io.in(data.room).emit('new message', { user: data.user, message: data.message });
    });
});
app.listen(5000, () => 'Server is running on port 5000');
app.on('error', (error) => {
    console.error(`Server failed to start: ${error}`);
});
