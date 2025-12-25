/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState, FC } from "react"
import axios, { AxiosError } from "axios"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  Users,
  Star,
  ArrowRight,
  Sparkles,
  LucideIcon,
  Linkedin,
  Facebook,
  Twitter,
  Globe,
  Github,
  Youtube,
  Instagram,
  Link as LinkIcon,
  Mail,
  Phone,
} from "lucide-react"

// ============= TYPES =============

interface Social {
  id?: string
  platform: string
  url?: string
  link?: string
}

interface Experience {
  id?: string
  year: string
  role: string
  company: string
  description: string
}

interface TeamMember {
  id?: string
  name: string
  role: string
  bio: string
  image?: string
  imageUrl?: string
  socials?: Social[]
}

interface AboutData {
  _id?: string
  name: string
  designation: string
  tagline: string
  description?: string
  imageUrl?: string
  skills?: string[]
  experiences?: Experience[]
  team?: TeamMember[]
  socials?: Social[]
}

// ============= CONSTANTS =============

const PRIMARY_COLOR = "#05081b"
const SECONDARY_COLOR = "#00d492"
const BG_SHAPE = "https://ahmadullah.info/images/shape/01.png"

const getSocialIcon = (platform: string): LucideIcon => {
  const p = platform?.toLowerCase().trim() || ""
  if (p.includes("facebook")) return Facebook
  if (p.includes("linkedin")) return Linkedin
  if (p.includes("twitter")) return Twitter
  if (p.includes("instagram")) return Instagram
  if (p.includes("github")) return Github
  if (p.includes("youtube")) return Youtube
  if (p.includes("website")) return Globe
  return LinkIcon
}

// ============= ANIMATIONS =============

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
}

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// ============= LOADING COMPONENT =============

const LoadingSpinner: FC = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ backgroundColor: PRIMARY_COLOR }}
  >
    <div className="space-y-4 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 rounded-full mx-auto"
        style={{
          borderColor: SECONDARY_COLOR,
          borderTopColor: "transparent",
        }}
      />
      <p style={{ color: SECONDARY_COLOR }} className="font-semibold">
        লোড হচ্ছে...
      </p>
    </div>
  </div>
)

// ============= HERO / ABOUT SECTION =============

interface HeroSectionProps {
  data: AboutData
}

