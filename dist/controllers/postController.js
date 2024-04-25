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
exports.getSavedPostController = exports.savePostController = exports.reportPostController = exports.likePost = exports.deletePost = exports.editPost = exports.getUserPost = exports.getPost = exports.addPost = void 0;
const postModel_1 = __importDefault(require("../models/post/postModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const notificationSetter_1 = require("../utils/notificationSetter");
const notificationsModel_1 = __importDefault(require("../models/notifications/notificationsModel"));
const reportModel_1 = __importDefault(require("../models/reports/reportModel"));
const userModel_1 = __importDefault(require("../models/user/userModel"));
const jobModel_1 = __importDefault(require("../models/jobs/jobModel"));
// @desc    Create new post
// @route   POST /post/create-post
// @access  Public
exports.addPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, imageUrl, title, description, hideLikes, hideComment } = req.body;
    console.log(userId, imageUrl, description, hideLikes, hideComment);
    if (!userId || !imageUrl || !description) {
        res.status(400);
        throw new Error("Provide all details");
    }
    const post = yield postModel_1.default.create({
        userId,
        imageUrl,
        title,
        description,
        hideComment,
        hideLikes,
    });
    if (!post) {
        res.status(400);
        throw new Error("Cannot add post");
    }
    const posts = yield postModel_1.default.find({ isBlocked: false, isDeleted: false }).populate({
        path: 'userId',
        select: 'username profileImageUrl'
    }).sort({ date: -1 });
    if (posts.length == 0) {
        res.status(400);
        throw new Error("No Post available");
    }
    res.status(200).json({ message: "Post added successfully", posts: posts });
}));
// @desc    Get all Posts
// @route   get /post/get-post
// @access  Public
exports.getPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield postModel_1.default.find({ isBlocked: false, isDeleted: false })
        .populate({
        path: 'userId',
        select: 'username profileImageUrl'
    })
        .populate({
        path: 'likes',
        select: 'username profileImageUrl'
    })
        .sort({ date: -1 });
    res.status(200).json(posts);
}));
// @desc    Get User Posts
// @route   get /post/get-post
// @access  Public
exports.getUserPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.userId;
    console.log(id);
    const posts = yield postModel_1.default.find({ userId: id, isBlocked: false, isDeleted: false }).populate({
        path: 'userId',
        select: 'username profileImageUrl'
    }).sort({ date: -1 });
    if (posts.length == 0) {
        res.status(400);
        throw new Error("No Post available");
    }
    res.status(200).json(posts);
}));
// @desc    Edit Post
// @route   POST /post/update-post
// @access  Public
exports.editPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId, title, description, hideComment, hideLikes } = req.body;
    const post = yield postModel_1.default.findById(postId);
    if (!post) {
        res.status(400);
        throw new Error("Post cannot be found");
    }
    if (title)
        post.title = title;
    if (description)
        post.description = description;
    if (hideComment !== undefined)
        post.hideComment = hideComment;
    if (hideLikes !== undefined)
        post.hideLikes = hideLikes;
    yield post.save();
    const posts = yield postModel_1.default.find({ userId: userId, isBlocked: false, isDeleted: false }).populate({
        path: 'userId',
        select: 'username profileImageUrl'
    }).sort({ date: -1 });
    res.status(200).json(posts);
}));
// @desc    Delete Post
// @route   POST /post/delete-post
// @access  Public
exports.deletePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, userId } = req.body;
    console.log(postId, userId);
    const post = yield postModel_1.default.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error("Post Cannot be found");
    }
    post.isDeleted = true;
    yield post.save();
    const posts = yield postModel_1.default.find({ userId: userId, isBlocked: false, isDeleted: false }).populate({
        path: 'userId',
        select: 'username profileImageUrl'
    }).sort({ date: -1 });
    res.status(200).json({ posts });
}));
// @desc    Like Post
// @route   POST /post/like-post
// @access  Public
exports.likePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, userId } = req.body;
    const post = yield postModel_1.default.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error("Post not found");
    }
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
        yield postModel_1.default.findOneAndUpdate({ _id: postId }, { $pull: { likes: userId } }, { new: true });
        yield notificationsModel_1.default.findOneAndDelete({ senderId: userId, receiverId: post.userId, message: 'liked your post' });
    }
    else {
        const notificationData = {
            senderId: userId,
            receiverId: post.userId,
            message: 'liked your post',
            link: `/visit-profile/posts/${post.userId}`,
            read: false,
            postId: postId
        };
        (0, notificationSetter_1.createNotification)(notificationData);
        yield postModel_1.default.findOneAndUpdate({ _id: postId }, { $push: { likes: userId } }, { new: true });
    }
    const posts = yield postModel_1.default.find({ userId: userId, isBlocked: false, isDeleted: false }).populate({
        path: 'userId',
        select: 'username profileImageUrl'
    }).sort({ date: -1 });
    res.status(200).json({ posts });
}));
// @desc   Post Report
// @route   POST /post/Report-Post
// @access  Public
exports.reportPostController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, postId, cause } = req.body;
    const existingReport = yield reportModel_1.default.findOne({ userId, postId });
    if (existingReport) {
        res.status(400);
        throw new Error("You have already reported this post.");
    }
    const report = new reportModel_1.default({
        userId,
        postId,
        cause,
    });
    yield report.save();
    const reportCount = yield reportModel_1.default.countDocuments({ postId });
    const REPORT_THRESHOLD = 3;
    if (reportCount >= REPORT_THRESHOLD) {
        yield postModel_1.default.findByIdAndUpdate(postId, { isBlocked: true });
        res
            .status(200)
            .json({ message: "Post has been blocked due to multiple reports." });
        return;
    }
    res.status(200).json({ message: "Post has been reported successfully." });
}));
// @desc    Save Post
// @route   POST /post/like-post
// @access  Public
exports.savePostController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, jobId, userId } = req.body;
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }
    if (postId) {
        const isSavedPosts = user.savedPosts.includes(postId);
        if (isSavedPosts) {
            yield userModel_1.default.findOneAndUpdate({ _id: userId }, { $pull: { savedPosts: postId } }, { new: true });
        }
        else {
            yield userModel_1.default.findOneAndUpdate({ _id: userId }, { $push: { savedPosts: postId } }, { new: true });
        }
    }
    if (jobId) {
        const isSavedJobs = user.savedJobs.includes(jobId);
        if (isSavedJobs) {
            yield userModel_1.default.findOneAndUpdate({ _id: userId }, { $pull: { savedJobs: jobId } }, { new: true });
        }
        else {
            yield userModel_1.default.findOneAndUpdate({ _id: userId }, { $push: { savedJobs: jobId } }, { new: true });
        }
    }
    const UpdatedUser = yield userModel_1.default.findOne({ _id: userId });
    res.status(201).json({ user: UpdatedUser });
}));
// @desc    Get User Saved Posts
// @route   get /post/get-saved-post
// @access  Public
exports.getSavedPostController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.userId;
    const user = yield userModel_1.default.findOne({ _id: id, isBlocked: false }, { savedPosts: 1, savedJobs: 1, _id: 0 });
    if (user) {
        const savedPostIds = user.savedPosts;
        const posts = yield postModel_1.default.find({ _id: { $in: savedPostIds } }).populate("userId");
        const savedJobIds = user.savedJobs;
        const jobs = yield jobModel_1.default.find({ _id: { $in: savedJobIds } }).populate("userId");
        res.status(200).json({ posts, jobs });
    }
    else {
        res.status(400);
        throw new Error("User Not Found");
    }
}));
