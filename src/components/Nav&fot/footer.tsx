/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Facebook,  Twitter, Instagram, Youtube, Linkedin, Github, Globe,
  Mail, MapPin, Phone, ArrowRight, BookOpen, MessageCircle, Video
} from "lucide-react"

export function Footer() {
  const [contactInfo, setContactInfo] = useState<any>(null)
  const currentYear = new Date().getFullYear()

  // --- API থেকে ডাটা আনা ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/contact")
        if (res.data.success && res.data.data.length > 0) {
          setContactInfo(res.data.data[0])
        }
      } catch (error) {
        console.error("Footer data fetch error", error)
      }
    }
    fetchData()
  }, [])

  // --- সোশ্যাল আইকন হেল্পার ---
  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase().trim()
    if (p.includes("facebook")) return Facebook
    if (p.includes("youtube")) return Youtube
    if (p.includes("instagram")) return Instagram
    if (p.includes("twitter")) return Twitter
    if (p.includes("linkedin")) return Linkedin
    if (p.includes("whatsapp")) return MessageCircle
    if (p.includes("tiktok")) return Video
    if (p.includes("github")) return Github
    return Globe
  }

  return (
    <footer className="bg-[#01060e] border-t border-white/5 pt-20 pb-10 text-gray-400 relative overflow-hidden font-sans">
      
      {/* ব্যাকগ্রাউন্ড প্যাটার্ন */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/arabesque.png")` }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* ১. ব্র্যান্ড সেকশন (লোগো বা নাম) */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
                
                {/* কন্ডিশন: লোগো থাকলে ইমেজ, না থাকলে টেক্সট */}
                {contactInfo?.logo ? (
                    <div className="relative h-14 w-auto overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={contactInfo.logo} 
                            alt="Logo" 
                            className="h-full w-full object-contain" 
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
                            <BookOpen className="text-white h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-white leading-none tracking-wide">
                                {contactInfo?.siteName || "স্কলার পোর্টফোলিও"}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-medium tracking-widest uppercase mt-1">
                                ইসলামিক শিক্ষা ও গবেষণা
                            </span>
                        </div>
                    </div>
                )}

            </Link>

            <p className="text-sm leading-relaxed text-gray-400">
              বিশুদ্ধ ইসলামিক জ্ঞান প্রচার, আত্মশুদ্ধি এবং একটি আদর্শ সমাজ গঠনের লক্ষ্যে আমাদের এই পথচলা।
            </p>
            
            {/* ডাইনামিক সোশ্যাল আইকন */}
            <div className="flex gap-3 pt-2 flex-wrap">
              {contactInfo?.social && Object.entries(contactInfo.social).map(([platform, url]) => {
                if (!url) return null;
                const Icon = getSocialIcon(platform)
                return (
                  <a 
                    key={platform} 
                    href={url as string} 
                    target="_blank" 
                    rel="noreferrer"
                    className="h-9 w-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300"
                    title={platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* ২. প্রয়োজনীয় লিংক */}
          <div>
            <h3 className="text-white font-bold mb-6 border-l-4 border-emerald-500 pl-3">প্রয়োজনীয় লিংক</h3>
            <ul className="space-y-3 text-sm">
              {[
                  {l:"আমাদের সম্পর্কে", h:"/about"}, 
                  {l:"লেকচার সমূহ", h:"/media"}, 
                  {l:"আর্টিকেল ও ব্লগ", h:"/blogs"}, 
                  {l:"যোগাযোগ", h:"/contact"}
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.h} className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400" />
                    {link.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ৩. যোগাযোগের ঠিকানা (ডাইনামিক) */}
          <div>
            <h3 className="text-white font-bold mb-6 border-l-4 border-emerald-500 pl-3">যোগাযোগের ঠিকানা</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{contactInfo?.address || "লোড হচ্ছে..."}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>{contactInfo?.phone || "লোড হচ্ছে..."}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-500 shrink-0" />
                <span>{contactInfo?.email || "লোড হচ্ছে..."}</span>
              </li>
            </ul>
          </div>

          {/* ৪. নিউজলেটার */}
          <div>
            <h3 className="text-white font-bold mb-6 border-l-4 border-emerald-500 pl-3">নিউজলেটার</h3>
            <p className="text-xs mb-4">নতুন লেকচার এবং আপডেটের জন্য সাবস্ক্রাইব করুন।</p>
            <div className="space-y-3">
              <Input 
                placeholder="আপনার ইমেইল লিখুন" 
                className="bg-white/5 border-white/10 text-white focus:border-emerald-500 h-11 placeholder:text-gray-600" 
              />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 transition-all">
                সাবস্ক্রাইব করুন <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* কপিরাইট সেকশন */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} {contactInfo?.siteName || "স্কলার পোর্টফোলিও"}। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-1">
            <span>Developed by</span>
            <a href="https://teachfosys.com" target="_blank" rel="noreferrer" className="text-emerald-500 font-bold hover:underline">
                TechFosys
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}