import express, { Express, Request, Response } from 'express'
import { Login,getUsers,userBlock ,getPosts,postBlock,addJobCategory,getJobCategory,blockJobCategory} from '../controllers/adminController';
const router = express.Router()

router.post('/login',Login);
router.get('/get-users',getUsers);
router.get('/get-posts',getPosts);
router.post('/user-block',userBlock);
router.post('/post-block',postBlock);
router.get('/job-category',getJobCategory);
router.post('/add-job-category',addJobCategory);
router.post('/block-job-category',blockJobCategory);

export default router