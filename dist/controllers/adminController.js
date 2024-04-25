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
exports.jobBlock = exports.getJobs = exports.blockJobCategory = exports.getJobCategory = exports.addJobCategory = exports.postBlock = exports.userBlock = exports.getPosts = exports.getUsers = exports.Login = void 0;
const express_1 = __importDefault(require("express"));
const postModel_1 = __importDefault(require("../models/post/postModel"));
const router = express_1.default.Router();
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const adminModel_1 = __importDefault(require("../models/admin/adminModel"));
const userModel_1 = __importDefault(require("../models/user/userModel"));
const jobCategoryModel_1 = __importDefault(require("../models/jobCategory/jobCategoryModel"));
const jobModel_1 = __importDefault(require("../models/jobs/jobModel"));
const generateAdminToken_1 = __importDefault(require("../utils/generateAdminToken"));
// @desc    Admin Login
// @route   ADMIN /Admin/login
// @access  Private
exports.Login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const admin = yield adminModel_1.default.findOne({ email });
    if (admin && password === admin.password) {
        res.status(200).json({
            message: "Login Successful",
            _id: admin.id,
            name: admin.name,
            email: admin.email,
            profileImg: admin.profileImg,
            token: (0, generateAdminToken_1.default)(admin.id),
        });
    }
    else {
        res.status(400);
        throw new Error("Invalid Credentials");
    }
}));
// @desc    Get all users
// @route   ADMIN /admin/get-users
// @access  Private
exports.getUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("hello");
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const totalUsers = yield userModel_1.default.countDocuments({});
    const totalPages = Math.ceil(totalUsers / limit);
    const users = yield userModel_1.default.find({}).skip(skip).limit(limit);
    if (users.length > 0) {
        res.status(200).json({ users, totalPages });
    }
    else {
        res.status(404).json({ message: "Users Not Found" });
    }
}));
// @desc    Get all posts
// @route   ADMIN /admin/get-posts
// @access  Private
exports.getPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const totalPosts = yield postModel_1.default.countDocuments({ isDeleted: false });
    const totalPages = Math.ceil(totalPosts / limit);
    const posts = yield postModel_1.default.find({ isDeleted: false })
        .populate({
        path: 'userId',
        select: 'username profileImageUrl email'
    })
        .skip(skip)
        .limit(limit);
    if (posts.length > 0) {
        res.status(200).json({ posts, totalPages });
    }
    else {
        res.status(404).json({ message: "No Posts Found" });
    }
}));
// @desc    Block Users
// @route   ADMIN /admin/block-user
// @access  Private
exports.userBlock = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    console.log(req.body);
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }
    user.isBlocked = !user.isBlocked;
    yield user.save();
    const users = yield userModel_1.default.find({});
    const blocked = user.isBlocked ? "Blocked" : "Unblocked";
    res.status(200).json({ users, message: `You have ${blocked} ${user.username}` });
}));
// @desc    Block post
// @route   ADMIN /admin/block-user
// @access  Private
exports.postBlock = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.body.postId;
    const post = yield postModel_1.default.findById(postId);
    if (!post) {
        res.status(400);
        throw new Error('Post not found');
    }
    post.isBlocked = !post.isBlocked;
    yield post.save();
    const posts = yield postModel_1.default.find({});
    const blocked = post.isBlocked ? "Blocked" : "Unblocked";
    res.status(200).json({ posts, message: `post has been ${blocked}` });
}));
// @desc    Add job category
// @route   ADMIN /admin/get-users
// @access  Private
exports.addJobCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Reached here");
    const { jobCategory } = req.body;
    console.log(jobCategory);
    const existingJobCategory = yield jobCategoryModel_1.default.find({ jobCategory });
    if (existingJobCategory.length > 0) {
        res.status(404);
        throw new Error("Job category Already Exist");
    }
    else {
        yield jobCategoryModel_1.default.create({ jobCategory });
        const allJobCategory = yield jobCategoryModel_1.default.find({}).sort({ date: -1 });
        res.status(200).json({ message: "Job cateory added", jobCategory: allJobCategory });
    }
}));
// @desc    Get all job Categoory
// @route   ADMIN /admin/get-users
// @access  Private
exports.getJobCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const totalJobCategories = yield jobCategoryModel_1.default.countDocuments({});
    const totalPages = Math.ceil(totalJobCategories / limit);
    const jobCategory = yield jobCategoryModel_1.default.find({})
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);
    if (jobCategory.length > 0) {
        res.status(200).json({ jobCategory, totalPages });
    }
    else {
        res.status(404).json({ message: "No Job Categories Found" });
    }
}));
// @desc     block job Category 
// @route   ADMIN /admin/block-job-category
// @access  Private
exports.blockJobCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobCategoryId = req.body.jobCategoryId;
    console.log(req.body);
    const jobCategory = yield jobCategoryModel_1.default.findById(jobCategoryId);
    if (!jobCategory) {
        res.status(400);
        throw new Error('Category not found');
    }
    jobCategory.isBlocked = !jobCategory.isBlocked;
    yield jobCategory.save();
    const allJobCategory = yield jobCategoryModel_1.default.find({}).sort({ date: -1 });
    const blocked = jobCategory.isBlocked ? "Blocked" : "Unblocked";
    res.status(200).json({ allJobCategory, message: `You have ${blocked} ${jobCategory.jobCategory}` });
}));
// @desc    Get all posts
// @route   ADMIN /admin/get-posts
// @access  Private
exports.getJobs = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    const totalJobs = yield jobModel_1.default.countDocuments({ isDeleted: false });
    const totalPages = Math.ceil(totalJobs / limit);
    const jobs = yield jobModel_1.default.find({ isDeleted: false })
        .populate('userId')
        .skip(skip)
        .limit(limit);
    if (jobs.length > 0) {
        res.status(200).json({ jobs, totalPages });
    }
    else {
        res.status(404).json({ message: "No Jobs Found" });
    }
}));
// @desc    Block job
// @route   ADMIN /admin/block-user
// @access  Private
exports.jobBlock = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.body.jobId;
    const job = yield jobModel_1.default.findById(jobId);
    if (!job) {
        res.status(400);
        throw new Error('Post not found');
    }
    job.isAdminBlocked = !job.isAdminBlocked;
    yield job.save();
    const jobs = yield jobModel_1.default.find({ isDeleted: false }).populate('userId');
    const blocked = job.isAdminBlocked ? "Blocked" : "Unblocked";
    res.status(200).json({ jobs, message: `Job has been ${blocked}` });
}));
