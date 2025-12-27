"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Calendar, 
  ArrowRight, 
  Loader2 
} from "lucide-react"

// --- Interface ---
interface Blog {
  _id: string
  title: string
  image: string
  description?: string // Optional করা হয়েছে
  content?: string     // অনেক সময় description এর বদলে content থাকে
  category?: string
  createdAt: string
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  // --- Fetch Data ---
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("/api/blogs")
        if (res.data.success) {
          const sortedBlogs = res.data.data
            .sort((a: Blog, b: Blog) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4)
            
          setBlogs(sortedBlogs)
        }
      } catch (error) {
        console.error("Error fetching blogs:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  if (loading) return null
  if (blogs.length === 0) return null

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <section className="py-20 bg-[#020617] border-t border-white/5 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="text-center md:text-left">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
               সর্বশেষ <span className="text-emerald-500">ব্লগ</span> ও আর্টিকেল
             </h2>
             <p className="text-gray-400">প্রযুক্তি এবং আমাদের কার্যক্রম নিয়ে নিয়মিত লেখালেখি</p>
          </div>
          
          <Link 
            href="/blogs" 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-emerald-500 hover:text-emerald-400 border border-emerald-500/20 px-5 py-2 rounded-full hover:bg-emerald-500/10 transition-all"
          >
            সব ব্লগ পড়ুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* --- Blog Grid --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {blogs.map((blog) => {
            // Safe Description Logic
            // description না থাকলে content নিবে, তাও না থাকলে খালি স্ট্রিং
            const descText = blog.description || blog.content || "";
            
            return (
              <motion.div
                key={blog._id}
                variants={itemVariants}
                className="group bg-[#1e293b] rounded-xl overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/20 flex flex-col h-full"
              >
                <Link href={`/blogs/${blog._id}`} className="block h-full flex flex-col">
                  
                  {/* Image Area */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#0f172a]">
                     <Image 
                       src={blog.image || "/placeholder.jpg"} 
                       alt={blog.title} 
                       fill
                       className="object-cover transition-transform duration-500 group-hover:scale-110"
                     />
                     
                     {/* Date Badge */}
                     <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-bold text-white uppercase">
                          {new Date(blog.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                        </span>
                     </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex flex-col flex-grow">
                     {blog.category && (
                       <span className="text-xs text-emerald-400 font-medium mb-2 block uppercase tracking-wider">
                         {blog.category}
                       </span>
                     )}

                     <h3 className="text-lg font-bold text-white leading-snug mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {blog.title}
                     </h3>

                     {/* Description with Safe Check */}
                     <div 
                        className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow"
                        dangerouslySetInnerHTML={{ __html: descText.substring(0, 100) + (descText.length > 100 ? "..." : "") }} 
                     />

                     {/* Read More Link */}
                     <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-sm font-semibold text-emerald-500 group-hover:gap-2 transition-all">
                        বিস্তারিত পড়ুন <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                     </div>
                  </div>

                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Mobile View All Button */}
        <div className="mt-10 flex justify-center md:hidden">
           <Link 
            href="/blogs" 
            className="flex items-center gap-2 text-sm font-bold text-white bg-emerald-600 px-6 py-3 rounded-full shadow-lg shadow-emerald-900/20"
          >
            সব ব্লগ পড়ুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}