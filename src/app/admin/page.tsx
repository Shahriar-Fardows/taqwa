/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Link from "next/link"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Users,
  Star,
  Image as ImageIcon,
  Briefcase,
  ArrowUpRight,
  Plus,
  Loader2,
  TrendingUp,
  Activity
} from "lucide-react"

// --- TYPES FOR DASHBOARD DATA ---
interface DashboardData {
  totalBlogs: number
  publishedBlogs: number
  totalReviews: number
  averageRating: number
  totalClients: number
  totalMedia: number
  teamMembers: number
  recentBlogs: any[]
  recentReviews: any[]
}

export default function DashboardHome() {
  const [data, setData] = useState<DashboardData>({
    totalBlogs: 0,
    publishedBlogs: 0,
    totalReviews: 0,
    averageRating: 0,
    totalClients: 0,
    totalMedia: 0,
    teamMembers: 0,
    recentBlogs: [],
    recentReviews: []
  })
  const [loading, setLoading] = useState(true)

  // --- FETCH ALL DATA ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Parallel API Calls for performance
        const [blogRes, reviewRes, businessRes, mediaRes, aboutRes] = await Promise.allSettled([
          axios.get("/api/blogs"),
          axios.get("/api/review"),
          axios.get("/api/business"),
          axios.get("/api/media"),
          axios.get("/api/about")
        ])

        const newData = { ...data }

        // 1. BLOGS DATA
        if (blogRes.status === "fulfilled" && blogRes.value.data.success) {
          const blogs = blogRes.value.data.data
          newData.totalBlogs = blogs.length
          newData.publishedBlogs = blogs.filter((b: any) => b.isPublished).length
          newData.recentBlogs = blogs.slice(0, 3) // Top 3 recent
        }

        // 2. REVIEWS DATA
        if (reviewRes.status === "fulfilled" && reviewRes.value.data.success) {
          const reviews = reviewRes.value.data.data
          newData.totalReviews = reviews.length
          // Calculate Average Rating
          const totalRating = reviews.reduce((acc: number, r: any) => acc + r.rating, 0)
          newData.averageRating = reviews.length > 0 ? Number((totalRating / reviews.length).toFixed(1)) : 0
          newData.recentReviews = reviews.slice(0, 3)
        }

        // 3. BUSINESS DATA
        if (businessRes.status === "fulfilled" && businessRes.value.data.success) {
          newData.totalClients = businessRes.value.data.data.length
        }

        // 4. MEDIA DATA
        if (mediaRes.status === "fulfilled" && mediaRes.value.data.success) {
          newData.totalMedia = mediaRes.value.data.data.length
        }

        // 5. TEAM DATA (From About)
        if (aboutRes.status === "fulfilled" && aboutRes.value.data) {
          newData.teamMembers = aboutRes.value.data.team?.length || 0
        }

        setData(newData)
      } catch (error) {
        console.error("Dashboard data fetch error", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020817]">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 space-y-8 min-h-screen bg-[#020817] animate-in fade-in duration-500">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening with your portfolio.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/blog">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
              <Plus className="mr-2 h-4 w-4" /> New Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* --- STATS CARDS --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Blogs */}
        <Card className="bg-[#0f172a] border-white/10 hover:border-emerald-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.totalBlogs}</div>
            <p className="text-xs text-gray-500 mt-1">
              {data.publishedBlogs} Published • {data.totalBlogs - data.publishedBlogs} Drafts
            </p>
            <Progress value={(data.publishedBlogs / (data.totalBlogs || 1)) * 100} className="h-1 mt-3 bg-white/5" />
          </CardContent>
        </Card>

        {/* Clients */}
        <Card className="bg-[#0f172a] border-white/10 hover:border-emerald-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Clients</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.totalClients}</div>
            <p className="text-xs text-gray-500 mt-1">Companies you worked with</p>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="bg-[#0f172a] border-white/10 hover:border-emerald-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Client Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              {data.averageRating} <span className="text-sm text-yellow-500 font-normal">/ 5.0</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Based on {data.totalReviews} reviews</p>
          </CardContent>
        </Card>

        {/* Media & Team */}
        <Card className="bg-[#0f172a] border-white/10 hover:border-emerald-500/30 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Media & Team</CardTitle>
            <ImageIcon className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.totalMedia}</div>
            <p className="text-xs text-gray-500 mt-1">
              Files uploaded • {data.teamMembers} Team Members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        {/* LEFT: Recent Blogs (4 cols) */}
        <Card className="col-span-4 bg-[#0f172a] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-500" /> Recent Articles
            </CardTitle>
            <CardDescription className="text-gray-400">Latest posts from your blog.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.recentBlogs.length === 0 ? (
                  <p className="text-gray-500 text-sm">No blogs posted yet.</p>
              ) : (
                  data.recentBlogs.map((blog) => (
                    <div key={blog._id} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-white/5 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={blog.image || "/placeholder.png"} alt="Blog" className="h-full w-full object-cover" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white leading-none">{blog.title}</p>
                          <p className="text-xs text-gray-500">{new Date(blog.createdAt).toLocaleDateString()} • {blog.category}</p>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${blog.isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                        {blog.isPublished ? "Published" : "Draft"}
                      </div>
                    </div>
                  ))
              )}
            </div>
            <div className="mt-6">
                <Link href="/admin/blog" className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1">
                    View all posts <ArrowUpRight className="h-3 w-3" />
                </Link>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Recent Reviews & Quick Links (3 cols) */}
        <div className="col-span-3 space-y-6">
            
            {/* Recent Reviews */}
            <Card className="bg-[#0f172a] border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" /> Recent Feedback
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.recentReviews.length === 0 ? (
                            <p className="text-gray-500 text-sm">No reviews yet.</p>
                        ) : (
                            data.recentReviews.map((review) => (
                                <div key={review._id} className="p-3 rounded-lg bg-white/5 border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] text-emerald-500 font-bold">
                                                {review.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-white">{review.name}</span>
                                        </div>
                                        <div className="flex text-yellow-500">
                                            {/* Show just one star and the number */}
                                            <Star className="h-3 w-3 fill-yellow-500" />
                                            <span className="text-xs ml-1">{review.rating}.0</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-2 italic">{review.review}</p>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-4">
                        <Link href="/admin/review" className="text-xs text-gray-400 hover:text-white flex items-center gap-1 justify-end">
                            Manage Reviews <ArrowUpRight className="h-3 w-3" />
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions / System Health */}
            <Card className="bg-emerald-900/10 border-emerald-500/20">
                <CardHeader>
                    <CardTitle className="text-emerald-500 flex items-center gap-2 text-base">
                        <TrendingUp className="h-4 w-4" /> Quick Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0f172a] p-3 rounded-lg border border-white/5 text-center">
                        <div className="text-2xl font-bold text-white">{data.teamMembers}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Team Members</div>
                    </div>
                    <div className="bg-[#0f172a] p-3 rounded-lg border border-white/5 text-center">
                        <div className="text-2xl font-bold text-white">{data.totalMedia}</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Gallery Items</div>
                    </div>
                    <Link href="/admin/media" className="col-span-2">
                        <Button variant="outline" className="w-full border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white">
                            Manage Gallery
                        </Button>
                    </Link>
                </CardContent>
            </Card>

        </div>
      </div>
    </div>
  )
}