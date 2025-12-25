import { NextResponse } from "next/server"
import mongoose, { Schema } from "mongoose"
import { connectDB } from "@/lib/db"

// ==============================
// EVENT SCHEMA
// ==============================
const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      mapLink: { type: String, default: "" },
    },
    price: { type: Number, default: 0 },
    currency: { type: String, default: "BDT" },
    registrationLink: { type: String, default: "" },
    organizer: { type: String, default: "Admin" },
    status: { 
      type: String, 
      enum: ["upcoming", "ongoing", "completed", "cancelled"], 
      default: "upcoming" 
    },
    extraInfo: { type: Schema.Types.Mixed }, 
  },
  { timestamps: true }
)

// Prevent model overwrite
const Event = mongoose.models.Event || mongoose.model("Event", EventSchema)

/* ============================
   GET ALL EVENTS
============================ */
export async function GET(req: Request) {
  await connectDB()
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    let query = {}
    if (status) {
      query = { status: status }
    }

    const events = await Event.find(query).sort({ startDate: 1 })
    
    return NextResponse.json({ success: true, count: events.length, data: events })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching events" }, { status: 500 })
  }
}

/* ============================
   CREATE NEW EVENT
============================ */
export async function POST(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    
    const { 
      title, slug, description, image, 
      startDate, endDate, location, 
      price, currency, registrationLink, 
      organizer, status, extraInfo 
    } = body

    if (!title || !startDate || !location) {
      return NextResponse.json(
        { success: false, message: "Title, Date, and Location are required" },
        { status: 400 }
      )
    }

    const existingEvent = await Event.findOne({ slug })
    if (existingEvent) {
      return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 400 })
    }

    const newEvent = await Event.create({
      title,
      slug,
      description,
      image: image || "",
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      location: location || {},
      price: price || 0,
      currency: currency || "BDT",
      registrationLink: registrationLink || "",
      organizer: organizer || "Admin",
      status: status || "upcoming",
      extraInfo: extraInfo || {},
    })

    return NextResponse.json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    })
  } catch (error) {
    console.error("Event Create Error:", error)
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 })
  }
}

/* ============================
   UPDATE EVENT
============================ */
export async function PUT(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "Event ID is required" }, { status: 400 })
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    if (!updatedEvent) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 })
  }
}

/* ============================
   DELETE EVENT
============================ */
export async function DELETE(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 })
    }

    const deleted = await Event.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 })
  }
}