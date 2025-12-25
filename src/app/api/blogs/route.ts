import { NextResponse } from "next/server"
import mongoose, { Schema } from "mongoose"
import { connectDB } from "@/lib/db"

// ==============================
// BLOG SCHEMA DEFINITION
// ==============================
const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // যেমন: "how-to-learn-coding"
    subtitle: { type: String }, // শর্ট ডেসক্রিপশন
    
    // মেইন কন্টেন্ট (HTML বা Markdown)
    content: { type: String, required: true },
    
    // Cloudinary থেকে পাওয়া ইমেজের লিংক এখানে থাকবে
    image: { type: String, default: "" }, 
    
    category: { type: String, default: "Tech" },
    tags: { type: [String], default: [] }, // Array of strings
    author: { type: String, default: "Admin" },
    
    // ব্লগটি ড্রাফট নাকি পাবলিশড
    isPublished: { type: Boolean, default: true },
    
    // কতজন ভিউ করেছে (অপশনাল ফিচার)
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Prevent model overwrite error in Next.js
const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema)

/* ============================
   GET ALL BLOG POSTS
============================ */
export async function GET(req: Request) {
  await connectDB()
  try {
    // URL থেকে query parameter চেক করা (অপশনাল: যদি নির্দিষ্ট ক্যাটাগরি চাও)
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")

    let query = {}
    if (category) {
      query = { category: category }
    }

    // নতুন পোস্ট আগে দেখাবে (createdAt: -1)
    const posts = await BlogPost.find(query).sort({ createdAt: -1 })
    
    return NextResponse.json({ success: true, count: posts.length, data: posts })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error fetching posts" }, { status: 500 })
  }
}

/* ============================
   CREATE A NEW BLOG POST
============================ */
export async function POST(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    
    // এখানে image হবে Cloudinary এর URL স্ট্রিং
    const { title, slug, subtitle, content, image, category, tags, author, isPublished } = body

    // বেসিক ভ্যালিডেশন
    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, message: "Title, Slug, and Content are required" },
        { status: 400 }
      )
    }

    // স্লাগ ডুপ্লিকেট চেক
    const existingPost = await BlogPost.findOne({ slug })
    if (existingPost) {
      return NextResponse.json({ success: false, message: "This slug already exists" }, { status: 400 })
    }

    const newPost = await BlogPost.create({
      title,
      slug,
      subtitle: subtitle || "",
      content,
      image: image || "", // Cloudinary URL
      category: category || "Uncategorized",
      tags: tags || [],
      author: author || "Admin",
      isPublished: isPublished !== undefined ? isPublished : true,
    })

    return NextResponse.json({
      success: true,
      message: "Blog post created successfully",
      data: newPost,
    })
  } catch (error) {
    console.error("Create Error:", error)
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 })
  }
}

/* ============================
   UPDATE BLOG POST
============================ */
export async function PUT(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id, title, slug, subtitle, content, image, category, tags, isPublished } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "Post ID is required" }, { status: 400 })
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        subtitle,
        content,
        image,
        category,
        tags,
        isPublished,
      },
      { new: true } // আপডেটেড ডাটা রিটার্ন করবে
    )

    if (!updatedPost) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Blog post updated",
      data: updatedPost,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 })
  }
}

/* ============================
   DELETE BLOG POST
============================ */
export async function DELETE(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, message: "Post ID is required" }, { status: 400 })
    }

    const deletedPost = await BlogPost.findByIdAndDelete(id)

    if (!deletedPost) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 })
  }
}