import express from 'express'
import { addPost,getPost,editPost,getUserPost,deletePost,likePost, reportPostController, savePostController, getSavedPostController} from '../controllers/postController';
import {getCommentsByPostId,addComment,addReplyComment,deletePostComment} from '../controllers/commentController';
import { protect } from '../middlewares/auth';


const router = express.Router()
router.get('/delete-post-comment', protect,deletePostComment);
router.post('/add-post', protect,addPost);
router.get('/get-post', protect,getPost);
router.put('/edit-post', protect,editPost);
router.post('/get-user-post', protect,getUserPost);
router.post('/delete-post', protect,deletePost);
router.patch('/like-post', protect,likePost);
router.post('/get-post-comments', protect,getCommentsByPostId);
router.post('/add-comment', protect,addComment);
router.post('/reply-comment', protect,addReplyComment);
router.post("/report-post",protect,reportPostController);
router.post( "/save-post",protect,savePostController);
router.get("/user-saved-post/:userId",protect, getSavedPostController);




export default router;