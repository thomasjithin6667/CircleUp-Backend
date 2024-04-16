import express from "express";
import {
addJob, addJobApplication, cancelJobApplication, editJob, employeeApplications, employerApplications, getAllJobDetails, jobDetails, listActiveJobs,
listUserJobs,
updateApplicationStatus,
viewJob
} from "../controllers/jobController";
import { Request, Response, NextFunction } from 'express';

import multer, { Multer } from 'multer'; 
import path from 'path';
import fs from 'fs';
import { addInterview, editInterview, setInterviewStatus } from "../controllers/interviewController";


const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/uploads'); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = file.originalname.replace(ext, '');
    cb(null, `${filename}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

upload.any();


router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(req);
  
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    res.status(400).json({ error: 'File upload failed', message: err.message });
  } else { 
    console.error('Other error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/add-job',addJob);
router.post('/edit-job',editJob);
router.post('/view-job',viewJob)
router.post('/list-all-job',listActiveJobs);
router.post('/list-user-job',listUserJobs)
router.post('/job-details',jobDetails)
router.post('/apply-job',upload.single('resume'),addJobApplication)
router.post('/update-application-status',updateApplicationStatus)
router.post('/get-applications-employee',employeeApplications)
router.post('/get-applications-empolyer',employerApplications)
router.post('/get-all-job-details',getAllJobDetails)
router.post('/cancel-job-application',cancelJobApplication)
router.post('/add-interview',addInterview)
router.post('/edit-interview',editInterview)
router.post('/edit-interview-status',setInterviewStatus)
export default router;