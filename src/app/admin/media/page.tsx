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
  Save
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
  createdAt: string
}

// --- INITIAL STATE ---
const initialFormState = {
  title: "",
  description: "",
  category: "General",
  url: "", 
  type: "image" as "image" | "video"
}

export default function MediaGallery() {
  // Data States
  const [mediaList, setMediaList] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  
  // View State (List vs Form)
  const [view, setView] = useState<"list" | "form">("list")
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  // Form & Upload States
  const [formData, setFormData] = useState(initialFormState)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  
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

  // --- 2. UPLOAD WITH PROGRESS ---
  const uploadFileWithProgress = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const form = new FormData()
      form.append("file", file)

      const res = await axios.post("/api/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
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
    } finally {
      setIsUploading(false)
    }
  }

  // --- 3. HANDLERS ---
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validation
      if (formData.type === 'image' && !file.type.startsWith('image/')) {
        Swal.fire("Error", "Please select an image file", "error")
        return
      }
      if (formData.type === 'video' && !file.type.startsWith('video/')) {
        Swal.fire("Error", "Please select a video file", "error")
        return
      }

      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleEditClick = (item: MediaItem) => {
    setIsEditing(true)
    setEditId(item._id)
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      url: item.url,
      type: item.type
    })
    setPreviewUrl(item.type === 'image' ? item.url : (item.thumbnail || ""))
    setSelectedFile(null)
    setView("form")
  }

  const handleCreateClick = () => {
    setIsEditing(false)
    setEditId(null)
    setFormData(initialFormState)
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadProgress(0)
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
    let finalUrl = formData.url
    let finalThumbnail = ""

    try {
      // A. File Upload Logic (Cloudinary)
      if (selectedFile) {
        const uploadedUrl = await uploadFileWithProgress(selectedFile)
        if (!uploadedUrl) throw new Error("File upload failed")
        finalUrl = uploadedUrl
      } 
      // B. Validation if no file and new entry
      else if (formData.type === "image" && !isEditing && !formData.url) {
         throw new Error("Please select an image")
      }
      
      // C. YouTube Thumbnail Logic
      if (formData.type === "video" && !selectedFile && formData.url.includes("youtube")) {
        const videoId = getYoutubeId(formData.url)
        if (videoId) {
            finalUrl = formData.url
            finalThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }
      }

      const payload = { ...formData, url: finalUrl, thumbnail: finalThumbnail }

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
      <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => setView("list")} className="gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Gallery
          </Button>
          <h2 className="text-2xl font-bold text-white">{isEditing ? "Edit Media" : "Add New Media"}</h2>
        </div>

        <Tabs 
            defaultValue={formData.type} 
            onValueChange={(val) => {
                setFormData({...formData, type: val as "image" | "video"});
                setSelectedFile(null);
                setPreviewUrl(null);
                setUploadProgress(0);
            }} 
            className="w-full"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT: Preview & Upload Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-[#0f172a] border-white/10">
                        <CardHeader>
                            {!isEditing && (
                                <TabsList className="grid w-full grid-cols-2 bg-[#1e293b]">
                                    <TabsTrigger value="image">Image</TabsTrigger>
                                    <TabsTrigger value="video">Video</TabsTrigger>
                                </TabsList>
                            )}
                        </CardHeader>
                        <CardContent className="p-6">
                            {/* Upload Box */}
                            <div className="relative group w-full h-[400px] bg-[#1e293b] rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden hover:border-emerald-500/50 transition-colors">
                                
                                {previewUrl ? (
                                    formData.type === 'video' ? (
                                        <video src={previewUrl} className="w-full h-full object-contain" controls />
                                    ) : (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                                    )
                                ) : (
                                    <div className="text-center text-gray-500 p-4">
                                        {formData.type === 'video' ? <FileVideo className="h-16 w-16 mx-auto mb-4 opacity-50"/> : <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50"/>}
                                        <span className="text-lg font-medium block">Click to upload {formData.type}</span>
                                        <span className="text-xs text-gray-600 mt-2 block">MP4, JPG, PNG supported</span>
                                    </div>
                                )}

                                {/* Progress Overlay */}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-12 z-20">
                                        <span className="text-emerald-500 font-bold text-4xl mb-4">{uploadProgress}%</span>
                                        <Progress value={uploadProgress} className="h-3 w-full max-w-md" />
                                        <span className="text-white/60 text-sm mt-3 animate-pulse">Uploading to Server...</span>
                                    </div>
                                )}

                                {/* File Input */}
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                    accept={formData.type === 'video' ? "video/*" : "image/*"} 
                                    onChange={handleFileChange} 
                                    disabled={isUploading}
                                />
                                
                                {/* Clear Button */}
                                {selectedFile && !isUploading && (
                                    <button 
                                        onClick={(e) => { e.preventDefault(); setSelectedFile(null); setPreviewUrl(null); }}
                                        className="absolute top-4 right-4 bg-red-500/80 text-white p-2 rounded-full z-30 hover:bg-red-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            {/* YouTube URL Option (Video Tab Only) */}
                            <TabsContent value="video" className="mt-6">
                                {!selectedFile && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-gray-300">Or use YouTube Link</Label>
                                            <span className="text-xs text-gray-500">Disabled if file selected</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Input 
                                                placeholder="https://www.youtube.com/watch?v=..." 
                                                value={formData.url.includes("youtube") ? formData.url : ""}
                                                onChange={(e) => {
                                                    setFormData({...formData, url: e.target.value});
                                                    // Auto preview thumbnail
                                                    const id = getYoutubeId(e.target.value);
                                                    if(id) setPreviewUrl(`https://img.youtube.com/vi/${id}/hqdefault.jpg`);
                                                }}
                                                className="bg-[#1e293b] border-white/10 text-white"
                                            />
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT: Details Form */}
                <div className="space-y-6">
                    <Card className="bg-[#0f172a] border-white/10 h-full">
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
                                    placeholder="e.g. Work, Life, Project"
                                    className="bg-[#1e293b] border-white/10 text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-300">Description</Label>
                                <Textarea 
                                    value={formData.description} 
                                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                    placeholder="Write a short description..."
                                    className="bg-[#1e293b] border-white/10 text-white h-32"
                                />
                            </div>

                            <Button 
                                onClick={handleSubmit} 
                                disabled={loading || isUploading} 
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 mt-4 text-lg"
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
          <p className="text-gray-400 mt-1">Manage images, videos (Upload or YouTube).</p>
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
          <p className="text-gray-400 mb-4">No media found.</p>
          <Button variant="outline" onClick={handleCreateClick}>Get Started</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaList.map((item) => (
            <Card key={item._id} className="group bg-[#0f172a] border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-300">
              <div className="relative aspect-video bg-black/40 overflow-hidden">
                
                {/* Display Logic */}
                {item.type === 'video' ? (
                    item.url.includes("youtube") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                        <video src={item.url} className="w-full h-full object-cover" muted />
                    )
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                )}
                
                {/* Icons */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all">
                    <PlayCircle className="h-12 w-12 text-white/80 group-hover:text-emerald-400 drop-shadow-lg" />
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                   <Button size="icon" variant="secondary" onClick={() => handleEditClick(item)}>
                      <Edit className="h-4 w-4" />
                   </Button>
                   <Button size="icon" variant="destructive" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="h-4 w-4" />
                   </Button>
                   <a href={item.url} target="_blank" rel="noreferrer">
                     <Button size="icon" variant="outline" className="border-white/20 text-white hover:bg-white/20">
                        <ExternalLink className="h-4 w-4" />
                     </Button>
                   </a>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                   <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500">{item.category}</span>
                   {item.type === 'video' ? <Video className="h-3 w-3 text-gray-500"/> : <ImageIcon className="h-3 w-3 text-gray-500"/>}
                </div>
                <h3 className="font-semibold text-white truncate" title={item.title}>{item.title || "Untitled"}</h3>
                <p className="text-xs text-gray-400 truncate">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}