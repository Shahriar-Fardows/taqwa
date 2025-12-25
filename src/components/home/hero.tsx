/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PlayCircle, ArrowRight, Star, Moon } from "lucide-react"

export function HeroSection() {
  const [aboutData, setAboutData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // API থেকে ডাটা আনা
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/about")
        if (res.data) setAboutData(res.data)
      } catch (error) {
        console.error("Error fetching hero data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-[#020817]">
      
      {/* ১. ব্যাকগ্রাউন্ড প্যাটার্ন (Islamic Geometric Pattern) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/arabesque.png")` }}>
      </div>

      {/* ২. এমবিয়েন্ট গ্লো (Ambient Glows) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* --- বাম পাশ: টেক্সট কন্টেন্ট --- */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left pt-10 lg:pt-0"
        >
          {/* গ্রিটিং ব্যাজ */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold mb-8 backdrop-blur-md">
            <Moon className="h-3 w-3 fill-emerald-400" />
            <span>আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ</span>
          </div>
          
          {/* মেইন হেডলাইন (গোল্ডেন গ্রেডিয়েন্ট) */}
          <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 font-sans">
            <span className="text-white">জ্ঞান ও আমলের</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#e8c06e] drop-shadow-sm">
              আলোকিত পথচলা
            </span>
          </h1>
          
          {/* সাবটাইটেল / ডেসক্রিপশন */}
          <p className="text-gray-400 text-lg lg:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
            {aboutData?.tagline || "শুদ্ধ ইসলামিক জ্ঞান অর্জন এবং আত্মশুদ্ধির পথে আপনাকে স্বাগতম। আসুন কুরআন ও সুন্নাহর আলোকে জীবন গড়ি এবং আখিরাতের পাথেয় সংগ্রহ করি।"}
          </p>
          
          {/* বাটন গ্রুপ */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <Link href="/media">
              <Button className="h-14 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-medium shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)] transition-all hover:scale-105 group">
                <PlayCircle className="mr-2 h-6 w-6 group-hover:text-[#FFD700] transition-colors" /> লেকচার দেখুন
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button variant="outline" className="h-14 px-8 rounded-full border-white/10 hover:bg-white/5 text-white text-lg hover:text-emerald-400 hover:border-emerald-500/50 transition-all group">
                সরাসরি কথা বলুন <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* স্ট্যাটস (বটম বার) */}
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t border-white/5 pt-8">
             <div className="text-center lg:text-left">
               <h4 className="text-2xl font-bold text-white font-mono">৫০০+</h4>
               <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">লেকচার</p>
             </div>
             <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
             <div className="text-center lg:text-left">
               <h4 className="text-2xl font-bold text-white font-mono">৫০k+</h4>
               <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">ফলোয়ার</p>
             </div>
             <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
             <div className="text-center lg:text-left">
               <h4 className="text-2xl font-bold text-white font-mono">১০+</h4>
               <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">বছর অভিজ্ঞতা</p>
             </div>
          </div>
        </motion.div>

        {/* --- ডান পাশ: ইমেজ ফ্রেম (Islamic Arch Style) --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* মেহরাব আকৃতির কন্টেইনার */}
          <div className="relative w-[300px] sm:w-[380px] h-[450px] sm:h-[520px] z-10">
              
              {/* ডেকোরেটিভ বর্ডার (Golden Ring Animation) */}
              <div className="absolute -inset-3 rounded-t-[10rem] rounded-b-3xl border border-[#FFD700]/20 animate-[spin_30s_linear_infinite]" />
              <div className="absolute -inset-1 rounded-t-[10rem] rounded-b-3xl border-2 border-emerald-500/30" />
              
              {/* মূল ইমেজ বক্স */}
              <div className="w-full h-full rounded-t-[10rem] rounded-b-3xl overflow-hidden border-4 border-[#0a101f] shadow-2xl relative bg-gray-800 group">
                 {aboutData?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={aboutData.imageUrl} 
                      alt="Islamic Scholar" 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                    />
                 ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 animate-pulse">
                       <span>লোড হচ্ছে...</span>
                    </div>
                 )}
                 
                 {/* ইমেজের নিচের গ্রাডিয়েন্ট শেড */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent opacity-80" />
                 
                 {/* নাম ব্যাজ (ইমেজের উপরে) */}
                 <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                    <h3 className="text-2xl font-bold text-white drop-shadow-md mb-1">
                      {aboutData?.name || "লোড হচ্ছে..."}
                    </h3>
                    <p className="text-sm text-[#FFD700] font-medium tracking-wide drop-shadow-sm uppercase">
                      {aboutData?.designation || "ইসলামিক স্কলার"}
                    </p>
                 </div>
              </div>

              {/* ফ্লোটিং কার্ড (Floating Card) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-[#0f172a]/95 backdrop-blur p-4 rounded-2xl border border-white/10 shadow-xl flex items-center gap-3 max-w-[200px]"
              >
                 <div className="h-10 w-10 rounded-full bg-[#FFD700]/10 flex items-center justify-center border border-[#FFD700]/20">
                    <Star className="h-5 w-5 text-[#FFD700] fill-[#FFD700]" />
                 </div>
                 <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">পরবর্তী ইভেন্ট</p>
                    <p className="text-xs font-bold text-white">সাপ্তাহিক তাফসির মাহফিল</p>
                 </div>
              </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}