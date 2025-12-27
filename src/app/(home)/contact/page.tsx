/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import Swal from "sweetalert2" // SweetAlert ইম্পোর্ট
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  Loader2, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Youtube,
  Globe
} from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [loading, setLoading] = useState(true)
  const [siteInfo, setSiteInfo] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [sending, setSending] = useState(false)

  // --- 1. API থেকে কন্টাক্ট ইনফো আনা ---
  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const res = await axios.get("/api/contact")
        if (res.data.success && res.data.data.length > 0) {
          setSiteInfo(res.data.data[0])
        }
      } catch (error) {
        console.error("Error fetching contact info:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchContactData()
  }, [])

  // --- 2. ফর্ম হ্যান্ডলিং ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    
    try {
      const res = await axios.post("/api/send-email", formData)

      if (res.data.success) {
        // --- Success SweetAlert ---
        Swal.fire({
          title: 'সফল!',
          text: 'ধন্যবাদ! আপনার বার্তা সফলভাবে পাঠানো হয়েছে।',
          icon: 'success',
          confirmButtonText: 'ঠিক আছে',
          confirmButtonColor: '#10b981', // Emerald-500
          background: '#1e293b', // Dark Background matching theme
          color: '#fff', // White Text
          iconColor: '#10b981' // Emerald Icon
        })
        
        // ফর্ম রিসেট
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        // --- Error SweetAlert ---
        Swal.fire({
          title: 'দুঃখিত!',
          text: 'বার্তা পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
          icon: 'error',
          confirmButtonText: 'চেষ্টা করুন',
          confirmButtonColor: '#ef4444', // Red-500
          background: '#1e293b',
          color: '#fff'
        })
      }
    } catch (error) {
      console.error("Error sending email:", error)
      // --- Catch Error SweetAlert ---
      Swal.fire({
        title: 'ত্রুটি!',
        text: 'কোথাও কোনো সমস্যা হয়েছে, দয়া করে পরে আবার চেষ্টা করুন।',
        icon: 'warning',
        confirmButtonText: 'ঠিক আছে',
        confirmButtonColor: '#f59e0b', // Amber-500
        background: '#1e293b',
        color: '#fff'
      })
    } finally {
      setSending(false)
    }
  }

  // --- সোশ্যাল আইকন হেল্পার ---
  const getSocialIcon = (key: string) => {
    switch (key) {
      case "facebook": return <Facebook className="w-5 h-5" />
      case "linkedin": return <Linkedin className="w-5 h-5" />
      case "twitter": return <Twitter className="w-5 h-5" />
      case "instagram": return <Instagram className="w-5 h-5" />
      case "youtube": return <Youtube className="w-5 h-5" />
      default: return <Globe className="w-5 h-5" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020817]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#020817] text-gray-200 font-sans selection:bg-emerald-500/30">
      
      {/* --- Header Section --- */}
      <section className="pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            যোগাযোগ <span className="text-emerald-500">করুন</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-xl mx-auto"
          >
            যে কোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করতে পারেন। আমরা শীঘ্রই আপনার বার্তার উত্তর দেব।
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* --- Left Column: Contact Info --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-[#1e293b]/30 p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/5 pb-4">
                যোগাযোগের তথ্য
              </h3>

              <div className="space-y-6">
                {/* Address */}
                {siteInfo?.address && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-gray-400 text-sm font-medium mb-1">ঠিকানা</h4>
                      <p className="text-white leading-relaxed">{siteInfo.address}</p>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {siteInfo?.phone && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-gray-400 text-sm font-medium mb-1">ফোন নাম্বার</h4>
                      <p className="text-white text-lg font-semibold">{siteInfo.phone}</p>
                    </div>
                  </div>
                )}

                {/* Email */}
                {siteInfo?.email && (
                  <div className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-gray-400 text-sm font-medium mb-1">ইমেইল</h4>
                      <p className="text-white text-lg font-semibold">{siteInfo.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {siteInfo?.social && Object.keys(siteInfo.social).length > 0 && (
                 <div className="mt-10 pt-6 border-t border-white/5">
                    <h4 className="text-gray-400 text-sm mb-4">সোশ্যাল মিডিয়া</h4>
                    <div className="flex gap-3 flex-wrap">
                      {Object.entries(siteInfo.social).map(([key, url]) => {
                        if (!url) return null;
                        return (
                          <Link
                            key={key} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-[#0f172a] border border-white/5 flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
                          >
                            {getSocialIcon(key)}
                          </Link>
                        )
                      })}
                    </div>
                 </div>
              )}
            </div>
          </motion.div>

          {/* --- Right Column: Contact Form --- */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-[#1e293b]/30 p-8 rounded-3xl border border-white/5 backdrop-blur-sm h-full">
              <h3 className="text-2xl font-bold text-white mb-6">মেসেজ পাঠান</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">আপনার নাম</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="নাম লিখুন" 
                      className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">ইমেইল এড্রেস</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@gmail.com" 
                      className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">বিষয়</label>
                  <input 
                    type="text" 
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="কি বিষয়ে জানতে চান?" 
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">মেসেজ</label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="আপনার বিস্তারিত বার্তা লিখুন..." 
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-gray-600 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> মেসেজ পাঠান
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* --- Google Map Section --- */}
        {siteInfo?.address && (
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mt-20 pt-10 border-t border-white/5"
           >
              <h3 className="text-2xl font-bold text-white mb-8 text-center">লোকেশন ম্যাপ</h3>
              <div className="w-full h-[400px] bg-[#1e293b] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0,   }} 
                  loading="lazy" 
                  allowFullScreen 
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(siteInfo.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
           </motion.div>
        )}

      </div>
    </main>
  )
}