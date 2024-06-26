"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminAuth_1 = require("../middlewares/adminAuth");
const router = express_1.default.Router();
router.post('/login', adminController_1.LoginController);
router.get('/get-users', adminAuth_1.protectAdmin, adminController_1.getUsersController);
router.get('/get-transactions', adminAuth_1.protectAdmin, adminController_1.getTransactionsController);
router.get('/get-posts', adminAuth_1.protectAdmin, adminController_1.getPostsController);
router.get('/get-reports', adminAuth_1.protectAdmin, adminController_1.getReportsController);
router.get('/get-jobs', adminAuth_1.protectAdmin, adminController_1.getJobsController);
router.post('/user-block', adminAuth_1.protectAdmin, adminController_1.userBlockController);
router.post('/post-block', adminAuth_1.protectAdmin, adminController_1.postBlockController);
router.post('/job-block', adminAuth_1.protectAdmin, adminController_1.jobBlockController);
router.get('/job-category', adminAuth_1.protectAdmin, adminController_1.getJobCategoryController);
router.post('/add-job-category', adminAuth_1.protectAdmin, adminController_1.addJobCategoryController);
router.post('/block-job-category', adminAuth_1.protectAdmin, adminController_1.blockJobCategoryController);
router.get('/chart-data', adminAuth_1.protectAdmin, adminController_1.chartDataController);
router.get('/dashboard-stats', adminAuth_1.protectAdmin, adminController_1.dashboardStatsController);
exports.default = router;
