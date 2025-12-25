import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    // 1. Parse Form Data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 2. Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Upload to Cloudinary using Stream
    // (Since Vercel/Next.js creates temporary files differently, stream is safer)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "portfolio_uploads", // Cloudinary Folder Name
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url, success: true });

  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}