import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
     ;

    await mongoose.connect(process.env.MONGO_URL as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;