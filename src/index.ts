import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes"
import adminRoutes from "./routes/adminRoutes"
import errorHandler from './middlewares/errorMiddleware';

dotenv.config();

const app: Express = express();
connectDB()
const port = process.env.PORT || 3000;
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/',userRoutes);
app.use('/admin',adminRoutes);
app.use(errorHandler);



app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});