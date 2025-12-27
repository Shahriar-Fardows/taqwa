/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import mongoose, { Schema } from "mongoose";
import { connectDB } from "@/lib/db";
import cloudinary from "@/lib/cloudinary"; 

// ==============================
// BANNER SCHEMA
// ==============================
const BannerSchema = new Schema(
  {
    title: { type: String, required: true },
    desktopImage: { type: String, required: true }, 
    mobileImage: { type: String, required: true },
    link: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Banner = mongoose.models.Banner || mongoose.model("Banner", BannerSchema);

// Helper: Secure Upload Function
async function uploadToCloudinary(file: File, folder: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        folder: folder,
        resource_type: "auto"
      }, 
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          reject(error);
        } else {
          resolve(result?.secure_url || "");
        }
      }
    ).end(buffer);
  });
}

/* ============================
   GET ALL BANNERS
============================ */
export async function GET() {
  await connectDB();
  try {
    const banners = await Banner.find().sort({ order: 1 });
    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching banners" }, { status: 500 });
  }
}

/* ============================
   CREATE BANNER (POST)
============================ */
export async function POST(req: Request) {
  await connectDB();
  try {
    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    const link = formData.get("link") as string;
    const order = formData.get("order");
    const isActive = formData.get("isActive") === "true";

    const desktopFile = formData.get("desktopImage");
    const mobileFile = formData.get("mobileImage");

    if (!title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    }

    // Upload Desktop Image
    let desktopUrl = "";
    if (desktopFile && desktopFile instanceof File) {
      desktopUrl = await uploadToCloudinary(desktopFile, "banner_desktop");
    } else {
       return NextResponse.json({ success: false, message: "Desktop Image is required" }, { status: 400 });
    }

    // Upload Mobile Image
    let mobileUrl = "";
    if (mobileFile && mobileFile instanceof File) {
      mobileUrl = await uploadToCloudinary(mobileFile, "banner_mobile");
    } else {
      mobileUrl = desktopUrl; // Fallback
    }

    const newBanner = await Banner.create({
      title,
      desktopImage: desktopUrl,
      mobileImage: mobileUrl,
      link: link || "",
      isActive,
      order: order ? Number(order) : 0,
    });

    return NextResponse.json({
      success: true,
      message: "Banner created successfully",
      data: newBanner,
    });

  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server Error" }, { status: 500 });
  }
}

/* ============================
   UPDATE BANNER (PUT) - এটি মিসিং ছিল
============================ */
export async function PUT(req: Request) {
  await connectDB();
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    
    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return NextResponse.json({ success: false, message: "Banner not found" }, { status: 404 });
    }

    const title = formData.get("title") as string;
    const link = formData.get("link") as string;
    const order = formData.get("order");
    const isActive = formData.get("isActive") === "true";

    // Handle Desktop Image Update
    const desktopFile = formData.get("desktopImage");
    let desktopUrl = existingBanner.desktopImage; // আগের ইমেজই থাকবে

    if (desktopFile && desktopFile instanceof File) {
      // নতুন ফাইল থাকলে আপলোড হবে
      desktopUrl = await uploadToCloudinary(desktopFile, "banner_desktop"); 
    }

    // Handle Mobile Image Update
    const mobileFile = formData.get("mobileImage");
    let mobileUrl = existingBanner.mobileImage; // আগের ইমেজই থাকবে

    if (mobileFile && mobileFile instanceof File) {
      // নতুন ফাইল থাকলে আপলোড হবে
      mobileUrl = await uploadToCloudinary(mobileFile, "banner_mobile"); 
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      {
        title,
        desktopImage: desktopUrl,
        mobileImage: mobileUrl,
        link,
        isActive,
        order: order ? Number(order) : existingBanner.order,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Banner updated successfully",
      data: updatedBanner,
    });

  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}

/* ============================
   DELETE BANNER (DELETE)
============================ */
export async function DELETE(req: Request) {
  await connectDB();
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await Banner.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 });
  }
}