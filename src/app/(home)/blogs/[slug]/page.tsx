"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Loader2, 
  Calendar, 
  User, 
  Tag, 
  Clock,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
  BookOpen
} from "lucide-react"

// --- Types ---
interface BlogPost {
  _id: string
  title: string
  slug: string
  subtitle: string
  content: string
  image: string
  category: string
  author: string
  createdAt: string
  tags?: string[]
}

interface ApiResponse {
  success: boolean
  data: BlogPost
}
interface RelatedResponse {
  success: boolean
  data: BlogPost[]
}

export default function BlogDetailsPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // --- Data Fetching ---
  useEffect(() => {
    if (!slug) return

    const fetchBlogDetails = async () => {
      try {
        setLoading(true)
        const res = await axios.get<ApiResponse>(`/api/blogs?slug=${slug}`)
        if (res.data.success) {
          setPost(res.data.data)
          fetchRelatedPosts(res.data.data.category, res.data.data._id)
        } else {
          router.push('/blogs')
        }
      } catch (err) {
        console.error("Error fetching blog details:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogDetails()
  }, [slug, router])

  const fetchRelatedPosts = async (category: string, currentId: string) => {
    try {
      const res = await axios.get<RelatedResponse>(`/api/blogs?category=${category}&limit=4`)
      if (res.data.success) {
        // নিচে দেখানোর জন্য ৩টি পোস্ট নিচ্ছি
        setRelatedPosts(res.data.data.filter(p => p._id !== currentId).slice(0, 3))
      }
    } catch (err) {
      console.error("Error fetching related posts:", err)
    }
  }

  // --- Utils ---
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const shareOnSocial = (platform: string) => {
    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${shareUrl}&text=${post?.title}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${post?.title}`
        break
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} মিনিট`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="relative">
             <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Loader2 className="w-6 h-6 text-emerald-500 animate-pulse" />
             </div>
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <main className="min-h-screen bg-[#020617] text-gray-200 font-sans selection:bg-emerald-500/30 pb-20 relative overflow-x-hidden">
      
      {/* --- Ambient Background Effects --- */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-900/10 via-[#020617] to-[#020617] pointer-events-none z-0" />
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* --- Navbar Placeholder (Back Button) --- */}
      <nav className="relative z-50 container mx-auto max-w-7xl px-6 pt-8 pb-4">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-all group">
           <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
           </div>
           <span className="font-medium">ব্লগ পেজে ফিরে যান</span>
        </Link>
      </nav>

      <div className="relative z-10 container mx-auto max-w-5xl px-4 md:px-6">
        
        {/* --- 1. Header Section (Title & Meta) --- */}
        <header className="max-w-4xl mx-auto text-center md:text-left mb-10 mt-4">
            {/* Category & Date */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6"
            >
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-md">
                    {post.category || "General"}
                </span>
                <div className="h-1 w-1 rounded-full bg-gray-600"></div>
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(post.createdAt)}
                </span>
                <div className="h-1 w-1 rounded-full bg-gray-600"></div>
                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    {getReadTime(post.content)} সময় লাগবে
                </span>
            </motion.div>

            {/* Title */}
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.2] mb-8"
            >
                {post.title}
            </motion.h1>

            {/* Author Info */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center md:justify-start gap-4"
            >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 p-[2px]">
                   <div className="w-full h-full rounded-full bg-[#0b1121] flex items-center justify-center">
                      <User className="w-6 h-6 text-emerald-400" />
                   </div>
                </div>
                <div className="text-left">
                    <p className="text-white font-semibold text-base">{post.author || "Admin"}</p>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">কনটেন্ট ক্রিয়েটর</p>
                </div>
            </motion.div>
        </header>

        {/* --- 2. Featured Image --- */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5, delay: 0.3 }}
           className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/20 border border-white/10 mb-16"
        >
            {post.image ? (
                <Image 
                    src={post.image} 
                    alt={post.title} 
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    priority
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1e293b]">
                    <BookOpen className="w-20 h-20 text-emerald-500/20" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60"></div>
        </motion.div>

        {/* --- 3. Main Content (Centered & Full Width feeling) --- */}
        <article className="max-w-4xl mx-auto w-full">
            
            {post.subtitle && (
               <div className="text-xl md:text-2xl text-emerald-100/80 font-serif italic border-l-4 border-emerald-500 pl-6 py-2 mb-10">
                  &quot;{post.subtitle}&quot;
               </div>
            )}

            <div 
              className="prose prose-lg prose-invert max-w-none 
              prose-p:text-gray-300 prose-p:leading-8 prose-p:mb-6
              prose-headings:text-white prose-headings:font-bold prose-headings:mt-10 prose-headings:mb-4
              prose-h2:text-3xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-4
              prose-a:text-emerald-400 prose-a:font-medium prose-a:no-underline hover:prose-a:text-emerald-300 hover:prose-a:underline
              prose-strong:text-white prose-strong:font-bold
              prose-code:text-emerald-300 prose-code:bg-[#1e293b]/50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-white/5
              prose-pre:bg-[#0f172a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:shadow-lg
              prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-white/5
              prose-ul:list-disc prose-ul:pl-6 prose-li:text-gray-300 prose-li:marker:text-emerald-500"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            {/* Footer Section: Tags & Share */}
            <div className="mt-16 pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Tag className="w-4 h-4 text-emerald-500 shrink-0" />
                            {post.tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-white/5 hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-400 text-sm rounded-full border border-white/5 transition-colors cursor-default">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Share Buttons */}
                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm font-medium mr-2">শেয়ার:</span>
                        {[
                            { icon: Facebook, color: "text-blue-500", bg: "hover:bg-blue-500/20", fn: () => shareOnSocial('facebook') },
                            { icon: Twitter, color: "text-sky-400", bg: "hover:bg-sky-400/20", fn: () => shareOnSocial('twitter') },
                            { icon: Linkedin, color: "text-blue-600", bg: "hover:bg-blue-600/20", fn: () => shareOnSocial('linkedin') },
                        ].map((item, idx) => (
                            <button 
                                key={idx} 
                                onClick={item.fn}
                                className={`w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center border border-white/5 transition-all ${item.color} ${item.bg}`}
                            >
                                <item.icon className="w-4 h-4" />
                            </button>
                        ))}
                        
                        <button 
                            onClick={handleCopyLink} 
                            className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center border border-white/5 transition-all text-emerald-500 hover:bg-emerald-500/20"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </article>

        {/* --- 4. Related Posts Section (Moved Bottom) --- */}
        {relatedPosts.length > 0 && (
            <section className="mt-24 max-w-6xl mx-auto border-t border-white/10 pt-16">
                <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-emerald-500" />
                    সম্পর্কিত অন্যান্য লেখা
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedPosts.map((related) => (
                        <Link href={`/blog/${related.slug}`} key={related._id} className="group flex flex-col h-full bg-[#1e293b]/20 hover:bg-[#1e293b]/40 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/10">
                            <div className="relative w-full aspect-video overflow-hidden">
                                {related.image ? (
                                    <Image 
                                        src={related.image} 
                                        alt={related.title} 
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#0f172a]">
                                        <BookOpen className="w-10 h-10 text-gray-700" />
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold px-2 py-0.5 bg-emerald-500/10 rounded-md">
                                        {related.category || "Article"}
                                    </span>
                                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(related.createdAt)}
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-gray-100 leading-snug mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                                    {related.title}
                                </h4>
                                <div className="mt-auto pt-4 border-t border-white/5">
                                    <span className="text-xs text-emerald-500 font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        বিস্তারিত পড়ুন <ArrowLeft className="w-3 h-3 rotate-180" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        )}

      </div>
    </main>
  )
}