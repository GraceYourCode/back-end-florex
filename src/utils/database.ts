import dotenv from 'dotenv';
import mongoose from "mongoose";

let isConnected: boolean = false;
dotenv.config();

const dataBaseURI = process.env.MONGODB_URI as string;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDb is already connected");
    return mongoose;
  }

  try {
    await mongoose.connect(dataBaseURI, {
      dbName: "future-forex",
      
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });

    isConnected = true;

    console.log("Database is connected");
    return mongoose;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
