import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  userId: Schema.Types.ObjectId;
  companyName: string;
  jobRole?: string;
  experience: number;
  salary?: number;
  jobType: string;
  jobLocation: string;
  lastDateToApply: Date;
  requiredSkills: string;
  jobDescription?: string;
  qualification?: string;
  isDeleted: boolean;
}