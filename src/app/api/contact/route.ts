import { NextResponse } from "next/server";
import mongoose, { Schema } from "mongoose";
import { connectDB } from "@/lib/db";

// ==============================
// 1. CONTACT SCHEMA DEFINITION
// ==============================
const ContactSchema = new Schema(
  {
    // Branding Fields
    siteName: { type: String, default: "" },
    logo: { type: String, default: "" }, // Image URL string

    // Contact Info
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, default: "" },

    // Social Links (Flexible Map)
    social: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

// Mongoose Model (Prevent overwrite error)
const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

// ==============================
// 2. GET METHOD (Fetch Data)
// ==============================
export async function GET() {
  await connectDB();
  try {
    // সবসময় লেটেস্ট ডাটা আনবে
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, message: "Error fetching data" }, { status: 500 });
  }
}

// ==============================
// 3. POST METHOD (Create New)
// ==============================
export async function POST(req: Request) {
  await connectDB();
  try {
    const body = await req.json(); // JSON Data Accept Korbe
    const { siteName, logo, email, phone, address, social } = body;

    // Validation
    if (!email || !phone) {
      return NextResponse.json(
        { success: false, message: "Email and Phone are required" },
        { status: 400 }
      );
    }

    // Create Entry
    const newContact = await Contact.create({
      siteName: siteName || "",
      logo: logo || "",
      email,
      phone,
      address: address || "",
      social: social || {},
    });

    return NextResponse.json({
      success: true,
      message: "Contact created successfully",
      data: newContact,
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, message: "Error creating contact" }, { status: 500 });
  }
}

// ==============================
// 4. PUT METHOD (Update Existing)
// ==============================
export async function PUT(req: Request) {
  await connectDB();
  try {
    const body = await req.json(); // JSON Data Accept Korbe
    const { id, siteName, logo, email, phone, address, social } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required for update" }, { status: 400 });
    }

    // Update Query
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      {
        siteName,
        logo,
        email,
        phone,
        address,
        social, // Full object replace hobe
      },
      { new: true } // Updated data return korbe
    );

    if (!updatedContact) {
      return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Contact updated successfully",
      data: updatedContact,
    });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, message: "Error updating contact" }, { status: 500 });
  }
}

// ==============================
// 5. DELETE METHOD (Remove)
// ==============================
export async function DELETE(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, message: "Error deleting contact" }, { status: 500 });
  }
}