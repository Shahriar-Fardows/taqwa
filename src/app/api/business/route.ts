import { NextResponse } from "next/server"
import mongoose, { Schema } from "mongoose"
import { connectDB } from "@/lib/db"

// ==============================
// BUSINESS / CLIENT SCHEMA
// ==============================
const BusinessSchema = new Schema(
  {
    // Company Name
    name: { type: String, required: true },
    
    // Company Logo (Cloudinary URL)
    logo: { type: String, required: true },
    
    // Company Website Link (Optional)
    website: { type: String, default: "" },
    
    // Tumi ki role e kaj korecho (ex: "Frontend Dev", "Full Stack")
    role: { type: String, default: "" },
    
    // Koto din kaj korecho (ex: "Jan 2023 - Present")
    duration: { type: String, default: "" },

    // Kajer short description
    description: { type: String, default: "" },
  },
  { timestamps: true }
)

// Prevent model overwrite
const Business = mongoose.models.Business || mongoose.model("Business", BusinessSchema)

/* ============================
   GET ALL COMPANIES
============================ */
export async function GET() {
  await connectDB()
  try {
    // Sort by createdAt descending (Notun company age thakbe)
    const companies = await Business.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: companies })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching data" }, { status: 500 })
  }
}

/* ============================
   ADD NEW COMPANY
============================ */
export async function POST(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { name, logo, website, role, duration, description } = body

    if (!name || !logo) {
      return NextResponse.json(
        { success: false, message: "Company name and Logo are required" },
        { status: 400 }
      )
    }

    const newCompany = await Business.create({
      name,
      logo, // Cloudinary Image URL
      website: website || "",
      role: role || "",
      duration: duration || "",
      description: description || "",
    })

    return NextResponse.json({
      success: true,
      message: "Company added successfully",
      data: newCompany,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error adding company" }, { status: 500 })
  }
}

/* ============================
   UPDATE COMPANY INFO
============================ */
export async function PUT(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id, name, logo, website, role, duration, description } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const updatedCompany = await Business.findByIdAndUpdate(
      id,
      { name, logo, website, role, duration, description },
      { new: true }
    )

    if (!updatedCompany) {
      return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Company info updated",
      data: updatedCompany,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating info" }, { status: 500 })
  }
}

/* ============================
   DELETE COMPANY
============================ */
export async function DELETE(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const deleted = await Business.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Company not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Company deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting company" }, { status: 500 })
  }
}