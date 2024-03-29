"use strict";
// userModel.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userTypes_1 = require("./userTypes");
// Create the user schema
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isHiring: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    userType: { type: String, enum: Object.values(userTypes_1.UserType) },
    profile: {
        type: {
            about: { type: String },
            location: { type: String },
            qualification: [{ course: String, institution: String, yearOfCompletion: Number }],
            experience: [{ jobPosition: String, yearOfJoining: Number, companyName: String }],
            skills: [{ type: String }],
            resume: { type: String },
            gender: { type: String },
        },
    },
    companyProfile: {
        type: {
            companyName: { type: String },
            companyLocation: { type: String },
            aboutCompany: { type: String },
            noOfEmployees: { type: Number },
        },
    },
    phone: { type: String },
    savedPosts: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Post' }],
    savedJobs: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Job' }],
    isActive: { type: Boolean, default: true },
    profileImageUrl: { type: String },
}, { timestamps: true });
// Create and export the User model
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
