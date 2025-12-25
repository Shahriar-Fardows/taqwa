"use client"

import React, { useEffect, useState, use } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, Upload, Loader2, CheckCircle, Image as ImageIcon } from "lucide-react"

export default function ClientReviewPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use() for Next.js 15+
  const resolvedParams = use(params)
  const inviteId = resolvedParams.id

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isValidLink, setIsValidLink] = useState(true)
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    review: "",
    rating: 0,
    image: ""
  })

  // --- FETCH INVITE INFO ---
  useEffect(() => {
    const checkInvite = async () => {
        try {
            // ইনভাইট আইডি দিয়ে নাম এবং ডেজিগনেশন নিয়ে আসা হচ্ছে
            const res = await axios.get(`/api/review/invite?id=${inviteId}`)
            if (res.data.success) {
                const { clientName, designation, status } = res.data.data
                
                // যদি অলরেডি রিভিউ দিয়ে থাকে
                if (status === 'completed') {
                    setSubmitted(true)
                    return
                }

                setFormData(prev => ({
                    ...prev,
                    name: clientName,
                    designation: designation || ""
                }))
            }
        } catch (error) {
            setIsValidLink(false)
        } finally {
            setLoading(false)
        }
    }
    checkInvite()
  }, [inviteId])

  // --- IMAGE UPLOAD ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await axios.post("/api/upload/image", form)
      if (res.data.success) setFormData(prev => ({ ...prev, image: res.data.url }))
    } catch {
      Swal.fire("Error", "Upload failed", "error")
    } finally {
      setUploading(false)
    }
  }

  // --- SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.rating === 0) return Swal.fire("Rating Required", "Please give a star rating.", "warning")

    setSubmitting(true)
    try {
      // 1. Save Review
      const res = await axios.post("/api/review", formData)
      
      if (res.data.success) {
        // 2. Mark Invite as Completed (Optional Logic via another API call or handled in backend)
        // আমরা এখানে শুধু সাকসেস মেসেজ দেখাচ্ছি
        setSubmitted(true)
        Swal.fire({ icon: 'success', title: 'Thank You!', text: 'Review submitted.', confirmButtonColor: '#10b981' })
      }
    } catch {
      Swal.fire("Error", "Failed to submit.", "error")
    } finally {
      setSubmitting(false)
    }
  }

  // --- RENDER STATES ---

  if (loading) return <div className="min-h-screen bg-[#020817] flex items-center justify-center"><Loader2 className="h-10 w-10 text-emerald-500 animate-spin"/></div>

  if (!isValidLink) return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center text-white">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500">Invalid Link</h2>
            <p className="text-gray-400">This link may have expired or does not exist.</p>
        </div>
    </div>
  )

  if (submitted) {
    return (
        <div className="min-h-screen bg-[#020817] flex items-center justify-center p-6">
            <Card className="max-w-md w-full bg-[#0f172a] border-emerald-500/30 text-center py-10 animate-in zoom-in">
                <CardContent>
                    <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Thank You, {formData.name}!</h2>
                    <p className="text-gray-400">We appreciate your feedback.</p>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4 md:p-8">
      <Card className="max-w-xl w-full bg-[#0f172a] border-white/10 shadow-2xl">
        <CardHeader className="text-center border-b border-white/5 pb-8">
          <CardTitle className="text-3xl font-bold text-white">Hi, {formData.name}</CardTitle>
          <CardDescription className="text-gray-400 mt-2">How was your experience working with us?</CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stars */}
            <div className="flex flex-col items-center gap-3 mb-6">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setFormData({...formData, rating: star})} className="transition-transform hover:scale-110">
                            <Star className={`h-10 w-10 ${star <= formData.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-700"}`} />
                        </button>
                    ))}
                </div>
                <span className="text-sm text-emerald-500 font-medium">{formData.rating > 0 ? "Thanks for rating!" : "Tap a star to rate"}</span>
            </div>

            {/* Photo */}
            <div className="flex justify-center">
                <div className="relative group h-24 w-24 rounded-full overflow-hidden border-2 border-dashed border-white/20 bg-[#1e293b] cursor-pointer">
                    {formData.image ? <img src={formData.image} className="h-full w-full object-cover" /> : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500"><ImageIcon className="h-6 w-6"/><span className="text-[9px]">Photo</span></div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading}/>
                    {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-white"/></div>}
                </div>
            </div>

            {/* Inputs (Read Only Name) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-gray-300">Name</Label>
                    <Input value={formData.name} disabled className="bg-[#1e293b] border-white/10 text-gray-400 cursor-not-allowed font-semibold" />
                </div>
                <div className="space-y-2">
                    <Label className="text-gray-300">Designation</Label>
                    <Input value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} className="bg-[#1e293b] border-white/10 text-white" />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-gray-300">Feedback</Label>
                <Textarea value={formData.review} onChange={(e) => setFormData({...formData, review: e.target.value})} className="bg-[#1e293b] border-white/10 text-white h-32" placeholder="Write your review here..." required />
            </div>

            <Button type="submit" disabled={submitting || uploading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg">
                {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Submit Review"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}