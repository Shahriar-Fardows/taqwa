"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import Marquee from "react-fast-marquee"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  Globe, 
  Clock, 
  Briefcase, 
  ExternalLink 
} from "lucide-react"

// --- Interface ---
interface Business {
  _id: string
  name: string
  logo: string
  website: string
  role: string
  duration: string
  description: string
}

export default function BusinessMarquee() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Business | null>(null)

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/business")
        if (res.data.success) {
          setBusinesses(res.data.data)
        }
      } catch (error) {
        console.error("Error fetching business data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return null 
  if (businesses.length === 0) return null

  return (
    // overflow-hidden যুক্ত করা হয়েছে যাতে স্ক্রল বার না আসে
    <section className=" bg-[#020617] border-y border-white/5 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[100px] bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>


      {/* --- Marquee Slider --- */}
      <div className="relative z-10 w-full">
        <Marquee 
          gradient={true} 
          gradientColor="#020617" 
          gradientWidth={100} // সাইডে ফেড ইফেক্ট
          speed={40} 
          pauseOnHover={true}
          className="py-4 overflow-hidden" // এখানেও overflow-hidden
        >
          {businesses.map((item) => (
            <div 
              key={item._id}
              onClick={() => setSelectedItem(item)}
              className="mx-6 w-32 h-20 md:w-40 md:h-24 relative grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer opacity-60 hover:opacity-100 hover:scale-110 group"
              title="বিস্তারিত দেখতে ক্লিক করুন"
            >
               {/* Logo Image */}
               <Image 
                 src={item.logo} 
                 alt={item.name} 
                 fill
                 className="object-contain drop-shadow-lg"
               />
            </div>
          ))}
        </Marquee>
      </div>

      {/* --- Popup Modal (AnimatePresence) --- */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#1e293b] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8">
                {/* Header: Logo & Name */}
                <div className="flex flex-col items-center text-center mb-6">
                   <div className="relative w-24 h-24 mb-4 bg-[#0f172a] rounded-xl border border-white/5 p-4 flex items-center justify-center">
                      <Image 
                        src={selectedItem.logo} 
                        alt={selectedItem.name} 
                        width={80}
                        height={80}
                        className="object-contain w-full h-full"
                      />
                   </div>
                   <h3 className="text-2xl font-bold text-white">{selectedItem.name}</h3>
                   {selectedItem.website && (
                     <Link 
                        href={selectedItem.website} 
                        target="_blank" 
                        className="text-emerald-500 text-sm flex items-center gap-1 mt-1 hover:underline"
                     >
                        <Globe className="w-3 h-3" /> ওয়েবসাইট ভিজিট
                     </Link>
                   )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5 text-center">
                      <Briefcase className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-400 uppercase">কাজের ভূমিকা</p>
                      <p className="text-white font-medium text-sm">{selectedItem.role}</p>
                   </div>
                   <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5 text-center">
                      <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-400 uppercase">সময়কাল</p>
                      <p className="text-white font-medium text-sm">{selectedItem.duration}</p>
                   </div>
                </div>

                {/* Description */}
                <div className="bg-[#0f172a]/50 p-4 rounded-xl border border-white/5 mb-6">
                   <p className="text-gray-300 text-sm leading-relaxed text-center">
                      &quot;{selectedItem.description}&quot;
                   </p>
                </div>

                {/* CTA Button */}
                <Link 
                   href={selectedItem.website} 
                   target="_blank"
                   className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20"
                >
                   প্রজেক্ট দেখুন <ExternalLink className="w-4 h-4" />
                </Link>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}