import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL) {
    console.log("Please add your Mongo URI to .env.local");
  }
  if (isConnected) {
    console.log("Connected to mongoosedb");
    return;
  }
  try {
    if (process.env.MONGODB_URL) {
      await mongoose.connect(process.env.MONGODB_URL); ///due to ts we have to check first that process.env.MONGODB_URL is not null

      isConnected = true;

      console.log("Connected to mongoosedb");
    }
  } catch (error) {
    console.log("Error connecting to mongoosedb", error);
  }
};

// 0g0yVZ9JBXl9GZzf
