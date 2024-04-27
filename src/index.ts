import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes"
import adminRoutes from "./routes/adminRoutes"
import errorHandler from './middlewares/errorMiddleware';
import session from "express-session";
import postRoutes from './routes/postRoutes';
import connectionRoutes from './routes/connectionRoutes';
import jobRoutes from './routes/jobRoutes';
import ChatRoutes from './routes/chatRoutes';
import cors from 'cors';

import runScheduledTask from './utils/scheduledTask';
const path = require('path');
import { Server, Socket } from 'socket.io';
import socketIo_Config from './utils/socket/socket';
import http from 'http';


dotenv.config();

const app: Express = express();


declare module 'express-session' {
  interface Session {
    userDetails?: { username: string, email: string, password: string };
    otp?: string;
    otpGeneratedTime?:number;
    email?:string;
  }
}

app.use(cors({
  origin:'*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}))
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static('public/'))
app.use('/api/uploads/',express.static('public/uploads'))

const sessionSecret = process.env.SESSION_SECRET || 'default_secret_key';

app.use(session({
  secret:sessionSecret, 
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
}));


app.use('/api/',userRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/post',postRoutes);
app.use("/api/connection", connectionRoutes);
app.use('/api/job',jobRoutes);
app.use("/api/chat", ChatRoutes);

runScheduledTask();


// Create HTTP server
const server = http.createServer(app);

const io: Server = new Server(server, {
  cors: { origin: '*' }
});

// Configure Socket.IO
socketIo_Config(io);



app.use(errorHandler);

connectDB()
const port = process.env.PORT || 3000;


server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});