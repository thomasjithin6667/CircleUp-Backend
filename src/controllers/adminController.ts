import express, { Request, Response } from "express";
import Post from "../models/post/postModel";


import asyncHandler from "express-async-handler";
import Admin from "../models/admin/adminModel";


import User from "../models/user/userModel";
import JobCategory from "../models/jobCategory/jobCategoryModel";
import Job from "../models/jobs/jobModel";
import generateAdminToken from "../utils/generateAdminToken";
import Report from "../models/reports/reportModel";
import PremiumUsers from "../models/premium/premiumModel";



// @desc    Admin Login
// @route   ADMIN /Admin/login
// @access  Private

export const LoginController = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  
  
  if (admin && password=== admin.password) {
      res.status(200).json({
        message: "Login Successful",
          _id: admin.id,
          name: admin.name,
          email: admin.email,
          profileImg: admin.profileImg,
          token: generateAdminToken(admin.id),
      });
  } else {
      res.status(400);
      throw new Error("Invalid Credentials");
  }
});



// @desc    Get all users
// @route   ADMIN /admin/get-users
// @access  Private

export const getUsersController = asyncHandler(async (req: Request, res: Response) => {


  
  const page: number = parseInt(req.query.page as string, 10) || 1;
  const limit: number = 6;
  const skip: number = (page - 1) * limit;


  const totalUsers: number = await User.countDocuments({});
  const totalPages: number = Math.ceil(totalUsers / limit);

  const users = await User.find({}).skip(skip).limit(limit);

  if (users.length > 0) {
    res.status(200).json({ users, totalPages });
  } else {
    res.status(404).json({ message: "Users Not Found" });
  }
});

  // @desc    Get all posts
// @route   ADMIN /admin/get-posts
// @access  Private

export const getPostsController = asyncHandler(async (req: Request, res: Response) => {
  const page: number = parseInt(req.query.page as string, 10) || 1;
  const limit: number = 6;
  const skip: number = (page - 1) * limit;

  const totalPosts: number = await Post.countDocuments({ isDeleted: false });
  const totalPages: number = Math.ceil(totalPosts / limit);

  const posts = await Post.find({ isDeleted: false })
    .populate({
      path: 'userId',
      select: 'username profileImageUrl email'
    })
    .skip(skip)
    .limit(limit);

  if (posts.length > 0) {
    res.status(200).json({ posts, totalPages });
  } else {
    res.status(404).json({ message: "No Posts Found" });
  }
});


  // @desc    Get all reports
// @route   ADMIN /admin/get-posts
// @access  Private


export const getReportsController = asyncHandler(async (req: Request, res: Response) => {
  const page: number = parseInt(req.query.page as string, 10) || 1;
  const limit: number = 6;
  const skip: number = (page - 1) * limit;

  const totalPosts: number = await Post.countDocuments({ isDeleted: false });
  const totalPages: number = Math.ceil(totalPosts / limit);

  const reports = await Report.find()
    .populate({
      path: 'userId',
      select: 'username profileImageUrl email'
    })
    .populate({
      path: 'postId',
      populate: {
        path: 'userId',
        select: 'username profileImageUrl email'
      }
    })
    .skip(skip)
    .limit(limit);

  if (reports.length > 0) {
    res.status(200).json({ reports, totalPages });
  } else {
    res.status(404).json({ message: "No Posts Found" });
  }
});

// @desc    Block Users
// @route   ADMIN /admin/block-user
// @access  Private

  export const userBlockController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.body.userId; 
    console.log(req.body)
    const user = await User.findById(userId)
  
    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }
  
    user.isBlocked = !user.isBlocked;
    await user.save();
  
    const users = await User.find({});
    const blocked = user.isBlocked?"Blocked":"Unblocked"
    res.status(200).json({ users,message: `You have ${blocked} ${user.username}`});
  });


  // @desc    Block post
// @route   ADMIN /admin/block-user
// @access  Private

export const postBlockController = asyncHandler(async (req: Request, res: Response) => {
  const postId = req.body.postId; 
 
  const post = await Post.findById(postId)

  if (!post) {
    res.status(400);
    throw new Error('Post not found');
  }

  post.isBlocked = !post.isBlocked;
  await post.save();

  const posts = await Post.find({});
  const blocked = post.isBlocked?"Blocked":"Unblocked"

  res.status(200).json({ posts,message:`post has been ${blocked}`});
});



// @desc    Add job category
// @route   ADMIN /admin/get-users
// @access  Private

export const addJobCategoryController = asyncHandler(async (req: Request, res: Response) => {
   console.log("Reached here");
   
  const { jobCategory} = req.body;

  
  const existingJobCategory= await JobCategory.find({jobCategory});
  if (existingJobCategory.length > 0) {
    res.status(404);
    throw new Error("Job category Already Exist");
  } else {
    await JobCategory.create({jobCategory});

    const allJobCategory = await JobCategory.find({}).sort({date:-1});
    res.status(200).json({ message: "Job cateory added", jobCategory: allJobCategory });
  }
});





    // @desc    Get all job Categoory
