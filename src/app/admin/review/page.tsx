"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Star,
  Trash2,
  Loader2,
  Quote,
  Copy,
  Link as LinkIcon,
  User,
  Plus
} from "lucide-react"

// --- TYPES ---
interface Review {
  _id: string
  name: string
  image: string
  designation: string
  rating: number
  review: string
  isActive: boolean
}

export default function ReviewAdmin() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  
  // Link Generation State
  const [inviteName, setInviteName] = useState("")
  const [inviteDesignation, setInviteDesignation] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [generating, setGenerating] = useState(false)

  // --- FETCH REVIEWS ---
  const fetchReviews = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/review")
      if (res.data.success) setReviews(res.data.data)
    } catch (error) {
      console.error("Error", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  // --- GENERATE LINK HANDLER ---
  const handleGenerateLink = async () => {
    if (!inviteName) return Swal.fire("Name Required", "Please enter client name", "warning")
    
    setGenerating(true)
    try {
        const res = await axios.post("/api/review/invite", {
            clientName: inviteName,
            designation: inviteDesignation
        })
        
        if (res.data.success) {
            const link = `${window.location.origin}/review/${res.data.data._id}`
            setGeneratedLink(link)
        }
    } catch (error) {
        Swal.fire("Error", "Could not generate link", "error")
    } finally {
        setGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
    Swal.fire({
        icon: 'success',
        title: 'Copied!',
        text: 'Link copied to clipboard.',
        timer: 1500,
        showConfirmButton: false
    })
  }

  // --- OTHER ACTIONS (Delete, Toggle) ---
  const handleDelete = async (id: string) => {
    // ... (Use previous delete logic)
    // Shortened for brevity
    await axios.delete("/api/review", { data: { id } })
    setReviews(prev => prev.filter(r => r._id !== id))
  }

  const toggleActive = async (review: Review) => {
     // ... (Use previous toggle logic)
     await axios.put("/api/review", { id: review._id, isActive: !review.isActive })
     fetchReviews()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-600"}`} />
    ))
  }

  return (
    <div className="p-6 md:p-10 space-y-8 min-h-screen bg-[#020817] animate-in fade-in duration-500">
      
      {/* HEADER CARD */}
      <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Client Reviews</h1>
          <p className="text-gray-400 mt-2">Manage testimonials & create invite links.</p>
        </div>
        
        {/* GENERATE LINK BUTTON (DIALOG) */}
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white h-12 px-6 text-lg shadow-lg shadow-emerald-500/20">
                    <LinkIcon className="mr-2 h-5 w-5" /> Generate Review Link
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Unique Link</DialogTitle>
                </DialogHeader>
                
                {!generatedLink ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Client Name</Label>
                            <Input 
                                value={inviteName} 
                                onChange={(e) => setInviteName(e.target.value)} 
                                placeholder="ex: John Doe" 
                                className="bg-[#1e293b] border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Designation (Optional)</Label>
                            <Input 
                                value={inviteDesignation} 
                                onChange={(e) => setInviteDesignation(e.target.value)} 
                                placeholder="ex: CEO of Tech" 
                                className="bg-[#1e293b] border-white/10"
                            />
                        </div>
                        <Button onClick={handleGenerateLink} disabled={generating} className="w-full bg-emerald-500 hover:bg-emerald-600 mt-2">
                            {generating ? <Loader2 className="animate-spin h-4 w-4"/> : "Generate Link"}
                        </Button>
                    </div>
                ) : (
                    <div className="py-6 text-center space-y-4">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg break-all text-xs text-emerald-400 font-mono">
                            {generatedLink}
                        </div>
                        <Button onClick={copyToClipboard} className="w-full bg-white text-black hover:bg-gray-200">
                            <Copy className="mr-2 h-4 w-4" /> Copy Link
                        </Button>
                        <Button variant="ghost" onClick={() => {setGeneratedLink(""); setInviteName("")}} className="text-gray-400 text-sm">
                            Create Another
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
      </div>

      {/* REVIEWS GRID */}
      {loading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((item) => (
            <Card key={item._id} className={`group bg-[#0f172a] border hover:border-emerald-500/30 transition-all ${item.isActive ? 'border-white/10' : 'border-red-900/30 opacity-70'}`}>
              <CardContent className="p-6 flex flex-col h-full">
                {/* User Info */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                        {item.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-6 w-6 text-gray-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base">{item.name}</h3>
                        <p className="text-xs text-emerald-500">{item.designation}</p>
                    </div>
                </div>
                {/* Rating & Review */}
                <div className="flex gap-1 mb-4">{renderStars(item.rating)}</div>
                <div className="flex-1">
                    <p className="text-gray-300 text-sm italic leading-relaxed line-clamp-4">{item.review}</p>
                </div>
                {/* Actions */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <Switch checked={item.isActive} onCheckedChange={() => toggleActive(item)} className="scale-75 data-[state=checked]:bg-emerald-500" />
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(item._id)} className="h-8 w-8 text-red-400 hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}