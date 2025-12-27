import { NextResponse } from "next/server";
import mongoose, { Schema } from "mongoose";
import { connectDB } from "@/lib/db";

/* ================= Sub Schemas ================= */

const SocialSchema = new Schema({
  id: String,
  platform: String,
  url: String,
}, { _id: false });

const TeamSchema = new Schema({
  id: String,
  name: String,
  role: String,
  image: String,
  bio: String,
  socials: [SocialSchema],
}, { _id: false });

const ExperienceSchema = new Schema({
  id: String,
  role: String,
  company: String,
  year: String,
  description: String,
}, { _id: false });

/* ================= Main Schema ================= */

const AboutSchema = new Schema({
  // Basic Info
  name: { type: String, default: "" },
  designation: { type: String, default: "" },
  tagline: { type: String, default: "" },
  description: { type: String, default: "" },
  imageUrl: { type: String, default: "" },

  // Arrays
  skills: [String],
  experiences: [ExperienceSchema],
  team: [TeamSchema],
}, { timestamps: true });

// Prevent model overwrite
const About = mongoose.models.About || mongoose.model("About", AboutSchema);

/* ================= GET ================= */

export async function GET() {
  await connectDB();
  try {
    const data = await About.findOne();
    return NextResponse.json(
      data || {
        name: "",
        designation: "",
        tagline: "",
        description: "",
        imageUrl: "",
        skills: [],
        experiences: [],
        team: [],
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching data" },
      { status: 500 }
    );
  }
}

/* ================= PUT ================= */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: { json: () => any; }) {
  await connectDB();
  try {
    const body = await req.json();
    const existing = await About.findOne();

    // যেহেতু স্কিমা থেকে Hero/Stats ফিল্ড সরানো হয়েছে, 
    // তাই ফ্রন্টেন্ড থেকে ভুল করে পাঠালেও সেগুলো ডাটাবেসে সেভ হবে না।
    const data = existing
      ? await About.findByIdAndUpdate(existing._id, body, {
          new: true,
          runValidators: true,
        })
      : await About.create(body);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json(
      { success: false, message: "Error updating data" },
      { status: 500 }
    );
  }
}