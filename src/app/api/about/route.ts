import { NextResponse } from "next/server"
import mongoose, { Schema } from "mongoose"
import { connectDB } from "@/lib/db"

// Create schema directly here
const AboutSchema = new Schema(
  {
    // সেকশনের নাম (যেমন: "My Story", "Mission", "Team")
    title: { type: String, required: true },
    
    // Flexible Field: এখানে তুমি String, Array, Object যা খুশি রাখতে পারবে
    details: { type: Schema.Types.Mixed, required: true },
    
    // অপশনাল: ইমেজ বা অন্য কিছুর লিংক
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true },
)

// Prevent re-registering model
const About = mongoose.models.About || mongoose.model("About", AboutSchema)

/* ============================
   GET ALL ABOUT INFO
============================ */
export async function GET() {
  await connectDB()
  try {
    const aboutData = await About.find().sort({ createdAt: -1 }) // নতুন ডাটা আগে দেখাবে
    return NextResponse.json({ success: true, data: aboutData })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching data" }, { status: 500 })
  }
}

/* ============================
   CREATE NEW ABOUT SECTION
============================ */
export async function POST(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { title, details, imageUrl } = body

    if (!title || !details) {
      return NextResponse.json({ success: false, message: "Title and details are required" }, { status: 400 })
    }

    const newAbout = await About.create({
      title,
      details, // এখানে তুমি যা পাঠাবে তাই সেভ হবে
      imageUrl: imageUrl || "",
    })

    return NextResponse.json({
      success: true,
      message: "About section created",
      data: newAbout,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error creating data" }, { status: 500 })
  }
}

/* ============================
   UPDATE ABOUT SECTION
============================ */
export async function PUT(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id, title, details, imageUrl } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const updated = await About.findByIdAndUpdate(
      id,
      {
        title,
        details,
        imageUrl,
      },
      { new: true },
    )

    if (!updated) {
      return NextResponse.json({ success: false, message: "Data not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "About section updated",
      data: updated,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating data" }, { status: 500 })
  }
}

/* ============================
   DELETE ABOUT SECTION
============================ */
export async function DELETE(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const deleted = await About.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Data not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "About section deleted",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting data" }, { status: 500 })
  }
}