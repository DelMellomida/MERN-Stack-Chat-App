import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [(process.env.NODE_ENV === "production" ? "https://mern-stack-chat-app-phi.vercel.app" : "http://localhost:5173")],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const userSocketMap = {};
const AI_ASSISTANT_ID = "684251b5358f99bf8284cc76"; // AI Assistant's user ID

export function getReceiverSocketId(userId) {
    return userSocketMap[userId] || null;
}

function emitOnlineUsers() {
    // Always include the AI Assistant as online
    const onlineUsers = Array.from(new Set([...Object.keys(userSocketMap), AI_ASSISTANT_ID]));
    io.emit('getOnlineUsers', onlineUsers);
}

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userId = socket.handshake.query.userId;

    if(userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    }

    emitOnlineUsers();

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete userSocketMap[userId];
        emitOnlineUsers();
    });
});

export {io, app, server};