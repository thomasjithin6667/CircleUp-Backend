import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes"
import adminRoutes from "./routes/adminRoutes"
import errorHandler from './middlewares/errorMiddleware';
import session from 'express-session';

dotenv.config();

const app: Express = express();
connectDB()
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const sessionSecret = process.env.SESSION_SECRET || 'default_secret_key';

app.use(session({
  secret:sessionSecret, 
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
app.use('/api/',userRoutes);
app.use('/api/admin',adminRoutes);
app.use(errorHandler);



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});