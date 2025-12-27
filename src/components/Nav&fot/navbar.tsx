"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, Phone, X, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

// মেনু লিংক (বাংলা)
const menuLinks = [
  { label: "হোম", href: "/" },
  { label: "পরিচিতি", href: "/about" },
  { label: "আর্টিকেল", href: "/blogs" },
  { label: "মিডিয়া", href: "/media" },
  { label: "যোগাযোগ", href: "/contact" },
]

export function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [siteInfo, setSiteInfo] = useState({
    phone: "",
    logo: "",
    siteName: ""
  })
  const pathname = usePathname()

  // --- 1. API থেকে ডাটা আনা (Logo, SiteName, Phone) ---
  useEffect(() => {
    const fetchSiteInfo = async () => {
      try {
        const res = await axios.get("/api/contact")
        if (res.data.success && res.data.data.length > 0) {
          const data = res.data.data[0]
          setSiteInfo({
            phone: data.phone || "",
            logo: data.logo || "",
            siteName: data.siteName || ""
          })
        }
      } catch (error) {
        console.error("Failed to fetch site info", error)
      }
    }
    fetchSiteInfo()
  }, [])

  // --- 2. স্ক্রল ইফেক্ট ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-500 border-b border-transparent font-sans w-full",
          scrolled 
            ? "bg-[#020817]/95 backdrop-blur-xl border-emerald-900/30 py-3 shadow-2xl" 
            : "bg-[#020817] py-6"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          
          {/* --- লোগো অথবা সাইট নেম সেকশন --- */}
          <Link href="/" className="flex items-center gap-3 group">
            
            {siteInfo.logo ? (
                // ১. যদি লোগো থাকে, শুধু লোগো দেখাবে
                <div className="relative h-12 w-auto min-w-[40px] overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={siteInfo.logo} 
                        alt={siteInfo.siteName || "Logo"} 
                        className="h-full w-full object-contain" 
                    />
                </div>
            ) : (
                // ২. যদি লোগো না থাকে কিন্তু সাইট নেম থাকে, শুধু নাম দেখাবে
                siteInfo.siteName && (
                    <span className="text-xl md:text-2xl font-bold text-white leading-none tracking-wide">
                        {siteInfo.siteName}
                    </span>
                )
            )}

          </Link>

          {/* --- ডেস্কটপ মেনু --- */}
          <div className="hidden md:flex items-center gap-8">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-base font-medium transition-colors hover:text-emerald-400 relative py-1",
                  pathname === link.href ? "text-emerald-400 font-semibold" : "text-gray-300"
                )}
              >
                {link.label}
                <span className={cn(
                  "absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0"
                )}/>
              </Link>
            ))}
          </div>

          {/* --- বাটন (ফোন নম্বর সহ) --- */}
          <div className="hidden md:block">
            {siteInfo.phone ? (
                <Button asChild className="bg-transparent border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 rounded-full px-6 transition-all">
                  <a href={`tel:${siteInfo.phone}`} className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{siteInfo.phone}</span>
                  </a>
                </Button>
            ) : (
                <Link href="/contact">
                    <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-full px-6 shadow-lg shadow-emerald-900/50">
                        সাক্ষাৎ করুন
                    </Button>
                </Link>
            )}
          </div>

          {/* --- মোবাইল হ্যামবার্গার --- */}
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </nav>

      {/* --- মোবাইল ড্রয়ার --- */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300",
          isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div
        className={cn(
          "fixed top-0 right-0 z-[70] h-full w-[300px] bg-[#020817] border-l border-emerald-900/30 shadow-2xl transition-transform duration-300 ease-out md:hidden flex flex-col",
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-emerald-950/10">
          <span className="text-lg font-bold text-white">মেনু</span>
          <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2 p-6 overflow-y-auto">
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsDrawerOpen(false)}
              className={cn(
                "px-4 py-3 rounded-lg text-base font-medium transition-all flex justify-between items-center",
                pathname === link.href 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="p-6 border-t border-white/10 bg-black/20">
          {siteInfo.phone && (
             <Button asChild className="w-full bg-white/5 text-emerald-400 hover:bg-white/10 hover:text-emerald-300 mb-3 border border-emerald-500/30">
               <a href={`tel:${siteInfo.phone}`} className="flex items-center justify-center gap-2">
                 <Phone className="h-4 w-4" />
                 <span>{siteInfo.phone}</span>
               </a>
             </Button>
          )}
          <Link href="/contact" onClick={() => setIsDrawerOpen(false)}>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-lg">
                <Calendar className="mr-2 h-5 w-5" /> এপয়েন্টমেন্ট নিন
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}