// types.ts

import { Document, Types } from 'mongoose';

// Define the qualification schema
export interface Qualification {
  course: string;
  institution: string;
  yearOfCompletion: number;
}

// Define the experience schema
export interface Experience {
  jobPosition: string;
  yearOfJoining: number;
  companyName: string;
}

// Enum for user types
export enum UserType {
  Company = 'company',
  Individual = 'individual',
}

// Define the profile schema
export interface Profile {
  about?: string;
  location?: string;
  qualification?: Qualification[];
  experience?: Experience[];
  skills?: string[];
  resume?: string;
  gender?: string;
}

// Define the company profile schema
export interface CompanyProfile {
  companyName?: string;
  companyLocation?: string;
  aboutCompany?: string;
  noOfEmployees?: number;
}

// Define the user document interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isHiring: boolean;
  isBlocked: boolean;
  isGoogle:boolean;
  isFacebook:boolean;
  isOnline: boolean;
  userType: UserType;
  profile: Profile;
  companyProfile?: CompanyProfile;
  phone?: string;
  savedPosts: Types.ObjectId[];
  savedJobs: Types.ObjectId[];
  isActive: boolean;
  profileImageUrl?: string;
  timestamp: Date;
}
