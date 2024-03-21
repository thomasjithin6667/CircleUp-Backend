import express, { Express, Request, Response } from "express";
import { registerUser,verifyOTP ,loginUser ,resendOtp, googleAuth} from '../controllers/userController';
const router = express.Router()

router.get('/',(req:Request,res:Response)=>{
    res.send("Express + TypeScript Server");
})

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/register-otp',verifyOTP)
router.post('/resend-otp',resendOtp)
router.post('/google-auth',googleAuth)


export default router