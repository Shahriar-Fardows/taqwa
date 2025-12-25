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
  name: String,
  designation: String,
  tagline: String,
  description: String,
  imageUrl: String,
  skills: [String],
  experiences: [ExperienceSchema],
  team: [TeamSchema],
}, { timestamps: true });

const About =
  mongoose.models.About || mongoose.model("About", AboutSchema);

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
      { success: false },
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

    const data = existing
      ? await About.findByIdAndUpdate(existing._id, body, {
          new: true,
          runValidators: true,
        })
      : await About.create(body);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
