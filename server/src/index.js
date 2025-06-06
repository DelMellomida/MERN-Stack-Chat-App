import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
import {app, server, io} from "./lib/socket.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();
const port = process.env.PORT;

// app.use(express.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:5173",
	credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

server.listen(port, ()=>{
	console.log(`server is running on port ${port}`);
	connectDB();
});



