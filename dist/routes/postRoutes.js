"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const commentController_1 = require("../controllers/commentController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/delete-post-comment', auth_1.protect, commentController_1.deletePostComment);
router.post('/add-post', auth_1.protect, postController_1.addPost);
router.get('/get-post', auth_1.protect, postController_1.getPost);
router.put('/edit-post', auth_1.protect, postController_1.editPost);
router.post('/get-user-post', auth_1.protect, postController_1.getUserPost);
router.post('/delete-post', auth_1.protect, postController_1.deletePost);
router.patch('/like-post', auth_1.protect, postController_1.likePost);
router.post('/get-post-comments', auth_1.protect, commentController_1.getCommentsByPostId);
router.post('/add-comment', auth_1.protect, commentController_1.addComment);
router.post('/reply-comment', auth_1.protect, commentController_1.addReplyComment);
router.post("/report-post", auth_1.protect, postController_1.reportPostController);
router.post("/save-post", auth_1.protect, postController_1.savePostController);
router.get("/user-saved-post/:userId", auth_1.protect, postController_1.getSavedPostController);
exports.default = router;
