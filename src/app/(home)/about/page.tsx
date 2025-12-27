"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Loader2, 
  Github, 
  Linkedin, 
  Facebook, 
  Twitter, 
  Globe, 
  Instagram, 
  Youtube,
  Mail,
  Quote,
  Briefcase,
  Calendar,
  MapPin
} from "lucide-react"

// --- Types ---
interface Social {
  id: string
  platform: string
  url: string
}
interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  bio: string
  socials: Social[]
}
interface Experience {
  id: string
  role: string
  company: string
  year: string
  description: string
}
interface AboutData {
  _id: string
  name: string
  designation: string
  tagline: string;
  description: string;
  imageUrl: string
  team: TeamMember[]
  skills?: string[]
  experiences?: Experience[]
}

// --- Icons Helper ---
const getSocialIcon = (platform: string) => {
  const p = platform?.toLowerCase().trim() || ""
  switch (p) {
    case 'github': return <Github className="w-5 h-5" />
    case 'linkedin': return <Linkedin className="w-5 h-5" />
    case 'facebook': return <Facebook className="w-5 h-5" />
    case 'twitter': return <Twitter className="w-5 h-5" />
    case 'instagram': return <Instagram className="w-5 h-5" />
    case 'youtube': return <Youtube className="w-5 h-5" />
    default: return <Globe className="w-5 h-5" />
  }
}

