/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import mongoose, { Schema } from "mongoose"
import { connectDB } from "@/lib/db"

// ==============================
// BLOG SCHEMA DEFINITION
// ==============================
const BlogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String },
    content: { type: String, required: true },
    image: { type: String, default: "" }, 
    category: { type: String, default: "Tech" },
    tags: { type: [String], default: [] },
    author: { type: String, default: "Admin" },
    isPublished: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema)

/* ============================
   GET METHOD (Handles BOTH All Blogs & Single Blog)
============================ */
export async function GET(req: Request) {
  await connectDB()
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug")       // চেক করবে slug আছে কিনা
    const category = searchParams.get("category")
    const limit = searchParams.get("limit")     // লিমিট চেক (রিলেটেড পোস্টের জন্য)

    // --- CASE 1: যদি SLUG থাকে, তাহলে সিঙ্গেল ব্লগ রিটার্ন করবে ---
    if (slug) {
      const post = await BlogPost.findOne({ slug: slug })

      if (!post) {
        return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 })
      }

      // ভিউ কাউন্ট বাড়ানো
      post.views += 1
      await post.save()

      // লক্ষ্য করো: এখানে সরাসরি data অবজেক্ট রিটার্ন করছি (Array না)
      return NextResponse.json({ success: true, data: post })
    }

    // --- CASE 2: যদি SLUG না থাকে, তাহলে সব ব্লগ রিটার্ন করবে ---
    const query: any = {}
    if (category) {
      query.category = category
    }

    // কোয়েলি বিল্ড করা
    let postsQuery = BlogPost.find(query).sort({ createdAt: -1 })

    // যদি লিমিট থাকে (Sidebar এর জন্য)
    if (limit) {
      postsQuery = postsQuery.limit(parseInt(limit))
    }

    const posts = await postsQuery.exec()
    
    return NextResponse.json({ success: true, count: posts.length, data: posts })

  } catch (error) {
    console.error("GET Error:", error)
    return NextResponse.json({ success: false, message: "Error fetching posts" }, { status: 500 })
  }
}

/* ============================
   POST METHOD (Create)
============================ */
export async function POST(req: Request) {
  await connectDB()
  try {
    const body = await req.json()
    const { title, slug, subtitle, content, image, category, tags, author, isPublished } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        { success: false, message: "Title, Slug, and Content are required" },
        { status: 400 }
      )
    }

    const existingPost = await BlogPost.findOne({ slug })
    if (existingPost) {
      return NextResponse.json({ success: false, message: "This slug already exists" }, { status: 400 })
    }

    const newPost = await BlogPost.create({
      title,
      slug,
      subtitle: subtitle || "",
      content,
      image: image || "",
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
    return NextResponse.json({ success: false, message: "Server Error" }, { status: 500 })
  }
}

/* ============================
   PUT METHOD (Update)
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
      { title, slug, subtitle, content, image, category, tags, isPublished },
      { new: true }
    )

    if (!updatedPost) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Blog updated", data: updatedPost })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 })
  }
}

/* ============================
   DELETE METHOD
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

    return NextResponse.json({ success: true, message: "Deleted successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Delete failed" }, { status: 500 })
  }
}