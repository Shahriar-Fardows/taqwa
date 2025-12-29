"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Calendar, 
  Clock, 
//   MapPin, 
  ArrowRight, 
  X, 
  Ticket,
  Map as MapIcon
} from "lucide-react"

// --- Interface (Based on NEW JSON) ---
interface EventLocation {
  address: string
  city: string
  mapLink: string
}

interface EventItem {
  _id: string
  title: string
  slug: string
  description: string
  image: string
  startDate: string
  endDate: string
  price: number
  currency: string
  registrationLink: string
  organizer: string
  status: string
  location: EventLocation
  createdAt: string
}

interface ApiResponse {
  success: boolean
  count: number
  data: EventItem[]
}

export default function EventSection() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)

  // --- Fetch Data ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get<ApiResponse>("/api/events")
        if (res.data.success) {
          // তারিখ অনুযায়ী সর্ট করা (আসন্ন ইভেন্ট আগে)
          const sortedData = res.data.data.sort((a, b) => 
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
          setEvents(sortedData)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // --- Date Formatter ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  if (loading) return null;
  if (events.length === 0) return null;

  // প্রথম ইভেন্টটি Featured (বড় করে দেখাবে)
  const upcomingEvent = events[0]; 
  // বাকি ইভেন্টগুলো নিচে গ্রিডে দেখাবে
  const otherEvents = events.slice(1); 

  return (
    <section className="py-20 bg-[#020617] relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            আসন্ন <span className="text-emerald-500">ইভেন্ট</span> ও কর্মশালা
          </h2>
          <p className="text-gray-400">আমাদের পরবর্তী কার্যক্রম এবং টেকনোলজি ইভেন্টসমূহ</p>
        </div>

        {/* --- 1. FEATURED / UPCOMING EVENT (Big Card) --- */}
        {upcomingEvent && (
          <div className="mb-20">
             <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Next Big Event</span>
             </div>

             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-[#1e293b] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
             >
                {/* Image Side */}
                <div 
                   className="relative h-[300px] lg:h-[500px] w-full bg-black cursor-pointer group overflow-hidden"
                   onClick={() => setSelectedEvent(upcomingEvent)}
                >
                   {upcomingEvent.image ? (
                     <Image 
                       src={upcomingEvent.image} 
                       alt={upcomingEvent.title} 
                       fill 
                       className="object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                   ) : (
                     <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">No Image</div>
                   )}
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                </div>

                {/* Details Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                   
                   {/* Date & Location Badges */}
                   <div className="flex flex-wrap gap-3 mb-6">
                      <span className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-emerald-500/20">
                         <Calendar className="w-4 h-4" />
                         {formatDate(upcomingEvent.startDate)}
                      </span>
                      <span className="flex items-center gap-2 bg-white/5 text-gray-300 px-3 py-1.5 rounded-lg text-sm border border-white/10">
                         <MapPin className="w-4 h-4" />
                         {upcomingEvent.location.city}
                      </span>
                   </div>

                   <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                      {upcomingEvent.title}
                   </h3>
                   
                   <p className="text-gray-400 leading-relaxed mb-8 text-lg line-clamp-3">
                      {upcomingEvent.description}
                   </p>

                   {/* Price & Buttons */}
                   <div className="mt-auto">
                      <div className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                        <Ticket className="w-5 h-5 text-emerald-500" />
                        {upcomingEvent.price === 0 ? "Free Entry" : `${upcomingEvent.price} ${upcomingEvent.currency}`}
                      </div>

                      <div className="flex flex-wrap gap-4">
                          <button 
                            onClick={() => setSelectedEvent(upcomingEvent)}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                          >
                             বিস্তারিত দেখুন <ArrowRight className="w-5 h-5" />
                          </button>
                          
                          {upcomingEvent.registrationLink && (
                             <Link 
                                href={upcomingEvent.registrationLink}
                                target="_blank"
                                className="px-8 py-3 bg-transparent border border-white/20 hover:bg-white/5 text-white font-bold rounded-lg transition-all"
                             >
                                রেজিস্ট্রেশন
                             </Link>
                          )}
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}

        {/* --- 2. OTHER EVENTS (Grid) --- */}
        {otherEvents.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-emerald-500 pl-4">
               অন্যান্য ইভেন্টসমূহ
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {otherEvents.map((item, index) => (
                  <motion.div
                     key={item._id}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: index * 0.1 }}
                     onClick={() => setSelectedEvent(item)}
                     className="group bg-[#1e293b] rounded-xl overflow-hidden border border-white/10 hover:border-emerald-500/50 cursor-pointer transition-all hover:shadow-xl flex flex-col"
                  >
                     <div className="relative h-56 w-full bg-black overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gray-800" />
                        )}
                        
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded text-xs font-bold text-white uppercase border border-white/10 flex items-center gap-2">
                           <Calendar className="w-3 h-3 text-emerald-500" />
                           {formatDate(item.startDate)}
                        </div>
                     </div>
                     
                     <div className="p-6 flex flex-col flex-grow">
                        <h4 className="text-white font-bold text-xl mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                           {item.title}
                        </h4>
                        
                        <div className="space-y-2 mb-4 text-sm text-gray-400">
                           <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-emerald-500" />
                              {formatTime(item.startDate)} - {formatTime(item.endDate)}
                           </div>
                           <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-emerald-500" />
                              {item.location.city}
                           </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                           <span className="text-white font-bold">
                              {item.price === 0 ? "Free" : `${item.price} ${item.currency}`}
                           </span>
                           <span className="text-emerald-500 text-sm font-semibold group-hover:underline">
                              বিস্তারিত
                           </span>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
          </div>
        )}

      </div>

      {/* --- MODAL POPUP --- */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setSelectedEvent(null)}
               className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-4xl bg-[#0f172a] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
               <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors">
                  <X className="w-5 h-5" />
               </button>

               {/* Banner Image */}
               <div className="relative w-full h-64 md:h-80 bg-black">
                  {selectedEvent.image && (
                     <Image src={selectedEvent.image} alt={selectedEvent.title} fill className="object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 md:left-8">
                     <span className="bg-emerald-600 text-white px-3 py-1 rounded text-sm font-bold mb-2 inline-block">
                        {selectedEvent.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
                     </span>
                     <h2 className="text-2xl md:text-4xl font-bold text-white">{selectedEvent.title}</h2>
                  </div>
               </div>

               <div className="p-6 md:p-8">
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="bg-[#1e293b] p-4 rounded-xl border border-white/5">
                          <h4 className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                             <Calendar className="w-4 h-4 text-emerald-500" /> তারিখ ও সময়
                          </h4>
                          <p className="text-white font-medium">
                             {formatDate(selectedEvent.startDate)} | {formatTime(selectedEvent.startDate)}
                          </p>
                      </div>
                      <div className="bg-[#1e293b] p-4 rounded-xl border border-white/5">
                          <h4 className="text-gray-400 text-sm mb-1 flex items-center gap-2">
                             <MapPin className="w-4 h-4 text-emerald-500" /> লোকেশন
                          </h4>
                          <p className="text-white font-medium">
                             {selectedEvent.location.address}, {selectedEvent.location.city}
                          </p>
                      </div>
                  </div>

                  <div className="prose prose-invert max-w-none mb-8">
                      <h3 className="text-xl font-bold text-white mb-3">বিস্তারিত বিবরণ</h3>
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {selectedEvent.description}
                      </p>
                  </div>

                  {/* Modal Footer Actions */}
                  <div className="flex flex-wrap gap-4 border-t border-white/10 pt-6">
                      {selectedEvent.registrationLink && (
                        <Link 
                           href={selectedEvent.registrationLink}
                           target="_blank"
                           className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
                        >
                           রেজিস্ট্রেশন করুন
                        </Link>
                      )}
                      
                      {selectedEvent.location.mapLink && (
                        <Link 
                           href={selectedEvent.location.mapLink}
                           target="_blank"
                           className="flex items-center justify-center gap-2 bg-[#1e293b] hover:bg-[#334155] text-white font-bold py-3 px-6 rounded-lg border border-white/10 transition-all"
                        >
                           <MapIcon className="w-4 h-4" /> ম্যাপ দেখুন
                        </Link>
                      )}
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}