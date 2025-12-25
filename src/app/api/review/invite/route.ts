import { NextResponse } from "next/server"
import mongoose, { Schema } from "mongoose"
import { connectDB } from "@/lib/db"

// --- REVIEW REQUEST SCHEMA ---
const ReviewRequestSchema = new Schema(
  {
    clientName: { type: String, required: true },
    designation: { type: String, default: "" }, // Optional
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
  },
  { timestamps: true }
)

const ReviewRequest = mongoose.models.ReviewRequest || mongoose.model("ReviewRequest", ReviewRequestSchema)

// 1. CREATE INVITE (ADMIN)
export async function POST(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { clientName, designation } = body

    const newRequest = await ReviewRequest.create({
      clientName,
      designation
    })

    return NextResponse.json({ success: true, data: newRequest })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error creating link" }, { status: 500 })
  }
}

// 2. GET INVITE INFO (CLIENT)
export async function GET(req: Request) {
  await connectDB()
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) return NextResponse.json({ success: false }, { status: 400 })

    const request = await ReviewRequest.findById(id)
    if (!request) return NextResponse.json({ success: false, message: "Invalid Link" }, { status: 404 })

    return NextResponse.json({ success: true, data: request })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}