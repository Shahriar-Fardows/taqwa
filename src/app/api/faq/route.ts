import { NextResponse } from "next/server"
import mongoose, { Schema } from "mongoose"
import { connectDB } from "@/lib/db"

// ==============================
// FAQ SCHEMA
// ==============================
const FAQSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true }, // এখানে HTML বা Markdown রাখা যাবে
    
    // যেমন: "General", "Services", "Payment"
    category: { type: String, default: "General" },
    
    // প্রশ্নটি ওয়েবসাইটে দেখাবে কি না
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Prevent model overwrite
const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema)

/* ============================
   GET ALL FAQs
============================ */
export async function GET() {
  await connectDB()
  try {
    // সব ডাটা আনবে, নতুন গুলো আগে
    const faqs = await FAQ.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: faqs })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching FAQs" }, { status: 500 })
  }
}

/* ============================
   CREATE NEW FAQ
============================ */
export async function POST(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { question, answer, category, isActive } = body

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, message: "Question and Answer are required" },
        { status: 400 }
      )
    }

    const newFAQ = await FAQ.create({
      question,
      answer,
      category: category || "General",
      isActive: isActive !== undefined ? isActive : true,
    })

    return NextResponse.json({
      success: true,
      message: "FAQ created successfully",
      data: newFAQ,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error creating FAQ" }, { status: 500 })
  }
}

/* ============================
   UPDATE FAQ
============================ */
export async function PUT(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id, question, answer, category, isActive } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "FAQ ID is required" }, { status: 400 })
    }

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      { question, answer, category, isActive },
      { new: true }
    )

    if (!updatedFAQ) {
      return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "FAQ updated successfully",
      data: updatedFAQ,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating FAQ" }, { status: 500 })
  }
}

/* ============================
   DELETE FAQ
============================ */
export async function DELETE(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "FAQ ID is required" }, { status: 400 })
    }

    const deleted = await FAQ.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "FAQ deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting FAQ" }, { status: 500 })
  }
}