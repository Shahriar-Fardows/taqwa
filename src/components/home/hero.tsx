"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules"

// --- Swiper Styles ---
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-fade"

// --- Interface ---
interface Banner {
  _id: string
  title: string
  desktopImage: string
  mobileImage: string
  link: string
  isActive: boolean
  order: number
}

export default function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  // --- Fetch Banners ---
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("/api/banners")
        if (res.data.success) {
          // ১. শুধুমাত্র Active ব্যানার ফিল্টার করা
          // ২. Order অনুযায়ী সর্ট করা
          const activeBanners = res.data.data
            .filter((b: Banner) => b.isActive)
            .sort((a: Banner, b: Banner) => a.order - b.order)
          
          setBanners(activeBanners)
        }
      } catch (error) {
        console.error("Failed to load banners", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  if (loading) {
    return (
      <div className="w-full h-[300px] md:h-[500px] bg-[#0f172a] flex items-center justify-center border-b border-white/5">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (banners.length === 0) return null

  return (
    <section className="relative w-full bg-[#020617] border-b border-white/5 group">
      
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + ' !bg-emerald-500"></span>';
          },
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        className="w-full h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px]"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id} className="relative w-full h-full bg-[#0f172a]">
            {/* Link Wrapper Logic: 
              যদি লিংক থাকে তবে <a> ট্যাগ হবে, না থাকলে সাধারণ <div> 
            */}
            <Wrapper link={banner.link}>
              
              {/* --- DESKTOP IMAGE (Hidden on Mobile) --- */}
              <div className="hidden md:block relative w-full h-full">
                 <Image
                    src={banner.desktopImage}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                 />
              </div>

              {/* --- MOBILE IMAGE (Hidden on Desktop) --- */}
              <div className="block md:hidden relative w-full h-full">
                 <Image
                    src={banner.mobileImage}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                 />
              </div>

              {/* Gradient Overlay (Optional: For better text visibility or aesthetics) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/50 via-transparent to-transparent pointer-events-none"></div>
              
            </Wrapper>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- Custom Navigation Buttons (Visible on Hover) --- */}
      <div className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-emerald-500 transition-all opacity-0 group-hover:opacity-100 duration-300">
        <ChevronLeft className="w-6 h-6" />
      </div>
      <div className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-emerald-500 transition-all opacity-0 group-hover:opacity-100 duration-300">
        <ChevronRight className="w-6 h-6" />
      </div>

      {/* Custom Pagination CSS Override */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 4px;
          background: #10b981 !important; /* Emerald-500 */
        }
      `}</style>
    </section>
  )
}

// --- Helper Component: Link Wrapper ---
// যদি লিংক থাকে তবে Link কম্পোনেন্ট রেন্ডার করবে, না থাকলে div
const Wrapper = ({ link, children }: { link: string; children: React.ReactNode }) => {
  if (link && link.trim() !== "") {
    return (
      <Link href={link} className="block w-full h-full cursor-pointer relative">
        {children}
      </Link>
    )
  }
  return <div className="w-full h-full relative cursor-default">{children}</div>
}