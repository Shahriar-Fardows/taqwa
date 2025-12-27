"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Loader2, 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  Share2,
  Filter,
  BookOpen,
  Copy,
  Check
} from "lucide-react"

// --- Types ---
interface BlogPost {
  _id: string
  title: string
  slug: string
  subtitle: string
  image: string
  category: string
  author: string
  createdAt: string
}

interface ApiResponse {
  success: boolean
  data: BlogPost[]
}

// --- Animation ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get<ApiResponse>('/api/blogs')
        if (res.data.success) {
          const blogData = res.data.data;
          setPosts(blogData)
          setFilteredPosts(blogData)

          // Extract Unique Categories dynamically
          const uniqueCategories = ["All", ...Array.from(new Set(blogData.map(item => item.category || "General")))];
          setCategories(uniqueCategories)
        }
      } catch (err) {
        console.error("Error fetching blogs:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  // --- 2. Filter & Search Logic ---
  useEffect(() => {
    let result = posts

    // Category Filter
    if (selectedCategory !== "All") {
      result = result.filter(post => post.category === selectedCategory)
    }

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.subtitle?.toLowerCase().includes(query)
      )
    }

    setFilteredPosts(result)
  }, [posts, selectedCategory, searchQuery])

  // --- 3. Share Function ---
  const handleShare = async (e: React.MouseEvent, post: BlogPost) => {
    e.preventDefault() // Link এ ক্লিক হওয়া আটকাবে
    const url = `${window.location.origin}/blog/${post.slug}`

    // মোবাইল বা সাপোর্টেড ব্রাউজারে নেটিভ শেয়ার
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.subtitle,
          url: url,
        })
      } catch (error) {
        console.log('Error sharing', error)
      }
    } else {
      // পিসিতে ক্লিপবোর্ডে কপি হবে
      navigator.clipboard.writeText(url)
      setCopiedId(post._id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  // Helper: Date Format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#020617] text-gray-200 font-sans selection:bg-emerald-500/30">
      
      {/* --- Header Section --- */}
      <section className="relative pt-24 pb-12 px-6 bg-[#0b1121] border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              আমাদের <span className="text-emerald-500">ব্লগ</span> ও লেখালেখি
            </h1>
            <p className="text-gray-400 text-lg">
              জ্ঞান, অভিজ্ঞতা এবং নতুন চিন্তাধারার একটি মুক্ত মঞ্চ।
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-[#1e293b] rounded-full border border-white/10 shadow-xl">
              <Search className="ml-4 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="ব্লগ খুঁজুন..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-gray-500 border-none py-3 px-4 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- Filter & Content Section --- */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          
          {/* Category Filters (Horizontal Scrollable) */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            <Filter className="w-5 h-5 text-emerald-500 mr-2" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-900/20"
                    : "bg-[#1e293b] text-gray-400 border-white/5 hover:border-emerald-500/30 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 bg-[#1e293b]/30 rounded-2xl border border-white/5">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400">কোনো ব্লগ পাওয়া যায়নি</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredPosts.map((post) => (
                  <motion.article 
                    key={post._id}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={fadeInUp}
                    className="group bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/10 flex flex-col h-full hover:-translate-y-1 relative"
                  >
                    
                    {/* Share Button (Floating Top Right) */}
                    <button
                      onClick={(e) => handleShare(e, post)}
                      className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-emerald-500 transition-colors border border-white/10"
                      title="Share this blog"
                    >
                      {copiedId === post._id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>

                    {/* Image Area */}
                    <Link href={`/blog/${post.slug}`} className="block relative h-56 w-full overflow-hidden bg-[#0f172a]">
                      {post.image ? (
                         <Image 
                           src={post.image} 
                           alt={post.title} 
                           fill
                           className="object-cover transition-transform duration-700 group-hover:scale-110"
                         />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <BookOpen className="w-10 h-10 opacity-20" />
                         </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                         <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-emerald-400 text-xs font-bold uppercase rounded-full border border-white/10">
                            {post.category || "General"}
                         </span>
                      </div>
                    </Link>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                         <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                            {post.createdAt ? formatDate(post.createdAt) : "No Date"}
                         </span>
                         <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-emerald-500" />
                            {post.author || "Admin"}
                         </span>
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${post.slug}`} className="block">
                        <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                          {post.title}
                        </h2>
                      </Link>

                      {/* Subtitle */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                         {post.subtitle}
                      </p>

                      {/* Read More */}
                      <div className="mt-auto border-t border-white/5 pt-4">
                         <Link 
                           href={`/blogs/${post.slug}`} 
                           className="inline-flex items-center gap-2 text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                         >
                           পুরোটা পড়ুন <ArrowRight className="w-4 h-4" />
                         </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}