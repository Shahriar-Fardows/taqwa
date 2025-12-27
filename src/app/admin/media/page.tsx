/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  Loader2,
  PlayCircle,
  ExternalLink,
  Edit,
  Upload,
  FileVideo,
  X,
  ArrowLeft,
  Save,
  Youtube,
  MonitorPlay
} from "lucide-react"

// --- TYPES ---
interface MediaItem {
  _id: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  title: string
  description: string
  category: string
  source?: "youtube" | "local" // নতুন ফিল্ড সোর্স চেনার জন্য
  createdAt: string
}

// --- INITIAL STATE ---
const initialFormState = {
  title: "",
  description: "",
  category: "General",
  url: "", 
  type: "image" as "image" | "video",
  source: "local" as "youtube" | "local"
}

export default function MediaGallery() {
  // Data States
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  
  // View State
  const [view, setView] = useState<"list" | "form">("list")
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  // Form States
  const [formData, setFormData] = useState(initialFormState)
  const [activeTab, setActiveTab] = useState("image") // image | video | youtube

  // File States (Main File)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Thumbnail States (New Feature)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  
  // Progress State
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // --- 1. FETCH DATA ---
  const fetchMedia = async () => {
    try {
      setIsDataLoading(true)
      const res = await axios.get("/api/media")
      if (res.data.success) {
        setMediaList(res.data.data)
      }
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setIsDataLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  // --- 2. UPLOAD HELPER ---
  const uploadFileWithProgress = async (file: File): Promise<string | null> => {
    try {
      const form = new FormData()
      form.append("file", file)

      const res = await axios.post("/api/upload/image", form, { // আপনার আপলোড API রুট অনুযায়ী
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if(!isUploading) return // Only track main file progress visually for now
          const total = progressEvent.total || 1;
          const percent = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percent);
        }
      })

      if (res.data.success) return res.data.url
      return null
    } catch (error) {
      console.error("Upload error:", error)
      return null
    }
  }

  // --- 3. HANDLERS ---
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }
  
  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === 'image' && !file.type.startsWith('image/')) {
        Swal.fire("Error", "Please select an image file", "error")
        return
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        Swal.fire("Error", "Please select a video file", "error")
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        Swal.fire("Error", "Thumbnail must be an image", "error")
        return
      }
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleTabChange = (val: string) => {
    setActiveTab(val)
    // Reset specific states when switching tabs
    setSelectedFile(null)
    setPreviewUrl(null)
    setThumbnailFile(null)
    setThumbnailPreview(null)
    setUploadProgress(0)

    // Set default types based on tab
    if (val === 'image') {
        setFormData({ ...formData, type: 'image', source: 'local', url: '' })
    } else if (val === 'video') {
        setFormData({ ...formData, type: 'video', source: 'local', url: '' })
    } else if (val === 'youtube') {
        setFormData({ ...formData, type: 'video', source: 'youtube', url: '' })
    }
  }

  const handleEditClick = (item: MediaItem) => {
    setIsEditing(true)
    setEditId(item._id)
    
    // Determine tab
    let tab = 'image'
    if (item.type === 'video') {
        tab = item.source === 'youtube' || item.url.includes('youtube') ? 'youtube' : 'video'
    }
    setActiveTab(tab)

    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      url: item.url,
      type: item.type,
      source: item.source || (item.url.includes('youtube') ? 'youtube' : 'local')
    })
    
    setPreviewUrl(item.type === 'image' ? item.url : null) 
    setThumbnailPreview(item.thumbnail || null)
    setSelectedFile(null)
    setThumbnailFile(null)
    setView("form")
  }

  const handleCreateClick = () => {
    setIsEditing(false)
    setEditId(null)
    setFormData(initialFormState)
    handleTabChange('image') // Default tab
    setView("form")
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Media?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await axios.delete("/api/media", { data: { id } })
        setMediaList(prev => prev.filter(m => m._id !== id))
        Swal.fire('Deleted!', 'Media has been deleted.', 'success')
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete media.', 'error')
      }
    }
  }

  // --- 4. SUBMIT FORM ---
  const handleSubmit = async () => {
    if (!formData.title) {
        Swal.fire("Required", "Please add a title", "warning");
        return;
    }

    setLoading(true)
    setIsUploading(true)
    
    let finalUrl = formData.url
    let finalThumbnail = thumbnailPreview || "" // Use existing/preview if no new file

    try {
      // 1. Upload Main File (Image or Video)
      if (activeTab !== 'youtube' && selectedFile) {
        const uploadedUrl = await uploadFileWithProgress(selectedFile)
        if (!uploadedUrl) throw new Error("Main file upload failed")
        finalUrl = uploadedUrl
      } else if (activeTab === 'image' && !isEditing && !selectedFile) {
         throw new Error("Please upload an image")
      } else if (activeTab === 'video' && !isEditing && !selectedFile) {
         throw new Error("Please upload a video")
      } else if (activeTab === 'youtube' && !formData.url) {
         throw new Error("Please enter a YouTube URL")
      }

      // 2. Upload Custom Thumbnail (Optional)
      if (thumbnailFile) {
         const thumbUrl = await uploadFileWithProgress(thumbnailFile)
         if (thumbUrl) finalThumbnail = thumbUrl
      }

      // 3. YouTube Auto Thumbnail Logic (Only if no custom thumbnail provided)
      if (activeTab === 'youtube' && !finalThumbnail) {
        const videoId = getYoutubeId(formData.url)
        if (videoId) {
            finalThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }
      }

      const payload = { 
          ...formData, 
          url: finalUrl, 
          thumbnail: finalThumbnail,
          source: activeTab === 'youtube' ? 'youtube' : 'local'
      }

      if (isEditing && editId) {
        const res = await axios.put("/api/media", { id: editId, ...payload })
        if (res.data.success) {
           setMediaList(prev => prev.map(m => m._id === editId ? res.data.data : m))
           Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false })
        }
      } else {
        const res = await axios.post("/api/media", payload)
        if (res.data.success) {
           setMediaList(prev => [res.data.data, ...prev])
           Swal.fire({ icon: 'success', title: 'Added!', timer: 1500, showConfirmButton: false })
        }
      }

      // Reset
      setView("list")
      setIsEditing(false)

    } catch (error: any) {
      Swal.fire("Error", error.message || "Something went wrong", "error")
    } finally {
      setLoading(false)
      setIsUploading(false)
    }
  }

  // ============================================
  // VIEW: FORM (CREATE / EDIT)
  // ============================================
  if (view === "form") {
    return (
      <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => setView("list")} className="gap-2 text-gray-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4" /> Back to Gallery
          </Button>
          <h2 className="text-2xl font-bold text-white">{isEditing ? "Edit Media" : "Add New Media"}</h2>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: Upload Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-[#0f172a] !pt-0 border-white/10 overflow-hidden">
                        <CardHeader className="bg-[#1e293b]/50 border-b border-white/5 pb-0">
                             <TabsList className="grid w-full grid-cols-3 bg-transparent h-12 p-0">
                                <TabsTrigger value="image" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-10 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-500 transition-all">
                                    <ImageIcon className="w-4 h-4 mr-2"/> Image
                                </TabsTrigger>
                                <TabsTrigger value="video" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white h-10 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald-500 transition-all">
                                    <Upload className="w-4 h-4 mr-2"/> Upload Video
                                </TabsTrigger>
                                <TabsTrigger value="youtube" className="data-[state=active]:bg-red-600 data-[state=active]:text-white h-10 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-red-600 transition-all">
                                    <Youtube className="w-4 h-4 mr-2"/> YouTube
                                </TabsTrigger>
                            </TabsList>
                        </CardHeader>
                        
                        <CardContent className="p-6 space-y-6">
                            
                            {/* --- TAB: IMAGE --- */}
                            <TabsContent value="image" className="mt-0 space-y-4">
                                <div className="relative group w-full h-[400px] bg-[#1e293b] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden hover:border-emerald-500/50 transition-colors">
                                    {previewUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-center text-gray-500">
                                            <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50"/>
                                            <span className="text-lg font-medium block">Click to Upload Image</span>
                                            <span className="text-xs text-gray-600">JPG, PNG, WEBP</span>
                                        </div>
                                    )}
                                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" onChange={(e) => handleMainFileChange(e, 'image')} disabled={isUploading}/>
                                    
                                    {/* Progress */}
                                    {isUploading && uploadProgress > 0 && activeTab === 'image' && (
                                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-12 z-20">
                                            <span className="text-emerald-500 font-bold text-4xl mb-4">{uploadProgress}%</span>
                                            <Progress value={uploadProgress} className="h-2 w-full max-w-sm" />
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* --- TAB: VIDEO UPLOAD --- */}
                            <TabsContent value="video" className="mt-0 space-y-6">
                                {/* Video Upload Box */}
                                <div className="space-y-2">
                                    <Label className="text-white">Main Video File</Label>
                                    <div className="relative group w-full h-[300px] bg-[#1e293b] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden hover:border-emerald-500/50 transition-colors">
                                        {previewUrl ? (
                                            <video src={previewUrl} className="w-full h-full object-contain" controls />
                                        ) : (
                                            <div className="text-center text-gray-500">
                                                <FileVideo className="h-16 w-16 mx-auto mb-4 opacity-50"/>
                                                <span className="text-lg font-medium block">Click to Upload Video</span>
                                                <span className="text-xs text-gray-600">MP4, WEBM</span>
                                            </div>
                                        )}
                                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="video/*" onChange={(e) => handleMainFileChange(e, 'video')} disabled={isUploading}/>
                                        
                                        {isUploading && uploadProgress > 0 && activeTab === 'video' && (
                                            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-12 z-20">
                                                <span className="text-emerald-500 font-bold text-4xl mb-4">{uploadProgress}%</span>
                                                <Progress value={uploadProgress} className="h-2 w-full max-w-sm" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Custom Thumbnail for Uploaded Video */}
                                <div className="space-y-2">
                                    <Label className="text-white flex items-center justify-between">
                                        <span>Cover Image / Thumbnail</span>
                                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">Optional</span>
                                    </Label>
                                    <div className="flex gap-4 items-start">
                                        <div className="relative w-40 h-24 bg-[#1e293b] rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                                             {thumbnailPreview ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={thumbnailPreview} className="w-full h-full object-cover" alt="thumb" />
                                             ) : (
                                                <ImageIcon className="w-6 h-6 text-gray-600" />
                                             )}
                                             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleThumbnailChange} />
                                        </div>
                                        <div className="text-xs text-gray-500 pt-2">
                                            Upload a cover image for your video. <br/>
                                            If skipped, a default icon will be shown.
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* --- TAB: YOUTUBE --- */}
                            <TabsContent value="youtube" className="mt-0 space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-white">YouTube Video URL</Label>
                                    <Input 
                                        placeholder="https://www.youtube.com/watch?v=..." 
                                        value={formData.url.includes("youtube") || formData.url.includes("youtu.be") ? formData.url : ""}
                                        onChange={(e) => {
                                            setFormData({...formData, url: e.target.value});
                                            // Auto-preview thumbnail from youtube
                                            const id = getYoutubeId(e.target.value);
                                            if(id && !thumbnailFile) setThumbnailPreview(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
                                        }}
                                        className="bg-[#1e293b] border-white/10 text-white h-12"
                                    />
                                    {/* YouTube Preview Player */}
                                    {getYoutubeId(formData.url) && (
                                        <div className="mt-4 aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
                                            <iframe 
                                                width="100%" 
                                                height="100%" 
                                                src={`https://www.youtube.com/embed/${getYoutubeId(formData.url)}`} 
                                                frameBorder="0" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    )}
                                </div>

                                {/* Custom Thumbnail for YouTube (Override) */}
                                <div className="space-y-2 border-t border-white/5 pt-4">
                                    <Label className="text-white flex items-center justify-between">
                                        <span>Custom Thumbnail (Override)</span>
                                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded">Optional</span>
                                    </Label>
                                    <div className="flex gap-4 items-center">
                                        <div className="relative w-32 h-20 bg-[#1e293b] rounded-lg border border-white/10 flex items-center justify-center overflow-hidden hover:border-red-500/50 transition-colors">
                                             {thumbnailPreview ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={thumbnailPreview} className="w-full h-full object-cover" alt="thumb" />
                                             ) : (
                                                <ImageIcon className="w-6 h-6 text-gray-600" />
                                             )}
                                             <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleThumbnailChange} />
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            By default, we fetch the thumbnail from YouTube. <br/>
                                            Upload here to use a custom image instead.
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT: Details Form */}
                <div className="space-y-6">
                    <Card className="bg-[#0f172a]  border-white/10 h-full">
                        <CardHeader>
                            <CardTitle className="text-white">Media Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-gray-300">Title</Label>
                                <Input 
                                    value={formData.title} 
                                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                    placeholder="Enter title..."
                                    className="bg-[#1e293b] border-white/10 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-300">Category</Label>
                                <Input 
                                    value={formData.category} 
                                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                                    placeholder="e.g. Highlight, Sermon, Event"
                                    className="bg-[#1e293b] border-white/10 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-300">Description</Label>
                                <Textarea 
                                    value={formData.description} 
                                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                    placeholder="Write a short description..."
                                    className="bg-[#1e293b] border-white/10 text-white h-32 resize-none"
                                />
                            </div>

                            <Button 
                                onClick={handleSubmit} 
                                disabled={loading || isUploading} 
                                className={`w-full py-6 mt-4 text-lg ${activeTab === 'youtube' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-500 hover:bg-emerald-600'} text-white transition-colors`}
                            >
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                                {isEditing ? "Update Media" : "Save Media"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Tabs>
      </div>
    )
  }

  // ============================================
  // VIEW: LIST (GRID)
  // ============================================
  return (
    <div className="p-6 md:p-10 space-y-8 min-h-screen bg-[#020817] animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Media Gallery</h1>
          <p className="text-gray-400 mt-1">Manage your visual content library.</p>
        </div>
        <Button 
          onClick={handleCreateClick} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Media
        </Button>
      </div>

      {/* CONTENT */}
      {isDataLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        </div>
      ) : mediaList.length === 0 ? (
        <div className="text-center py-20 bg-[#0f172a] rounded-xl border border-white/5">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
             <ImageIcon className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-white text-lg font-medium mb-2">Gallery Empty</h3>
          <p className="text-gray-400 mb-6">No media items found. Add your first image or video.</p>
          <Button variant="outline" onClick={handleCreateClick} className="border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">Add Media</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaList.map((item) => {
             // Determine Badges
             const isYoutube = item.source === 'youtube' || item.url.includes("youtube") || item.url.includes("youtu.be");
             const isVideo = item.type === 'video';

             return (
                <Card key={item._id} className="group bg-[#0f172a] border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/10">
                <div className="relative aspect-video bg-black/40 overflow-hidden">
                    
                    {/* Media Thumbnail */}
                    {item.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        isVideo ? (
                            // If no thumbnail for local video, try to show video element
                            <video src={item.url} className="w-full h-full object-cover opacity-60" muted />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )
                    )}
                    
                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {isYoutube ? (
                             <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                                <Youtube className="w-3 h-3" /> YOUTUBE
                             </span>
                        ) : isVideo ? (
                             <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                                <Video className="w-3 h-3" /> VIDEO
                             </span>
                        ) : (
                             <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" /> IMAGE
                             </span>
                        )}
                    </div>

                    {/* Play Icon Overlay for Videos */}
                    {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                             <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                        </div>
                    </div>
                    )}

                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                        <Button size="icon" className="bg-white text-black hover:bg-gray-200 rounded-full" onClick={() => handleEditClick(item)} title="Edit">
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" className="bg-red-500 text-white hover:bg-red-600 rounded-full" onClick={() => handleDelete(item._id)} title="Delete">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <a href={item.url} target="_blank" rel="noreferrer">
                            <Button size="icon" variant="outline" className="border-white/20 text-white hover:bg-white/20 rounded-full" title="View">
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </a>
                    </div>
                </div>

                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {item.category || "General"}
                        </span>
                    </div>
                    <h3 className="font-semibold text-white truncate text-sm mb-1" title={item.title}>{item.title || "Untitled"}</h3>
                    <p className="text-xs text-gray-500 truncate">{item.description || "No description provided."}</p>
                </CardContent>
                </Card>
             )
          })}
        </div>
      )}
    </div>
  )
}