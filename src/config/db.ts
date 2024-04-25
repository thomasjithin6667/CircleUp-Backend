import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
     ;

    await mongoose.connect("mongodb+srv://thomasjithin:thomas989@cluster0.uvgqy5i.mongodb.net/CircleUp");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;