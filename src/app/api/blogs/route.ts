import { NextResponse } from "next/server"
import mongoose, { Schema } from "mongoose"
import { connectDB } from "@/lib/db"

// Create schema directly here
const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // URL এর জন্য ইউনিক হতে হবে
    content: { type: String, required: true }, // Markdown বা HTML রাখা যাবে
    excerpt: { type: String, default: "" }, // ছোট ডেসক্রিপশন
    
    category: { type: String, default: "General" },
    tags: { type: [String], default: [] }, // যেমন: ["Tech", "Coding"]
    
    thumbnail: { type: String, default: "" }, // ইমেজ লিংক
    author: { type: String, default: "Admin" },
    
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
)

// Prevent re-registering model
const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema)

/* ============================
   GET ALL BLOGS
============================ */
export async function GET() {
  await connectDB()
  try {
    // নতুন ব্লগ সবার আগে দেখাবে (sort by createdAt descending)
    const blogs = await Blog.find().sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: blogs })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching blogs" }, { status: 500 })
  }
}

/* ============================
   CREATE NEW BLOG
============================ */
export async function POST(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { title, slug, content, excerpt, category, tags, thumbnail, author, isPublished } = body

    // Validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, message: "Title, slug, and content are required" },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug })
    if (existingBlog) {
      return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 400 })
    }

    const newBlog = await Blog.create({
      title,
      slug,
      content,
      excerpt: excerpt || "",
      category: category || "General",
      tags: tags || [],
      thumbnail: thumbnail || "",
      author: author || "Admin",
      isPublished: isPublished !== undefined ? isPublished : true,
    })

    return NextResponse.json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error creating blog" }, { status: 500 })
  }
}

/* ============================
   UPDATE BLOG
============================ */
export async function PUT(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    // আমরা আইডি দিয়ে আপডেট করবো
    const { id, title, slug, content, excerpt, category, tags, thumbnail, isPublished } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "Blog ID is required" }, { status: 400 })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        content,
        excerpt,
        category,
        tags,
        thumbnail,
        isPublished,
      },
      { new: true },
    )

    if (!updatedBlog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error updating blog" }, { status: 500 })
  }
}

/* ============================
   DELETE BLOG
============================ */
export async function DELETE(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "Blog ID is required" }, { status: 400 })
    }

    const deletedBlog = await Blog.findByIdAndDelete(id)

    if (!deletedBlog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error deleting blog" }, { status: 500 })
  }
}