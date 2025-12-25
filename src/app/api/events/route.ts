import { NextResponse } from "next/server"
import mongoose, { Schema } from "mongoose"
import { connectDB } from "@/lib/db"

// ==============================
// EVENT SCHEMA
// ==============================
const EventSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // URL er jonno unique nam (ex: tech-summit-2024)
    description: { type: String, required: true }, // Markdown support korbe
    
    // Cloudinary Image URL
    image: { type: String, default: "" },

    // Date and Time (ISO Format: 2024-12-25T10:00:00.000Z)
    startDate: { type: Date, required: true },
    endDate: { type: Date },

    // Location (Object akare rakhlam jate details rakha jay)
    location: {
      address: { type: String, default: "" }, // Hall name, Street info
      city: { type: String, default: "" },
      mapLink: { type: String, default: "" }, // Google Map URL
    },

    // Ticket Information
    price: { type: Number, default: 0 }, // 0 hole Free
    currency: { type: String, default: "BDT" },
    registrationLink: { type: String, default: "" }, // Ticket kenar link

    // Organizer Details
    organizer: { type: String, default: "Admin" },
    
    // Status: Event ki hoye geche naki samne hobe
    status: { 
      type: String, 
      enum: ["upcoming", "ongoing", "completed", "cancelled"], 
      default: "upcoming" 
    },

    // Extra Flexible Data (Speaker list, Agenda, ba ja khushi rakhte paro)
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
    const status = searchParams.get("status") // status diye filter kora jabe

    let query = {}
    if (status) {
      query = { status: status }
    }

    // Sort by startDate ascending (Samner event age dekhabe)
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

    // Basic Validation
    if (!title || !startDate || !location) {
      return NextResponse.json(
        { success: false, message: "Title, Date, and Location are required" },
        { status: 400 }
      )
    }

    // Duplicate Slug Check
    const existingEvent = await Event.findOne({ slug })
    if (existingEvent) {
      return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 400 })
    }

    const newEvent = await Event.create({
      title,
      slug,
      description,
      image: image || "",
      startDate: new Date(startDate), // String theke Date object e convert
      endDate: endDate ? new Date(endDate) : null,
      location: location || {},
      price: price || 0,
      currency: currency || "BDT",
      registrationLink: registrationLink || "",
      organizer: organizer || "Admin",
      status: status || "upcoming",
      extraInfo: extraInfo || {}, // Speaker details ba onno kichu
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
    const { id, ...updateData } = body // ID alada kore baki sob data update er jonno nilam

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