import Job from "../models/jobs/jobModel";
import { IJob } from "../models/jobs/jobTypes";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import User from "../models/user/userModel";
import JobApplication from '../models/jobApplications/jobApplicationModel'; 
import path from "path";
import { createNotification } from "../utils/notificationSetter";
import mongoose from "mongoose";


interface IFilterData {
  jobRole?: string;
  location?: string;
  jobType?: string;
  salaryRange?: string;
  experienceRange?: string;
}







//add Job

export const addJob =  asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {

    
    
    const {
      userId,
      companyName,
      jobRole,
      experience: experienceString,
      salary: salaryString,
      jobType,
      jobLocation,
      lastDateToApply,
      requiredSkills,
      jobDescription,
      qualification,
    } = req.body;
    const experience = parseInt(experienceString, 10);
    const salary = parseInt(salaryString, 10);

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
 
 
  try {
    const {
      jobId,
      companyName,
      jobRole,
      experience: experienceString,
      salary: salaryString,
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
    const experience = parseInt(experienceString, 10);
    const salary = parseInt(salaryString, 10);

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
    const { userId, filterData } = req.body;
    console.log(filterData);
    
    const userApplications: mongoose.Types.ObjectId[] = await JobApplication.find({
      applicantId: userId,
      isDeleted: { $ne: true },
    }).distinct('jobId');

    
    const filterCriteria: any = {
      isDeleted: { $ne: true },
      userId: { $ne: userId }, 
      isAdminBlocked:false ,
      _id: { $nin: userApplications },
    };

    if (filterData) {
      if (filterData.jobRole) {
        filterCriteria.jobRole = filterData.jobRole;
      }
      if (filterData.location) {
        filterCriteria.jobLocation = filterData.location;
      }
      if (filterData.jobType) {
        filterCriteria.jobType = filterData.jobType;
      }
      if (filterData.salaryRange&&filterData.salaryRange!=0) {
        console.log("hello");
        
        const maxSalary = parseFloat(filterData.salaryRange); 
        filterCriteria.salary = { $lte: maxSalary }; 
      }
      if (filterData.experienceRange&&filterData.experienceRange!=0) {
        console.log("hellsfo");
        const maxExp = parseFloat(filterData.experienceRange); 
        filterCriteria.experience = { $lte: maxExp }; 
      }
    }

    const jobs: IJob[] = await Job.find(filterCriteria)
      .populate({ path: 'userId', select: 'username profileImageUrl' });

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

 const jobs: IJob[] = await Job.find({ userId: userId, isDeleted: { $ne: true }})
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

  try {
    const {
      applicantId,
      jobId,
      applicationStatus,
      coverLetter,
    } = req.body;
    const resumePath = req.file?.path; 
    const resumeName = resumePath ? path.basename(resumePath) : null; 

    if (!resumeName) {
      res.status(400).json({ message: 'No Resume uploaded' });
      return;
    }

    const newJobApplication = new JobApplication({
      applicantId,
      jobId,
      applicationStatus,
      coverLetter,
      resume: resumeName,
    });

    await newJobApplication.save();
    const job = await Job.findOne({_id:jobId})
    const notificationData = {
      senderId:applicantId,
      receiverId: job?.userId,
      message: `applied for the postion of ${job?.jobRole} at ${job?.companyName} `,
      link: `/visit-profile/posts/`, 
      read: false, 
      jobId:jobId
   
    };

    createNotification(notificationData)

    

    await User.updateOne({ _id: applicantId }, { $inc: { dailyJobsApplied: 1 } });
    const user=await User.find({_id:applicantId})

    res.status(201).json({ message: 'Job application submitted ', jobApplication: newJobApplication ,user:user});
  } catch (error) {
    console.error('Error adding job application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


//update application status
export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {

  
  try {
    const { applicationId,status,userId } = req.body; 
    const jobApplication = await JobApplication.findById(applicationId).populate({
      path:'jobId',
      select:'userId'
    });

    if (!jobApplication) {
      res.status(404).json({ message: 'Job application not found' });
      return;
    }

    jobApplication.applicationStatus = status;

    await jobApplication.save();

    const jobs = await Job.find({ userId });
    const job = await Job.findOne({_id:jobApplication.jobId})

    const jobIds = jobs.map((job) => job._id);
    const applications = await JobApplication.find({ jobId: { $in: jobIds }})
    .populate({
      path: 'applicantId',
      select: 'username profileImageUrl profile.fullname profile.designation companyProfile.companyName',
    })
    .populate('jobId')
    .exec();

    const jobSpecificApplications = await JobApplication.find({ jobId:jobApplication.jobId }) .populate('applicantId').populate('jobId')
    .exec();


      if(status=="Accepted"){
        
    const notificationData = {
      senderId:userId,
      receiverId: jobApplication.applicantId,
      message: 'accepted your job application',
      link: `/visit-profile/posts/`, 
      read: false, 
      applicationId:applicationId
   
    };

    createNotification(notificationData)
      }else{
        const notificationData = {
          senderId:userId,
          receiverId:  jobApplication.applicantId,
          message: 'rejected your job application',
          link: `/visit-profile/posts/`, 
          read: false, 
          applicationId:applicationId
       
        };
    
        createNotification(notificationData)





      }



    res.status(200).json({ message: `Job application ${status} successfully`, applications,jobSpecificApplications });
  } catch (error) {
    console.error('Error accepting job application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//cancel applciation
export const cancelJobApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationId ,applicantId} = req.body; 
    const jobApplication = await JobApplication.findById(applicationId);

    if (!jobApplication) {
      res.status(404).json({ message: 'Job application not found' });
      return;
    }
    jobApplication.isDeleted = !jobApplication.isDeleted;

    await jobApplication.save();

    const applications = await JobApplication.find({ applicantId ,
      isDeleted: { $ne: true}}) .populate('applicantId').populate('jobId')
      .exec();

    res.status(200).json({ success: true,message:"Application Canceled", applications });
  } catch (error) {
    console.error('Error fetching employee applications:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



export const employeeApplications = async (req: Request, res: Response): Promise<void> => {
  console.log("reached employeeApplications ");
  
  try {
    const { applicantId } = req.body;

    const applications = await JobApplication.find({ applicantId ,
      isDeleted: { $ne: true}}) .populate('applicantId').populate('jobId')
      .exec();

    res.status(200).json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching employee applications:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

//viewjob
export const viewJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.body;

    // Get job details
    const job = await Job.findOne({ _id: jobId, isDeleted: { $ne: true } })
      .populate({
        path: 'userId',
        select: 'username profileImageUrl',
      })
      .exec();

    // Get job applications
    const applications = await JobApplication.find({ jobId,
      isDeleted: { $ne: true }}) .populate('applicantId').populate('jobId')
      .exec();

    res.status(200).json({ success: true, job, applications });
  } catch (error) {
    console.error('Error fetching job and applications:', error);
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
    const applications = await JobApplication.find({ jobId: { $in: jobIds } }) .populate('applicantId').populate('jobId')
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

    const applications = await JobApplication.find({ jobId }) .populate('applicantId').populate('jobId')
      .exec();

    res.status(200).json({ success: true, job, applications });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



export const getFormSelectData = async (req: Request, res: Response): Promise<void> => {
  try {
    const distinctLocations= await Job.distinct('jobLocation').sort();
    const distinctRoles = await Job.distinct('jobRole').sort();

    res.status(200).json({ locations: distinctLocations, roles: distinctRoles });
  } catch (error) {
    console.error('Error fetching distinct job data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};