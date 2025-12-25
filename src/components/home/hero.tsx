/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { motion, Variants } from "framer-motion" // Variants ইম্পোর্ট করা হয়েছে
import { Button } from "@/components/ui/button"
import { PlayCircle, ArrowRight, Star, Moon, Sparkles, Quote } from "lucide-react"

// ইসলামিক মান্ডালা ব্যাকগ্রাউন্ড
const MANDALA_BG_URL = "https://cdn.shopify.com/s/files/1/0712/0096/4662/files/vecteezy_islamic-background-vector-graphics-with-arabic-mandala_7142944.svg?v=1766666212";

// === 1. অ্যানিমেশন ভেরিয়েন্ট ফিক্স (Type Added) ===
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: "easeOut" // স্ট্রিং ব্যবহার করলে এরর দিবে না
    } 
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export function HeroSection() {
  const [aboutData, setAboutData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) return <div className="min-h-[90vh] bg-[#020817] flex items-center justify-center"><div className="w-10 h-10 border-2 border-emerald-500 rounded-full animate-spin border-t-transparent"></div></div>

  return (
    <section className="relative min-h-[92vh] flex items-center pt-24 lg:pt-32 pb-20 overflow-hidden bg-[#020817]">
      
      {/* ================= BACKGROUND LAYERS ================= */}
      
      {/* 1. Rotating Golden Mandala */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.08]">
         <div 
            className="w-[150vw] h-[150vw] lg:w-[1000px] lg:h-[1000px] bg-no-repeat bg-center bg-contain animate-[spin_120s_linear_infinite]"
            style={{
                backgroundImage: `url("${MANDALA_BG_URL}")`,
                filter: 'invert(1) sepia(1) saturate(5) hue-rotate(5deg)'
            }}
         />
      </div>

      {/* 2. Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/80 via-transparent to-[#020817]" />
      
      {/* 3. Ambient Glow Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />


      {/* ================= CONTENT ================= */}
      <div className="container mx-auto px-6 relative z-10">
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
        
          {/* === LEFT: TEXT CONTENT === */}
          <div className="text-center lg:text-left relative">
            
            {/* Greeting Badge */}
            <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:border-emerald-500/30 transition-colors">
                <Moon className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
                <span className="text-emerald-50 font-medium text-sm tracking-wide">আসসালামু আলাইকুম ওয়া রহমাতুল্লাহ</span>
              </div>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-8 font-sans tracking-tight">
              <span className="block text-white drop-shadow-lg">জ্ঞান ও আমলের</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#e8c06e] drop-shadow-[0_4px_20px_rgba(253,185,49,0.25)]">
                {aboutData?.heroTitle || "আলোকিত পথচলা"}
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg lg:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              {aboutData?.tagline || "শুদ্ধ ইসলামিক জ্ঞান অর্জন এবং আত্মশুদ্ধির পথে আপনাকে স্বাগতম।"}
            </motion.p>
            
            {/* Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link href="/media">
                <Button className="h-14 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-medium shadow-[0_0_25px_-5px_rgba(16,185,129,0.4)] transition-all hover:scale-105 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <PlayCircle className="mr-2 h-6 w-6 relative z-10" /> 
                  <span className="relative z-10">লেকচার দেখুন</span>
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button variant="outline" className="h-14 px-8 rounded-full border-white/10 hover:bg-white/5 text-white text-lg hover:text-emerald-400 hover:border-emerald-500/50 transition-all backdrop-blur-sm">
                  সরাসরি কথা বলুন <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats Bar */}
            <motion.div variants={fadeInUp} className="mt-16 pt-8 border-t border-white/5 grid grid-cols-3 gap-4 lg:max-w-md">
               <StatsBox number={aboutData?.stats?.lectures || "500+"} label="লেকচার" />
               <StatsBox number={aboutData?.stats?.followers || "50k+"} label="ফলোয়ার" />
               <StatsBox number={aboutData?.stats?.experience || "10+"} label="অভিজ্ঞতা" />
            </motion.div>
          </div>

          {/* === RIGHT: IMAGE & CARD === */}
          <div className="relative flex justify-center lg:justify-end items-center mt-10 lg:mt-0">
            
            {/* Image Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-[320px] sm:w-[400px] h-[480px] sm:h-[560px] z-10"
            >
                {/* Glowing Ring Animation */}
                <div className="absolute -inset-4 rounded-t-[12rem] rounded-b-[3rem] border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent blur-md animate-pulse" />
                
                {/* Golden Border Frame */}
                <div className="absolute -inset-[2px] rounded-t-[12rem] rounded-b-[3rem] bg-gradient-to-b from-[#FFD700] to-[#b88a14] opacity-40" />

                {/* Main Image Mask */}
                <div className="w-full h-full rounded-t-[12rem] rounded-b-[3rem] overflow-hidden bg-[#0f172a] relative shadow-2xl">
                   {aboutData?.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={aboutData.imageUrl} 
                        alt={aboutData?.name || "Islamic Scholar"} 
                        className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 hover:scale-105 transition-all duration-700 ease-in-out" 
                      />
                   ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-[#1e293b]">
                         <Moon className="h-12 w-12 opacity-20 mb-2" />
                         <span>Image Not Found</span>
                      </div>
                   )}
                   
                   {/* Name Overlay at Bottom */}
                   <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#020817] via-[#020817]/80 to-transparent pt-20 text-center">
                      <h3 className="text-2xl font-bold text-white mb-1 font-serif tracking-wide">{aboutData?.name}</h3>
                      <p className="text-[#FFD700] text-sm uppercase tracking-widest font-medium opacity-90">{aboutData?.designation}</p>
                   </div>
                </div>

                {/* Decorative Star Element */}
                <div className="absolute -top-6 -right-6 animate-[spin_10s_linear_infinite]">
                    <div className="relative flex items-center justify-center">
                        <div className="w-12 h-12 border border-[#FFD700]/30 rotate-45 absolute" />
                        <div className="w-12 h-12 border border-[#FFD700]/30 absolute" />
                        <Star className="h-5 w-5 text-[#FFD700] fill-[#FFD700]" />
                    </div>
                </div>

                {/* Daily Quote Floating Card */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute -bottom-12 -left-12 lg:-left-24 bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl max-w-[260px] hidden sm:block hover:border-emerald-500/30 transition-colors"
                >
                   <div className="flex gap-3">
                      <div className="mt-1">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFD700] to-[#b88a14] flex items-center justify-center shadow-lg">
                            <Quote className="h-4 w-4 text-white fill-white" />
                         </div>
                      </div>
                      <div>
                         <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold mb-1">
                            {aboutData?.dailyQuote?.title || "রিমাইন্ডার"}
                         </p>
                         <p className="text-sm font-medium text-gray-200 leading-snug italic">
                            &quot;{aboutData?.dailyQuote?.text || "ধৈর্য ধরুন, নিশ্চয়ই আল্লাহ ধৈর্যশীলদের সাথে আছেন।"}&quot;
                         </p>
                      </div>
                   </div>
                </motion.div>

            </motion.div>
          </div>

        </motion.div>
      </div>
    </section>
  )
}

function StatsBox({ number, label }: { number: string, label: string }) {
    return (
        <motion.div 
            variants={fadeInUp}
            className="text-center lg:text-left border-l-2 border-white/5 pl-4 first:pl-0 first:border-l-0"
        >
            <h4 className="text-3xl font-bold text-white font-mono">{number}</h4>
            <p className="text-xs text-emerald-500 mt-1 uppercase tracking-widest font-medium">{label}</p>
        </motion.div>
    )
}