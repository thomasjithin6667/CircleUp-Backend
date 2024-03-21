import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user/userModel";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken";
import sendVerifyMail from "../utils/sendVerifyMail";
import speakeasy from "speakeasy";

//Controller for User Registration

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new Error("Please add fields");
    }
    console.log(username, email, password);

    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400);
      throw new Error("User already exists");
    }

    const otp = speakeasy.totp({
      secret: speakeasy.generateSecret({ length: 20 }).base32,
      digits: 4, 
    });

    const sessionData = req.session!;
    sessionData.userDetails = { username, email, password };
    sessionData.otp = otp;
    sessionData.otpGeneratedTime = Date.now();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    sessionData.userDetails!.password = hashedPassword;
    sendVerifyMail(req, username, email);

    res.status(200).json({ message: "OTP sent for verification", email,otp});
  }
);

// OTP VERIFICATION

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { otp } = req.body;
  console.log(req.body);
  console.log(otp);
  
  if (!otp) {
    res.status(400);
    throw new Error("Please provide OTP");
  }

  const sessionData = req.session!;
  const storedOTP = sessionData.otp;
console.log(storedOTP);

  if (!storedOTP || otp !== storedOTP) {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  const userDetails = sessionData.userDetails;
  if (!userDetails) {
    res.status(400);
    throw new Error("User details not found in session");
  }
  const user = await User.create({
    username: userDetails.username,
    email: userDetails.email,
    password: userDetails.password,
  });

  delete sessionData.userDetails;
  delete sessionData.otp;

  res.status(200).json({ message: "OTP verified succesfully, user created", user });
});

// OTP Resend

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const {email} = req.body;
  const otp = speakeasy.totp({
    secret: speakeasy.generateSecret({ length: 20 }).base32,
    digits: 4, 
  });

  const sessionData = req.session!;
  sessionData.otp = otp;
  sessionData.otpGeneratedTime = Date.now();

  const userDetails = sessionData.userDetails;
  if (!userDetails) {
    res.status(400).json({ message: "User details not found in session" });
    return;
  }
  console.log(otp)
  sendVerifyMail(req, userDetails.username, userDetails.email);
  res.status(200).json({ message: "OTP sent for verification" ,email,otp});
});


// User Login

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body);
  
  const user = await User.findOne({ email });
  console.log(user);
  
  
  if (user) {
    if (user.isBlocked) {
      res.status(400);
      throw new Error("User is blocked");
    }
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({ message: "Login Sucessful" ,
      _id: user.id,
      name: user.username,
      email: user.email,
      profileImg: user.profileImageUrl,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});


//googleAuth

export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, imageUrl } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      if (userExist.isBlocked) {
        res.status(400).json({ message: "User is blocked" });
        return;
      }

      if (userExist.isGoogle) {
        res.json({
          message: "Login Successful",
          _id: userExist.id,
          name: userExist.username,
          email: userExist.email,
          profileImg: userExist.profileImageUrl,
          token: generateToken(userExist.id),
        });
        return;
      }
    }

    const randomPassword = Math.random().toString(36).slice(-8); 

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword, 
      profileImageUrl: imageUrl,
      isGoogle: true,
    });

    const token = generateToken(newUser.id);

    res.status(200).json({
      message: "Login Successful",
      _id: newUser.id,
      name: newUser.username,
      email: newUser.email,
      profileImg: newUser.profileImageUrl,
      token: token,
    });
  } catch (error) {
    console.error("Error in Google authentication:", error);
    res.status(500).json({ message: "Server error" });
  }
});
