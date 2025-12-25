/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Facebook, Twitter, Instagram, Youtube, Linkedin, Github, Globe,
  Mail, MapPin, Phone, ArrowRight, Heart, Book
} from "lucide-react"

// ... (Interface & Helper function same as before) ...
// শুধু JSX অংশটি বাংলায় হবে

export function Footer() {
  const [contactInfo, setContactInfo] = useState<any>(null)
  const currentYear = new Date().getFullYear()

  // API Fetching Same...
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/contact")
        if (res.data.success && res.data.data.length > 0) setContactInfo(res.data.data[0])
      } catch (error) {}
    }
    fetchData()
  }, [])

  // Helper Same...
  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase().trim()
    if (p.includes("facebook")) return Facebook
    if (p.includes("youtube")) return Youtube
    if (p.includes("instagram")) return Instagram
    if (p.includes("twitter")) return Twitter
    if (p.includes("linkedin")) return Linkedin
    return Globe
  }

  return (
    <footer className="bg-[#01060e] border-t border-white/5 pt-20 pb-10 text-gray-400 relative overflow-hidden font-sans">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/arabesque.png")` }}></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
                <Book className="text-emerald-500 h-6 w-6" />
                <span className="text-2xl font-bold text-white">স্কলার পোর্টফোলিও</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              বিশুদ্ধ ইসলামিক জ্ঞান প্রচার, আত্মশুদ্ধি এবং একটি আদর্শ সমাজ গঠনের লক্ষ্যে আমাদের এই পথচলা।
            </p>
            <div className="flex gap-3 pt-2">
              {contactInfo?.social && Object.entries(contactInfo.social).map(([platform, url]) => {
                if (!url) return null;
                const Icon = getSocialIcon(platform)
                return (
                  <a key={platform} href={url as string} target="_blank" className="h-9 w-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300">
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-6 border-l-4 border-emerald-500 pl-3">প্রয়োজনীয় লিংক</h3>
            <ul className="space-y-3 text-sm">
              {[{l:"আমাদের সম্পর্কে", h:"/about"}, {l:"লেকচার সমূহ", h:"/media"}, {l:"আর্টিকেল", h:"/blogs"}, {l:"যোগাযোগ", h:"/contact"}].map((link, i) => (
                <li key={i}>
                  <Link href={link.h} className="hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400" />
                    {link.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6 border-l-4 border-emerald-500 pl-3">যোগাযোগের ঠিকানা</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{contactInfo?.address || "লোড হচ্ছে..."}</span>
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

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6 border-l-4 border-emerald-500 pl-3">নিউজলেটার</h3>
            <p className="text-xs mb-4">নতুন লেকচার এবং আপডেটের জন্য সাবস্ক্রাইব করুন।</p>
            <div className="space-y-3">
              <Input placeholder="আপনার ইমেইল লিখুন" className="bg-white/5 border-white/10 text-white focus:border-emerald-500 h-11" />
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11">
                সাবস্ক্রাইব করুন <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-1">
            <span>Developed by</span>
            <span className="text-emerald-500 font-bold">TechFosys</span>
          </div>
        </div>
      </div>
    </footer>
  )
}