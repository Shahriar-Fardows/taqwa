import { NextResponse } from "next/server"
import mongoose, { Schema } from "mongoose"
import { connectDB } from "@/lib/db"

// ==============================
// MEDIA / GALLERY SCHEMA
// ==============================
const MediaSchema = new Schema(
  {
    // এই মিডিয়াটা কি ধরনের? (image অথবা video)
    type: { 
      type: String, 
      enum: ["image", "video"], 
      default: "image" 
    },

    // ছবির বা ভিডিওর ডাইরেক্ট লিংক (Cloudinary/YouTube URL)
    url: { type: String, required: true },

    // ভিডিওর জন্য থাম্বনেইল (অপশনাল, শুধু ভিডিওর ক্ষেত্রে কাজে লাগবে)
    thumbnail: { type: String, default: "" },

    // মিডিয়ার টাইটেল বা ক্যাপশন (Text)
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    
    // ক্যাটাগরি (যেমন: "Work", "Life", "Tutorials")
    category: { type: String, default: "General" },
  },
  { timestamps: true }
)

// Prevent model overwrite
const Media = mongoose.models.Media || mongoose.model("Media", MediaSchema)

/* ============================
   GET ALL MEDIA
============================ */
export async function GET(req: Request) {
  await connectDB()
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type") // যদ শুধু image বা video ফিল্টার করতে চাও

    let query = {}
    if (type) {
      query = { type: type }
    }

    const mediaList = await Media.find(query).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: mediaList })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching media" }, { status: 500 })
  }
}

/* ============================
   ADD NEW MEDIA (Image/Video)
============================ */
export async function POST(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { type, url, thumbnail, title, description, category } = body

    if (!url) {
      return NextResponse.json({ success: false, message: "URL is required" }, { status: 400 })
    }

    const newMedia = await Media.create({
      type: type || "image", // ডিফল্ট হিসেবে image ধরবে
      url,
      thumbnail: thumbnail || "",
      title: title || "",
      description: description || "",
      category: category || "General",
    })

    return NextResponse.json({
      success: true,
      message: "Media added successfully",
      data: newMedia,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error adding media" }, { status: 500 })
  }
}

/* ============================
   UPDATE MEDIA INFO
============================ */
export async function PUT(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id, type, url, thumbnail, title, description, category } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const updatedMedia = await Media.findByIdAndUpdate(
      id,
      { type, url, thumbnail, title, description, category },
      { new: true }
    )

    if (!updatedMedia) {
      return NextResponse.json({ success: false, message: "Media not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Media updated successfully",
      data: updatedMedia,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating media" }, { status: 500 })
  }
}

/* ============================
   DELETE MEDIA
============================ */
export async function DELETE(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const deleted = await Media.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Media not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Media deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting media" }, { status: 500 })
  }
}