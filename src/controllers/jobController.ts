import Job from "../models/jobs/jobModel";
import { IJob } from "../models/jobs/jobTypes";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/user/userModel";
import JobApplication from '../models/jobApplications/jobApplicationModel'; 
import { log } from "console";








//add Job

export const addJob =  asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {

    
    
    const {
      userId,
      companyName,
      jobRole,
      experience,
      salary,
      jobType,
      jobLocation,
      lastDateToApply,
      requiredSkills,
      jobDescription,
      qualification,
    } = req.body;

    const newJob = new Job({
      userId,
      companyName,
      jobRole,
      experience,
      salary,
      jobType,
      jobLocation,
      lastDateToApply,
      requiredSkills,
      jobDescription,
      qualification,
      isDeleted: false, 
    });

  
    await newJob.save();

    res.status(201).json({ message: 'Job added successfully', job: newJob });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
)

//editjob
export const editJob = asyncHandler(async (req: Request, res: Response): Promise<void> => {
 console.log("here bitch");
 
 
  try {
    const {
      jobId,
      companyName,
      jobRole,
      experience,
      salary,
      jobType,
      jobLocation,
      lastDateToApply,
      requiredSkills,
      jobDescription,
      qualification,
    } = req.body;
  console.log(req.body);
  
    
    const existingJob = await Job.findById(jobId);

    if (!existingJob) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }

    existingJob.companyName = companyName;
    existingJob.jobRole = jobRole;
    existingJob.experience = experience;
    existingJob.salary = salary;
    existingJob.jobType = jobType;
    existingJob.jobLocation = jobLocation;
    existingJob.lastDateToApply = lastDateToApply;
    existingJob.requiredSkills = requiredSkills;
    existingJob.jobDescription = jobDescription;
    existingJob.qualification = qualification;

    await existingJob.save();

    res.status(200).json({ message: 'Job updated successfully', job: existingJob });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//list job

export const listActiveJobs = async (req: Request, res: Response): Promise<void> => {
  try {
  

    const jobs: IJob[] = await Job.find({ isDeleted: { $ne: true } }).populate({
      path: 'userId',
      select: 'username profileImageUrl',
    });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error listing active jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//list job

export const listUserJobs = async (req: Request, res: Response): Promise<void> => {
  try {
 const{userId}=req.body

 const jobs: IJob[] = await Job.find({ userId: userId, isDeleted: { $ne: true } })
 .populate({
   path: 'userId',
   select: 'username profileImageUrl',
 })
 .exec();

    res.status(200).json({ jobs });
  } catch (error) {
    console.error('Error listing active jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



//get job details
export const jobDetails = async (req: Request, res: Response): Promise<void> => {
  try {
 const{jobId}=req.body


 const job= await Job.findOne({ _id: jobId, isDeleted: { $ne: true } })
 .populate({
   path: 'userId',
   select: 'username profileImageUrl',
 })
 .exec();

    res.status(200).json({ job });
  } catch (error) {
    console.error('Error listing active jobs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//add job application
export const addJobApplication = async (req: Request, res: Response): Promise<void> => {
  console.log("reached addJobApplication ");
  console.log(req.body); 
  console.log(req.file);  
  try {
    const {
      applicantId,
      jobId,
      applicationStatus,
      coverLetter,
    } = req.body;

    const resume = req.file?.path; 

    if (!resume) {
      res.status(400).json({ message: 'No Resume uploaded' });
      return;
    }

    const newJobApplication = new JobApplication({
      applicantId,
      jobId,
      applicationStatus,
      coverLetter,
      resume,
    });

    await newJobApplication.save();

    await User.updateOne({ _id: applicantId }, { $inc: { dailyJobsApplied: 1 } });

    res.status(201).json({ message: 'Job application submitted ', jobApplication: newJobApplication });
  } catch (error) {
    console.error('Error adding job application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
//update application status
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  console.log("reached updateApplicationStatus ");
  
  try {
    const { applicationId,status } = req.body; 
    const jobApplication = await JobApplication.findById(applicationId);

    if (!jobApplication) {
      res.status(404).json({ message: 'Job application not found' });
      return;
    }

    jobApplication.applicationStatus = status;

    await jobApplication.save();

    res.status(200).json({ message: `Job application ${status} successfully`, jobApplication });
  } catch (error) {
    console.error('Error accepting job application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//get employee applications
export const employeeApplications = async (req: Request, res: Response): Promise<void> => {
  console.log("reached  employeeApplications ");
  
  try {

    
    const { applicantId } = req.body;
    console.log(applicantId);
    const applications = await JobApplication.find({applicantId:applicantId })
      .populate({
        path: 'jobId',
        select: 'jobRole companyName jobLocation salary',
      })
      .exec();
      console.log(applications);
      

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching employee applications:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



//get employeer applications
export const employerApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("reached employerApplications");
    const { userId } = req.body;
    const jobs = await Job.find({ userId });
    const jobIds = jobs.map((job) => job._id);

    const applications = await JobApplication.find({ jobId: { $in: jobIds } })
      .populate({
        path: 'applicantId',
        select: 'username profileImageUrl profile.fullname profile.designation',
      })
      .exec();

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching employer applications:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//get all job details
export const getAllJobDetails = async (req: Request, res: Response): Promise<void> => {
  console.log("reached getAllJobDetails");

  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);

    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    const applications = await JobApplication.find({ jobId })
      .populate({
        path: 'applicantId',
        select: 'username profileImageUrl profile.fullname profile.designation',
      })
      .exec();

    res.status(200).json({ success: true, job, applications });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


//cancel job application request
export const cancelJobApplication = async (req: Request, res: Response): Promise<void> => {
  console.log("reached cancelJobApplication");
 
  try {
    const { applicationId } = req.body;

    const jobApplication = await JobApplication.findByIdAndUpdate(
      applicationId,
      { isCanceled: true },
      { new: true }
    );

    if (!jobApplication) {
      res.status(404).json({ success: false, message: 'Job application not found' });
      return;
    }

    res.status(200).json({ success: true, message: 'Job application canceled successfully', jobApplication });
  } catch (error) {
    console.error('Error canceling job application:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
