import express from 'express'
import { LoginController, addJobCategoryController, blockJobCategoryController, chartDataController, dashboardStatsController, getJobCategoryController, getJobsController, getPostsController, getReportsController, getTransactionsController, getUsersController, jobBlockController, postBlockController, userBlockController } from '../controllers/adminController';
import { protectAdmin } from '../middlewares/adminAuth';
const router = express.Router()

router.post('/login',LoginController);
router.get('/get-users',protectAdmin,getUsersController);
router.get('/get-transactions',protectAdmin,getTransactionsController);
router.get('/get-posts',protectAdmin,getPostsController);
router.get('/get-reports',protectAdmin,getReportsController);
router.get('/get-jobs',protectAdmin,getJobsController);
router.post('/user-block',protectAdmin,userBlockController);
router.post('/post-block',protectAdmin,postBlockController);
router.post('/job-block',protectAdmin,jobBlockController);
router.get('/job-category',protectAdmin,getJobCategoryController);
router.post('/add-job-category',protectAdmin,addJobCategoryController);
router.post('/block-job-category',protectAdmin,blockJobCategoryController);
router.get('/chart-data',protectAdmin,chartDataController);
router.get('/dashboard-stats',protectAdmin,dashboardStatsController);

export default router