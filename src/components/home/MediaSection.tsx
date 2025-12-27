"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link" // লিংক ইমপোর্ট করা হয়েছে
import { motion, AnimatePresence } from "framer-motion"
import { 
  Play, 
  Image as ImageIcon, 
  X,
  Loader2,
  ArrowRight // আইকন ইমপোর্ট
} from "lucide-react"

// --- Interface ---
interface MediaItem {
  _id: string
  type: 'video' | 'image'
  url: string
  thumbnail: string
  title: string
  description?: string
  category: string
  createdAt: string
}

interface ApiResponse {
  success: boolean
  data: MediaItem[]
}

// --- Helper: Get YouTube ID ---
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// --- Helper: Generate Thumbnail Logic ---
const getThumbnail = (item: MediaItem) => {
  if (item.thumbnail && item.thumbnail !== "") return item.thumbnail;
  if (item.type === 'image') return item.url;
  if (item.type === 'video' && item.url.includes('cloudinary')) {
      return item.url.replace(/\.(mp4|webm|mov|mkv)$/i, ".jpg");
  }
  return null;
}

export default function MediaSection() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get<ApiResponse>("/api/media")
        if (res.data.success) {
          setMediaItems(res.data.data.slice(0, 4))
        }
      } catch (error) {
        console.error("Error fetching media:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMedia()
  }, [])

  if (loading) return null 
  if (mediaItems.length === 0) return null

  return (
    <section className="py-20 bg-[#020617] border-t border-white/5 relative overflow-hidden">
      
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- Header --- */}
        <div className="mb-12 text-center md:text-left">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
             মিডিয়া ও <span className="text-emerald-500">গ্যালারি</span>
           </h2>
           <p className="text-gray-400">আমাদের লেটেস্ট ভিডিও এবং ফটো গ্যালারি</p>
        </div>

        {/* --- Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mediaItems.map((item, index) => {
            const thumbUrl = getThumbnail(item);
            
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedMedia(item)}
                className="group cursor-pointer flex flex-col h-full"
              >
                {/* Card Image Area */}
                <div className="relative h-64 md:h-[25rem] w-full overflow-hidden bg-[#1e293b] rounded-xl border border-white/10 group-hover:border-emerald-500/50 transition-all duration-300 shadow-lg">
                  
                  {thumbUrl ? (
                     <Image 
                       src={thumbUrl} 
                       alt={item.title} 
                       fill
                       className="object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-600 bg-[#0f172a]">
                        <ImageIcon className="w-12 h-12 opacity-30" />
                     </div>
                  )}

                  {/* Overlay Icon */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                     <div className="w-16 h-16 bg-emerald-600/90 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 scale-90 group-hover:scale-110 transition-transform duration-300">
                        {item.type === 'video' ? (
                           <Play className="w-6 h-6 ml-1" />
                        ) : (
                           <ImageIcon className="w-6 h-6" />
                        )}
                     </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur-md text-emerald-400 text-xs font-bold uppercase rounded border border-white/10">
                    {item.category || "Gallery"}
                  </div>
                </div>

                {/* Card Content */}
                <div className="mt-4 px-2">
                   <h3 className="text-white font-bold text-xl leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {item.title}
                   </h3>
                   <p className="text-sm text-gray-500 mt-2">
                      {new Date(item.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
                   </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* --- View All Button (ADDED HERE) --- */}
        <div className="mt-16 flex justify-center">
          <Link 
            href="/media" 
            className="group flex items-center gap-2 px-8 py-3 bg-[#1e293b] text-white font-bold rounded-full border border-white/10 hover:border-emerald-500 hover:text-emerald-500 hover:bg-[#1e293b]/80 transition-all duration-300 shadow-lg shadow-emerald-900/10"
          >
            সব মিডিয়া দেখুন <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>

      {/* --- POPUP MODAL --- */}
      <AnimatePresence>
        {selectedMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMedia(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors border border-white/20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex-grow relative w-full aspect-video bg-black flex items-center justify-center">
                {(() => {
                   if (selectedMedia.type === 'video' && (selectedMedia.url.includes('youtube') || selectedMedia.url.includes('youtu.be'))) {
                      return (
                        <iframe 
                          src={`https://www.youtube.com/embed/${getYouTubeId(selectedMedia.url)}?autoplay=1`}
                          title={selectedMedia.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      );
                   } 
                   else if (selectedMedia.type === 'video') {
                      return (
                        <video 
                          src={selectedMedia.url} 
                          controls 
                          autoPlay 
                          className="w-full h-full max-h-[80vh] object-contain"
                        />
                      );
                   } 
                   else {
                      return (
                        <div className="relative w-full h-full">
                          <Image 
                            src={selectedMedia.url} 
                            alt={selectedMedia.title} 
                            fill
                            className="object-contain"
                          />
                        </div>
                      );
                   }
                })()}
              </div>

              <div className="p-5 bg-[#1e293b] border-t border-white/10">
                 <h3 className="text-xl font-bold text-white">{selectedMedia.title}</h3>
                 {selectedMedia.description && (
                   <p className="text-gray-400 text-sm mt-2">{selectedMedia.description}</p>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}