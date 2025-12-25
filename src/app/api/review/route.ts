import { NextResponse } from "next/server"
import mongoose, { Schema } from "mongoose"
import { connectDB } from "@/lib/db"

// ==============================
// REVIEW / TESTIMONIAL SCHEMA
// ==============================
const ReviewSchema = new Schema(
  {
    // Client er nam
    name: { type: String, required: true },
    
    // Client er chobi (Cloudinary URL)
    image: { type: String, default: "" },
    
    // Client er podobi ba company (ex: CEO at TechBD)
    designation: { type: String, default: "" },
    
    // Rating (1 theke 5 er moddhe)
    rating: { type: Number, required: true, min: 1, max: 5 },
    
    // Main Review text
    review: { type: String, required: true },

    // Review ta website e show korbe kina (Active/Inactive)
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Prevent model overwrite
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema)

/* ============================
   GET ALL REVIEWS
============================ */
export async function GET() {
  await connectDB()
  try {
    // Sob review anbe, notun gula age
    const reviews = await Review.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: reviews })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching reviews" }, { status: 500 })
  }
}

/* ============================
   ADD NEW REVIEW
============================ */
export async function POST(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { name, image, designation, rating, review, isActive } = body

    // Validation
    if (!name || !review || !rating) {
      return NextResponse.json(
        { success: false, message: "Name, Review, and Rating are required" },
        { status: 400 }
      )
    }

    const newReview = await Review.create({
      name,
      image: image || "",
      designation: designation || "",
      rating: Number(rating), // Ensure rating is a number
      review,
      isActive: isActive !== undefined ? isActive : true,
    })

    return NextResponse.json({
      success: true,
      message: "Review added successfully",
      data: newReview,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error adding review" }, { status: 500 })
  }
}

/* ============================
   UPDATE REVIEW
============================ */
export async function PUT(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id, name, image, designation, rating, review, isActive } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "Review ID is required" }, { status: 400 })
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        name,
        image,
        designation,
        rating,
        review,
        isActive,
      },
      { new: true }
    )

    if (!updatedReview) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating review" }, { status: 500 })
  }
}

/* ============================
   DELETE REVIEW
============================ */
export async function DELETE(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const deleted = await Review.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting review" }, { status: 500 })
  }
}