"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.verifyOTP = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../models/user/userModel"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const sendVerifyMail_1 = __importDefault(require("../utils/sendVerifyMail"));
const speakeasy_1 = __importDefault(require("speakeasy"));
//Controller for User Registration
exports.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new Error("Please add fields");
    }
    console.log(username, email, password);
    const userExist = yield userModel_1.default.findOne({ email });
    if (userExist) {
        res.status(400);
        throw new Error("User already exists");
    }
    const otp = speakeasy_1.default.totp({
        secret: speakeasy_1.default.generateSecret({ length: 20 }).base32,
        digits: 4,
    });
    const sessionData = req.session;
    sessionData.userDetails = { username, email, password };
    sessionData.otp = otp;
    sessionData.otpGeneratedTime = Date.now();
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    sessionData.userDetails.password = hashedPassword;
    (0, sendVerifyMail_1.default)(req, username, email);
    res.status(200).json({ message: "OTP sent for verification", otp });
}));
// OTP VERIFICATION
exports.verifyOTP = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    if (!otp) {
        res.status(400);
        throw new Error("Please provide OTP");
    }
    const sessionData = req.session;
    const storedOTP = sessionData.otp;
    if (!storedOTP || otp !== storedOTP) {
        res.status(400);
        throw new Error("Invalid OTP");
    }
    const userDetails = sessionData.userDetails;
    if (!userDetails) {
        res.status(400);
        throw new Error("User details not found in session");
    }
    const user = yield userModel_1.default.create({
        username: userDetails.username,
        email: userDetails.email,
        password: userDetails.password,
    });
    delete sessionData.userDetails;
    delete sessionData.otp;
    res.status(200).json({ message: "OTP verified, user created", user });
}));
// User Login
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (user) {
        if (user.isBlocked) {
            res.status(400);
            throw new Error("User is blocked");
        }
    }
    if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.username,
            email: user.email,
            profileImg: user.profileImageUrl,
            token: (0, generateToken_1.default)(user.id),
        });
    }
    else {
        res.status(400);
        throw new Error("Invalid Credentials");
    }
}));
