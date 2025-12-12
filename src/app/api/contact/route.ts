import { NextResponse } from "next/server";
import mongoose, { Schema } from "mongoose";
import { connectDB } from "@/lib/db";

// Create schema directly here
const ContactSchema = new Schema(
  {
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, default: "" },

    // Multiple social media links
    social: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

// Prevent re-registering model in Next.js
const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

/* ============================
   GET ALL CONTACTS
============================ */
export async function GET() {
  await connectDB();
  const contacts = await Contact.find();
  return NextResponse.json({ success: true, data: contacts });
}

/* ============================
   CREATE A NEW CONTACT
============================ */
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const { email, phone, address, social } = body;

  if (!email || !phone) {
    return NextResponse.json(
      { success: false, message: "Email and phone are required" },
      { status: 400 }
    );
  }

  const newContact = await Contact.create({
    email,
    phone,
    address: address || "",
    social: social || {},
  });

  return NextResponse.json({
    success: true,
    message: "Contact created",
    data: newContact,
  });
}

/* ============================
   UPDATE CONTACT
============================ */
export async function PUT(req: Request) {
  await connectDB();
  const body = await req.json();
  const { id, ...updates } = body;

  const updated = await Contact.findByIdAndUpdate(id, updates, { new: true });

  if (!updated) {
    return NextResponse.json(
      { success: false, message: "Contact not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Contact updated",
    data: updated,
  });
}

/* ============================
   DELETE CONTACT
============================ */
export async function DELETE(req: Request) {
  await connectDB();
  const body = await req.json();
  const { id } = body;

  const deleted = await Contact.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: "Contact not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Contact deleted",
  });
}