// --- Animations ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/about')
        setData(res.data)
      } catch (err) {
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (!data) return null;

  return (
    <main className="min-h-screen bg-[#020617] pt-10 text-gray-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* --- 1. Hero Section (New Layout) --- */}
      <section className="relative pb-20 px-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left: Poster Image Card (Name & Tagline Overlay) */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-5/12 lg:sticky lg:top-24"
            >
              {/* Image Container with Fixed Aspect Ratio */}
              <div className="relative w-full h-[500px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0f172a] group">
                
                {data.imageUrl ? (
                  <Image 
                    src={data.imageUrl} 
                    alt={data.name}
                    fill
                    // object-cover ensures image fills the size without distortion
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
                )}

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90"></div>

                {/* Name & Tagline ON the Image */}
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="inline-block px-3 py-1 rounded bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider mb-2">
                            {data.designation}
                        </span>
                        <h1 className="text-4xl font-extrabold text-white leading-tight mb-2">
                            {data.name}
                        </h1>
                        <p className="text-emerald-400 font-medium text-lg italic">
                            {data.tagline}
                        </p>
                    </motion.div>
                </div>
              </div>

              {/* Contact Button (Below Image) */}
              <div className="mt-6 flex justify-center lg:justify-start">
                 <Link 
                    href="/contact" 
                    className="w-full text-center py-4 bg-[#1e293b] border border-emerald-500/30 text-emerald-400 font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-lg"
                 >
                    যোগাযোগ করুন
                 </Link>
              </div>
            </motion.div>

            {/* Right: Bio & Skills */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-7/12 space-y-8"
            >
              {/* About Header */}
              <div className="flex items-center gap-4">
                  <div className="h-1 flex-1 bg-white/10 rounded-full"></div>
                  <span className="text-gray-400 uppercase tracking-widest text-sm font-semibold">আমার পরিচয়</span>
                  <div className="h-1 w-10 bg-emerald-500 rounded-full"></div>
              </div>

              {/* Main Description */}
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-8 whitespace-pre-wrap text-lg font-light">
                  {data.description}
                </p>
              </div>

              {/* Skills Grid */}
              {data.skills && data.skills.length > 0 && (
                <div className="bg-[#1e293b]/50 p-6 rounded-2xl border border-white/5">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-500" />
                    দক্ষতা
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-[#0f172a] border border-white/10 rounded-lg text-sm text-gray-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 2. Experience Section (Redesigned for Mobile) --- */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="py-16 md:py-24 bg-[#0b1121] relative border-t border-white/5 overflow-hidden">
          {/* Background Gradient Spot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-500/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

          <div className="container mx-auto max-w-5xl px-4 md:px-6 relative z-10">
            {/* Header */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-12 md:mb-20"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-white flex items-center justify-center gap-3">
                <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
                পেশাগত যাত্রা
              </h2>
              <p className="text-gray-400 mt-3 text-sm md:text-base max-w-lg mx-auto px-2">
                আমার কর্মজীবনের পথচলা এবং এই পথে অর্জিত গুরুত্বপূর্ণ অভিজ্ঞতা ও সাফল্য।
              </p>
            </motion.div>

            {/* Timeline Wrapper */}
            <div className="relative">
              {/* Center Vertical Line (Desktop) */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />
              
              {/* Mobile Left Line (Adjusted Position) */}
              <div className="md:hidden absolute left-5 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent" />

              <div className="space-y-8 md:space-y-12">
                {data.experiences.map((exp, index) => (
                  <motion.div 
                    key={exp.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-start md:items-center justify-between ${
                      index % 2 === 0 ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Empty Space for Balance (Desktop) */}
                    <div className="hidden md:block w-5/12" />

                    {/* Icon Node (Responsive Positioning) */}
                    {/* Mobile: Left aligned, Desktop: Center aligned */}
                    <div className="absolute left-5 md:left-1/2 transform -translate-x-1/2 md:-translate-y-0 z-20 mt-1.5 md:mt-0">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0b1121] border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                          <Briefcase className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                        </div>
                    </div>

                    {/* Content Card */}
                    {/* Mobile: Less padding left (pl-14), Desktop: Normal layout */}
                    <div className="w-full md:w-5/12 pl-14 md:pl-0">
                      <div className={`relative bg-[#1e293b]/40 backdrop-blur-sm p-5 md:p-6 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group hover:bg-[#1e293b]/60 ${
                        index % 2 === 0 ? "md:text-right" : "md:text-left"
                      }`}>
                        
                        {/* Connecting Arrow (Desktop Only) */}
                        <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#1e293b]/40 border-t border-l border-white/5 rotate-45 ${
                           index % 2 === 0 ? "-right-2 border-r border-t-0 border-l-0" : "-left-2"
                        }`}></div>

                        {/* Year Badge */}
                        <div className={`inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full text-[11px] md:text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${
                           index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {exp.year}
                        </div>

                        <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors leading-tight">
                          {exp.role}
                        </h3>
                        
                        <div className={`flex flex-wrap items-center gap-2 text-gray-400 font-medium text-xs md:text-sm mb-3 uppercase tracking-wide ${
                           index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                        }`}>
                           <span className="flex items-center gap-1">
                             <MapPin className="w-3 h-3 md:w-4 md:h-4 text-emerald-500/70" />
                             {exp.company}
                           </span>
                        </div>

                        <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap border-t border-white/5 pt-3 mt-1">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- 3. Team Section --- */}
      {data.team && data.team.length > 0 && (
        <section className="py-24 px-6 bg-[#020617] border-t border-white/5">
          <div className="container mx-auto max-w-6xl">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
               <span className="text-emerald-500 font-bold tracking-widest uppercase text-sm">টিম সদস্যরা</span>
               <h2 className="text-4xl font-bold text-white mt-2">টিমের সদস্যদের পরিচয়</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.team.map((member, i) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/40 transition-all duration-300"
                >
                  <div className="relative h-72 w-full bg-[#0f172a]">
                    {member.image ? (
                        <Image 
                          src={member.image} 
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-500 "
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">No Photo</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent opacity-90" />
                    
                    {/* Name & Role Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white">{member.name}</h3>
                        <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider">{member.role}</p>
                    </div>
                  </div>

                  <div className="p-6 pt-2">
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 h-10">
                        {member.bio}
                    </p>
                    
                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      {member.socials?.map((social) => {
                         if (!social.url || social.url.trim() === "") return null;
                         return (
                            <Link 
                                key={social.id} 
                                href={social.url}
                                target="_blank"
                                className="p-2 bg-[#0f172a] text-gray-400 rounded-lg hover:bg-emerald-500 hover:text-white transition-all hover:-translate-y-1"
                            >
                                {getSocialIcon(social.platform)}
                            </Link>
                         )
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  )
}