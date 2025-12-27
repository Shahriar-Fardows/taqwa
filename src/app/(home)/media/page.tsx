"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, 
  Image as ImageIcon, 
  Video, 
  Loader2, 
  X,
  Maximize2,
  Film,
  Calendar,
  Clock
} from "lucide-react"

// --- Types ---
interface MediaItem {
  _id: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  title: string
  description: string
  category: string
  createdAt: string
}

export default function MediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "image" | "video">("all")
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get("/api/media")
        if (res.data.success) {
          setMediaList(res.data.data)
        }
      } catch (error) {
        console.error("Error fetching media:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMedia()
  }, [])

  // --- Helper Functions ---
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  const getThumbnail = (item: MediaItem) => {
    if (item.thumbnail) return item.thumbnail;
    if (item.type === 'video' && (item.url.includes("youtube") || item.url.includes("youtu.be"))) {
        const id = getYoutubeId(item.url)
        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/placeholder.jpg"
    }
    if (item.type === 'video' && item.url.includes("cloudinary")) {
        return item.url.replace(/\.(mp4|webm|mov|mkv)$/i, ".jpg");
    }
    return item.url; 
  }

  // --- Filter Logic Fix ---
  const filteredMedia = mediaList.filter(item => {
    if (activeTab === "all") return true;
    // ফিক্স: লোয়ারকেস কনভার্ট করে চেক করা হচ্ছে
    return item.type?.toLowerCase() === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020817] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#020817] text-gray-200 font-sans selection:bg-emerald-500/30">
      
      {/* --- Header --- */}
      <section className="pt-28 pb-12 px-6 relative overflow-hidden">
       
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              মিডিয়া ও <span className="text-emerald-500">গ্যালারি</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              আমাদের সকল ইভেন্ট, প্রজেক্ট এবং কার্যক্রমের আর্কাইভ।
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- Tabs --- */}
      <section className="container mx-auto max-w-7xl px-6 pb-24 relative z-10">
        <div className="flex justify-center mb-16">
            <div className="bg-[#1e293b] p-1.5 rounded-lg border border-white/10 flex gap-2">
                {[
                    { id: 'all', label: 'সব', icon: Maximize2 },
                    { id: 'image', label: 'ছবি', icon: ImageIcon },
                    { id: 'video', label: 'ভিডিও', icon: Video },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "all" | "image" | "video")}
                        className={`flex items-center gap-2 px-8 py-3 rounded-md text-sm font-bold transition-all duration-300 ${
                            activeTab === tab.id 
                            ? "bg-emerald-600 text-white shadow-lg" 
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>

        {/* --- NEW CARD DESIGN (Content Below Image) --- */}
        <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" // কলাম কমিয়ে ৩টি করা হয়েছে যাতে বড় দেখায়
        >
            <AnimatePresence mode="popLayout">
                {filteredMedia.map((item) => {
                    const thumb = getThumbnail(item);
                    return (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            key={item._id}
                            className="group bg-[#1e293b] border border-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-300 flex flex-col"
                            onClick={() => setSelectedMedia(item)}
                        >
                            {/* Image Section (Top) */}
                            <div className="relative h-64 w-full overflow-hidden bg-[#0f172a]">
                                <Image 
                                    src={thumb} 
                                    alt={item.title} 
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                
                                {/* Overlay Play Icon */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 border border-white/30">
                                        {item.type === 'video' ? (
                                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                </div>

                                {/* Type Badge (Top Right) */}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide text-white border border-white/20 backdrop-blur-md ${item.type === 'video' ? 'bg-red-500/80' : 'bg-emerald-500/80'}`}>
                                        {item.type}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section (Bottom) */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                                        {item.category || "General"}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                        <Clock className="w-3 h-3" />
                                        {new Date(item.createdAt).toLocaleDateString('bn-BD')}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
                                    {item.title}
                                </h3>
                                
                                {item.description && (
                                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </motion.div>

        {filteredMedia.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-gray-500 bg-[#1e293b]/20 rounded-lg border border-white/5 border-dashed">
                <Film className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg">কোনো মিডিয়া পাওয়া যায়নি</p>
                <button onClick={() => setActiveTab("all")} className="mt-4 text-emerald-500 hover:underline text-sm">সব দেখুন</button>
            </motion.div>
        )}
      </section>

      {/* --- Lightbox Modal --- */}
      <AnimatePresence>
        {selectedMedia && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                onClick={() => setSelectedMedia(null)}
            >
                <button onClick={() => setSelectedMedia(null)} className="absolute top-6 right-6 z-50 text-white bg-white/10 hover:bg-red-600 p-3 rounded-full transition-all">
                    <X className="w-6 h-6" />
                </button>

                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="relative w-full max-w-5xl flex flex-col items-center"
                    onClick={(e) => e.stopPropagation()} 
                >
                    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
                        {selectedMedia.type === 'video' ? (
                             (selectedMedia.url.includes("youtube") || selectedMedia.url.includes("youtu.be")) ? (
                                <iframe src={`https://www.youtube.com/embed/${getYoutubeId(selectedMedia.url)}?autoplay=1&rel=0`} title={selectedMedia.title} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                            ) : (
                                <video src={selectedMedia.url} controls autoPlay className="w-full h-full object-contain" />
                            )
                        ) : (
                            <div className="relative w-full h-full">
                                <Image src={selectedMedia.url} alt={selectedMedia.title} fill className="object-contain" />
                            </div>
                        )}
                    </div>
                    <div className="mt-6 text-center max-w-3xl">
                        <h2 className="text-2xl font-bold text-white mb-2">{selectedMedia.title}</h2>
                        {selectedMedia.description && <p className="text-gray-400 text-base">{selectedMedia.description}</p>}
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}