const HeroSection: FC<HeroSectionProps> = ({ data }) => (
  <motion.section
    initial="hidden"
    animate="visible"
    variants={staggerContainer}
    className="relative min-h-screen flex items-center py-20 px-4"
    style={{ backgroundColor: PRIMARY_COLOR }}
  >
    {/* Background Shape */}
    <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
      <img
        src={BG_SHAPE}
        alt="bg"
        className="w-full h-full object-cover"
      />
    </div>

    <div className="relative z-10 max-w-6xl w-full mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Left - Image */}
        <motion.div variants={slideInLeft} className="relative">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            {data?.imageUrl ? (
              <motion.img
                src={data.imageUrl}
                alt={data?.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR}40)`,
                }}
              >
                ছবি পাওয়া যায়নি
              </div>
            )}
            
            {/* Border Glow */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                border: `3px solid ${SECONDARY_COLOR}`,
                boxShadow: `inset 0 0 20px ${SECONDARY_COLOR}20, 0 0 30px ${SECONDARY_COLOR}40`,
              }}
            />
          </div>
        </motion.div>

        {/* Right - Content */}
        <motion.div variants={slideInRight} className="space-y-8">
          {/* Name Section */}
          <div className="space-y-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "4rem" }}
              transition={{ duration: 0.8 }}
              className="h-1 rounded-full"
              style={{ background: SECONDARY_COLOR }}
            />
            <h1
              className="text-5xl md:text-6xl font-bold leading-tight"
              style={{ color: "white" }}
            >
              {data?.name}
            </h1>
            <p
              className="text-2xl font-semibold"
              style={{ color: SECONDARY_COLOR }}
            >
              {data?.designation}
            </p>
          </div>

          {/* Tagline */}
          <div className="space-y-4">
            <p className="text-lg text-gray-300 leading-relaxed">
              {data?.tagline}
            </p>
            <p className="text-gray-400 leading-relaxed">
              {data?.description || "আপনার বিষয়ে তথ্য শীঘ্রই যোগ করা হবে।"}
            </p>
          </div>

          {/* Skills */}
          {data?.skills && data.skills.length > 0 && (
            <motion.div variants={staggerContainer} className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                দক্ষতা
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string, index: number) => (
                  <motion.span
                    key={index}
                    variants={fadeIn}
                    className="px-4 py-2 border rounded-full text-sm font-medium text-white"
                    style={{
                      borderColor: SECONDARY_COLOR,
                      background: `rgba(0, 212, 146, 0.1)`,
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              className="px-8 py-3 text-white font-bold rounded-lg flex items-center gap-2"
              style={{ background: SECONDARY_COLOR }}
            >
              যোগাযোগ করুন
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </motion.section>
)

// ============= TEAM SECTION =============

interface TeamSectionProps {
  team: TeamMember[]
}

const TeamSection: FC<TeamSectionProps> = ({ team }) => (
  <motion.section
    initial="hidden"
    whileInView="visible"
    variants={staggerContainer}
    viewport={{ once: true }}
    className="py-20 px-4"
    style={{ backgroundColor: PRIMARY_COLOR }}
  >
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div variants={fadeIn} className="text-center mb-16 space-y-3">
        <h2
          className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3"
          style={{ color: "white" }}
        >
          <Users className="w-8 h-8" style={{ color: SECONDARY_COLOR }} />
          আমাদের টিম
        </h2>
        <p className="text-gray-400">আমাদের প্রতিভাবান টিম সদস্যরা</p>
      </motion.div>

      {/* Team Grid */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {team.map((member: TeamMember, index: number) => (
          <motion.div
            key={index}
            variants={fadeIn}
            whileHover={{ y: -5 }}
            className="rounded-xl overflow-hidden shadow-lg border transition-all"
            style={{
              background: `rgba(255, 255, 255, 0.05)`,
              borderColor: `${SECONDARY_COLOR}40`,
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY_COLOR}, ${SECONDARY_COLOR}30)`,
              }}
            >
              {member.image || member.imageUrl ? (
                <motion.img
                  src={member.image || member.imageUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                  ছবি নেই
                </div>
              )}

              {/* Social Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center gap-3"
                style={{
                  background: `rgba(5, 8, 27, 0.9)`,
                }}
              >
                {member.socials?.map((social: Social, i: number) => {
                  const Icon = getSocialIcon(social.platform)
                  return (
                    <motion.a
                      key={i}
                      href={social.url || social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2 }}
                      className="p-2 rounded-full transition-all"
                      style={{
                        background: SECONDARY_COLOR,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: PRIMARY_COLOR }} />
                    </motion.a>
                  )
                })}
              </motion.div>
            </div>

            {/* Info */}
            <div className="p-6 space-y-2">
              <h3 className="text-xl font-bold text-white">{member.name}</h3>
              <p className="font-semibold text-sm" style={{ color: SECONDARY_COLOR }}>
                {member.role}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </motion.section>
)

// ============= MAIN COMPONENT =============

const AboutPage: FC = () => {
  const [data, setData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const res = await axios.get<AboutData>("/api/about")
        if (res.data) {
          setData(res.data)
          setError(null)
        }
      } catch (err) {
        const axiosError = err as AxiosError
        console.error("Error fetching about data", axiosError)
        setError("ডেটা লোড করতে ব্যর্থ হয়েছে")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        <div className="text-center">
          <p className="text-xl font-bold" style={{ color: SECONDARY_COLOR }}>
            {error || "ডেটা পাওয়া যায়নি"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: PRIMARY_COLOR }}>
      <HeroSection data={data} />
      {data.team && data.team.length > 0 && <TeamSection team={data.team} />}
    </div>
  )
}

export default AboutPage