import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MongoDB URI missing");
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGO_URI, {
      dbName: "arafat", // optional: your database name
    });

    isConnected = true;
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB Error:", error);
  }
}
