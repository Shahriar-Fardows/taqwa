/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Save,
  Loader2,
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  DollarSign
} from "lucide-react"

// --- TYPES ---
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
  location: EventLocation
  price: number
  registrationLink: string
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
}

// --- INITIAL STATE ---
const initialFormState = {
  title: "",
  slug: "",
  description: "",
  image: "",
  startDate: "",
  endDate: "",
  location: { address: "", city: "", mapLink: "" },
  price: 0,
  registrationLink: "",
  status: "upcoming"
}

export default function EventAdmin() {
  // Data States
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  
  // View State
  const [view, setView] = useState<"list" | "form">("list")
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  // Form & Upload States
  const [formData, setFormData] = useState(initialFormState)
  const [uploading, setUploading] = useState(false)

  // --- 1. FETCH DATA ---
  const fetchEvents = async () => {
    try {
      setIsDataLoading(true)
      const res = await axios.get("/api/events")
      if (res.data.success) {
        setEvents(res.data.data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setIsDataLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // --- 2. IMAGE UPLOAD ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await axios.post("/api/upload/image", form)
      if (res.data.success) {
        setFormData(prev => ({ ...prev, image: res.data.url }))
      }
    } catch (error) {
      Swal.fire("Error", "Image upload failed", "error")
    } finally {
      setUploading(false)
    }
  }

  // --- 3. SLUG GENERATOR ---
  const handleSlugGen = (title: string) => {
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, title, slug }))
  }

  // --- 4. SUBMIT FORM ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.startDate || !formData.location.address) {
        Swal.fire("Required", "Title, Start Date and Address are required", "warning")
        return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        // Convert empty strings to null for optional fields if needed
        endDate: formData.endDate || null 
      }

      if (isEditing && editId) {
        // UPDATE
        const res = await axios.put("/api/event", { id: editId, ...payload })
        if (res.data.success) {
            Swal.fire("Updated!", "Event updated successfully.", "success")
            fetchEvents()
        }
      } else {
        // CREATE
        const res = await axios.post("/api/event", payload)
        if (res.data.success) {
            Swal.fire("Created!", "New event created.", "success")
            fetchEvents()
        }
      }
      
      // Reset
      setView("list")
      setIsEditing(false)
      setFormData(initialFormState)

    } catch (error: any) {
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error")
    } finally {
      setLoading(false)
    }
  }

  // --- 5. ACTIONS ---
  const handleEditClick = (item: EventItem) => {
    setFormData({
      title: item.title,
      slug: item.slug,
      description: item.description,
      image: item.image,
      startDate: item.startDate ? new Date(item.startDate).toISOString().slice(0, 16) : "",
      endDate: item.endDate ? new Date(item.endDate).toISOString().slice(0, 16) : "",
      location: {
        address: item.location?.address || "",
        city: item.location?.city || "",
        mapLink: item.location?.mapLink || ""
      },
      price: item.price,
      registrationLink: item.registrationLink,
      status: item.status
    })
    setEditId(item._id)
    setIsEditing(true)
    setView("form")
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await axios.delete("/api/event", { data: { id } })
        setEvents(prev => prev.filter(e => e._id !== id))
        Swal.fire('Deleted!', 'Event has been deleted.', 'success')
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete event.', 'error')
      }
    }
  }

  // ==========================
  // VIEW: FORM (CREATE/EDIT)
  // ==========================
  if (view === "form") {
    return (
      <div className=" mx-auto p-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => { setView("list"); setFormData(initialFormState); setIsEditing(false); }} className="gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to List
          </Button>
          <h2 className="text-2xl font-bold text-white">{isEditing ? "Edit Event" : "Create New Event"}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#0f172a] border-white/10">
              <CardContent className="p-6 space-y-5">
                
                {/* Title & Slug */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Event Title</Label>
                  <Input 
                    value={formData.title} 
                    onChange={(e) => handleSlugGen(e.target.value)} 
                    placeholder="e.g. Annual Islamic Conference 2025"
                    className="bg-[#1e293b] border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Slug</Label>
                  <Input 
                    value={formData.slug} 
                    onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                    className="bg-[#1e293b] border-white/10 text-gray-400"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-gray-300">Description</Label>
                  <Textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    placeholder="Event details..."
                    className="bg-[#1e293b] border-white/10 text-white h-32"
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-gray-300">Venue / Address</Label>
                        <Input 
                            value={formData.location.address} 
                            onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                            placeholder="Hall Name, Street"
                            className="bg-[#1e293b] border-white/10 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-300">City</Label>
                        <Input 
                            value={formData.location.city} 
                            onChange={(e) => setFormData({...formData, location: {...formData.location, city: e.target.value}})}
                            placeholder="Dhaka"
                            className="bg-[#1e293b] border-white/10 text-white"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-300">Google Map Link</Label>
                    <Input 
                        value={formData.location.mapLink} 
                        onChange={(e) => setFormData({...formData, location: {...formData.location, mapLink: e.target.value}})}
                        placeholder="https://maps.google.com/..."
                        className="bg-[#1e293b] border-white/10 text-white"
                    />
                </div>

              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Sidebar (Date, Image, Status) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Status & Date */}
            <Card className="bg-[#0f172a] border-white/10">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                    <Label className="text-gray-300">Status</Label>
                    <Select 
                        value={formData.status} 
                        onValueChange={(val: any) => setFormData({...formData, status: val})}
                    >
                        <SelectTrigger className="bg-[#1e293b] border-white/10 text-white">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e293b] text-white border-white/10">
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="text-gray-300">Start Date & Time</Label>
                    <Input 
                        type="datetime-local"
                        value={formData.startDate} 
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                        className="bg-[#1e293b] border-white/10 text-white"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label className="text-gray-300">End Date & Time</Label>
                    <Input 
                        type="datetime-local"
                        value={formData.endDate} 
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                        className="bg-[#1e293b] border-white/10 text-white"
                    />
                </div>
              </CardContent>
            </Card>

            {/* Event Banner */}
            <Card className="bg-[#0f172a] border-white/10">
              <CardContent className="p-6">
                <Label className="text-gray-300 mb-2 block">Event Banner</Label>
                <div className="relative group w-full h-40 bg-[#1e293b] rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                  {formData.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.image} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <span className="text-xs">Upload Banner</span>
                    </div>
                  )}
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-medium">
                    <Upload className="h-6 w-6 mb-1" /> Change Image
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={uploading} />
                  </label>
                  {uploading && <div className="absolute inset-0 bg-black/70 flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500"/></div>}
                </div>
              </CardContent>
            </Card>

            {/* Ticket Info */}
            <Card className="bg-[#0f172a] border-white/10">
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-gray-300">Ticket Price (BDT)</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input 
                                type="number"
                                value={formData.price} 
                                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} 
                                className="bg-[#1e293b] border-white/10 text-white pl-9"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-300">Registration Link</Label>
                        <Input 
                            value={formData.registrationLink} 
                            onChange={(e) => setFormData({...formData, registrationLink: e.target.value})} 
                            placeholder="https://..."
                            className="bg-[#1e293b] border-white/10 text-white"
                        />
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleSubmit} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                {isEditing ? "Update Event" : "Publish Event"}
            </Button>

          </div>
        </div>
      </div>
    )
  }

  // ==========================
  // VIEW: LIST
  // ==========================
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 min-h-screen bg-[#020817]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Events Manager</h1>
          <p className="text-gray-400 mt-1">Manage your upcoming lectures and programs.</p>
        </div>
        <Button 
          onClick={() => { setView("form"); setFormData(initialFormState); setIsEditing(false); }} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      {isDataLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-[#0f172a] rounded-xl border border-white/5">
          <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No events found.</p>
          <Button variant="outline" onClick={() => setView("form")}>Create First Event</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event._id} className="bg-[#0f172a] border border-white/10 overflow-hidden group hover:border-emerald-500/50 transition-all">
                <div className="h-48 overflow-hidden relative bg-gray-800">
                    {event.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-600"><ImageIcon className="h-10 w-10"/></div>
                    )}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs text-white uppercase font-bold border border-white/10">
                        {event.status}
                    </div>
                </div>
                
                <CardContent className="p-5 space-y-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
                        <div className="flex items-center text-emerald-400 text-sm font-medium mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(event.startDate).toLocaleDateString()} at {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                        <div className="flex items-center text-gray-400 text-xs">
                            <MapPin className="h-3 w-3 mr-2" />
                            {event.location.address}, {event.location.city}
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                        <span className="text-white font-bold">{event.price === 0 ? "Free" : `৳${event.price}`}</span>
                        <div className="flex gap-2">
                            {event.registrationLink && (
                                <a href={event.registrationLink} target="_blank" rel="noreferrer" className="p-2 bg-white/5 hover:bg-emerald-500 hover:text-white rounded-md transition-colors">
                                    <LinkIcon className="h-4 w-4" />
                                </a>
                            )}
                            <Button size="icon" variant="ghost" onClick={() => handleEditClick(event)} className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDelete(event._id)} className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}