// @route   ADMIN /admin/get-users
// @access  Private

export const getJobCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const page: number = parseInt(req.query.page as string, 10) || 1;
  const limit: number = 5; 
  const skip: number = (page - 1) * limit;

  const totalJobCategories: number = await JobCategory.countDocuments({});
  const totalPages: number = Math.ceil(totalJobCategories / limit);

  const jobCategory = await JobCategory.find({})
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  if (jobCategory.length > 0) {
    res.status(200).json({ jobCategory, totalPages });
  } else {
    res.status(404).json({ message: "No Job Categories Found" });
  }
});


// @desc     block job Category 
// @route   ADMIN /admin/block-job-category
// @access  Private

export const blockJobCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const jobCategoryId = req.body.jobCategoryId; 
  console.log(req.body)
  const jobCategory = await JobCategory.findById(jobCategoryId)

  if (!jobCategory) {
    res.status(400);
    throw new Error('Category not found');
  }

  jobCategory.isBlocked = !jobCategory.isBlocked;
  await jobCategory.save();

  const allJobCategory = await JobCategory.find({}).sort({date:-1});
  const blocked = jobCategory.isBlocked?"Blocked":"Unblocked"
  res.status(200).json({ allJobCategory,message: `You have ${blocked} ${jobCategory.jobCategory}`});
});



  // @desc    Get all posts
// @route   ADMIN /admin/get-posts
// @access  Private
export const getJobsController = asyncHandler(async (req: Request, res: Response) => {
  const page: number = parseInt(req.query.page as string, 10) || 1;
  const limit: number = 6; 
  const skip: number = (page - 1) * limit;

  const totalJobs: number = await Job.countDocuments({ isDeleted: false });
  const totalPages: number = Math.ceil(totalJobs / limit);

  const jobs = await Job.find({ isDeleted: false })
    .populate('userId')
    .skip(skip)
    .limit(limit);

  if (jobs.length > 0) {
    res.status(200).json({ jobs, totalPages });
  } else {
    res.status(404).json({ message: "No Jobs Found" });
  }
});

  // @desc    Block job
// @route   ADMIN /admin/block-user
// @access  Private

export const jobBlockController = asyncHandler(async (req: Request, res: Response) => {
  const jobId = req.body.jobId; 
 
  const job = await Job.findById(jobId)

  if (!job) {
    res.status(400);
    throw new Error('Post not found');
  }

  job.isAdminBlocked = !job.isAdminBlocked;
  await job.save();

  const  jobs = await Job.find({ isDeleted:false}).populate('userId');
  const blocked = job.isAdminBlocked?"Blocked":"Unblocked"

  res.status(200).json({ jobs,message:`Job has been ${blocked}`});
});




// @desc    get Transactions
// @route   ADMIN /admin/transactions
// @access  Public
  
export const getTransactionsController = asyncHandler(async (req: Request, res: Response) => {
  const page: number = parseInt(req.query.page as string, 10) || 1;
  const limit: number = 6;
  const skip: number = (page - 1) * limit;


  const totalTransactions: number = await PremiumUsers.countDocuments({});
  const totalPages: number = Math.ceil(totalTransactions/ limit);

  const transactions = await PremiumUsers.find()  
.populate({
  path: "userId",
  select: "username profileImageUrl email isPremium",
}).skip(skip).limit(limit);


  if ( transactions.length > 0) {
    res.status(200).json({ transactions, totalPages });
  } else {
    res.status(404).json({ message: "Transactions Not Found" });
  }
});



// @desc    Chart Data
// @route   ADMIN /admin/chart-data
// @access  Public

export const chartDataController = asyncHandler(
  async (req: Request, res: Response) => {
    const userJoinStats = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          userCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const postCreationStats = await Post.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          postCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const jobCreationStats = await Job.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          jobCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const chartData = {
      userJoinStats,
      postCreationStats,
      jobCreationStats,
    };

    res.json(chartData);
  }
);


// @desc    Dashboard Stats
// @route   ADMIN /admin/dashboard-stats
// @access  Public

export const dashboardStatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const totalUsers = await User.countDocuments();

    const totalPosts = await Post.countDocuments();

    const totalJobs  = await Job.countDocuments();

    const totalSales = await PremiumUsers.countDocuments();

    const totalJobsCategories = await JobCategory.countDocuments();
    const totalReports = await Report.countDocuments();
    const stats = {
      totalUsers,
      totalPosts,
      totalJobs,
      totalSales,
      totalJobsCategories,
      totalReports,
    };


    res.status(200).json(stats);
  }
);
