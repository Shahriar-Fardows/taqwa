"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, Phone, X, Calendar, BookOpen } from "lucide-react"
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
  const [phoneNumber, setPhoneNumber] = useState("") 
  const pathname = usePathname()

  // API থেকে ফোন নম্বর আনা
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get("/api/contact")
        if (res.data.success && res.data.data.length > 0) {
          setPhoneNumber(res.data.data[0].phone)
        }
      } catch (error) {
        console.error("Failed to fetch contact info", error)
      }
    }
    fetchContactInfo()
  }, [])

  // স্ক্রল ইফেক্ট
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b border-transparent font-sans",
          scrolled 
            ? "bg-[#020817]/95 backdrop-blur-xl border-emerald-900/30 py-3 shadow-2xl" 
            : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          
          {/* লোগো */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
                <BookOpen className="text-white h-6 w-6" />
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-none tracking-wide">স্কলার পোর্টফোলিও</span>
                <span className="text-[10px] text-emerald-400 font-medium tracking-widest uppercase">ইসলামিক শিক্ষা ও গবেষণা</span>
            </div>
          </Link>

          {/* ডেস্কটপ মেনু */}
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

          {/* বাটন */}
          <div className="hidden md:block">
            {phoneNumber ? (
                <Button asChild className="bg-transparent border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 rounded-full px-6 transition-all">
                  <a href={`tel:${phoneNumber}`} className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{phoneNumber}</span>
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

          {/* মোবাইল হ্যামবার্গার */}
          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
      </nav>

      {/* --- মোবাইল ড্রয়ার --- */}
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