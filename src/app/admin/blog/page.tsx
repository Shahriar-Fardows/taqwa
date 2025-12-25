/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useState, useMemo } from "react"
import dynamic from "next/dynamic" // Dynamic import for SSR
import axios from "axios"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Save,
  Loader2,
  ArrowLeft,
  Upload
} from "lucide-react"

// --- CSS IMPORT FOR REACT QUILL NEW ---
import 'react-quill-new/dist/quill.snow.css';

// --- DYNAMIC IMPORT (SSR False) ---
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-40 bg-gray-100 animate-pulse rounded-md"></div>,
});

// --- TYPES ---
interface BlogPost {
  _id: string
  title: string
  slug: string
  subtitle: string
  content: string
  image: string
  category: string
  tags: string[]
  isPublished: boolean
  createdAt: string
}

// --- INITIAL STATE ---
const initialFormState = {
  title: "",
  slug: "",
  subtitle: "",
  content: "",
  image: "",
  category: "Tech",
  tags: "", 
  isPublished: true
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [view, setView] = useState<"list" | "form">("list")
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState(initialFormState)
  const [uploadingImage, setUploadingImage] = useState(false) 
  const [uploadingContentImage, setUploadingContentImage] = useState(false) 

  // --- QUILL MODULES (Toolbar Config) ---
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  }), [])

  // --- 1. FETCH POSTS ---
  const fetchPosts = async () => {
    try {
      setIsDataLoading(true)
      const res = await axios.get("/api/blogs") 
      if (res.data.success) {
        setPosts(res.data.data)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsDataLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // --- 2. IMAGE UPLOAD HELPER ---
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await axios.post("/api/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      if (res.data.success) return res.data.url
      return null
    } catch (error) {
      console.error("Upload error:", error)
      Swal.fire({ icon: "error", title: "Upload Failed", text: "Could not upload image." })
      return null
    }
  }

  // Handle Cover Image Upload
  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploadingImage(true)
    const url = await uploadImage(file)
    if (url) {
      setFormData(prev => ({ ...prev, image: url }))
    }
    setUploadingImage(false)
  }

  // Handle Content Image Upload (Insert into Editor)
  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingContentImage(true)
    const url = await uploadImage(file)
    if (url) {
      // HTML Image Tag Create
      const imageHtml = `<br><img src="${url}" alt="Blog Image" style="max-width: 100%; border-radius: 8px; margin: 10px 0;" /><br>`
      setFormData(prev => ({ ...prev, content: prev.content + imageHtml }))
      
      Swal.fire({
        icon: "success",
        title: "Image Added!",
        text: "Image has been appended to the editor content.",
        timer: 1500,
        showConfirmButton: false
      })
    }
    setUploadingContentImage(false)
  }

  // --- 3. FORM HANDLERS ---
  const handleSlugGen = (title: string) => {
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, title, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "")
    }

    try {
      if (isEditing && editId) {
        await axios.put("/api/blogs", { id: editId, ...payload })
        Swal.fire("Updated!", "Blog post updated successfully.", "success")
      } else {
        await axios.post("/api/blogs", payload)
        Swal.fire("Created!", "New blog post created.", "success")
      }
      
      setFormData(initialFormState)
      setIsEditing(false)
      setEditId(null)
      setView("list")
      fetchPosts()

    } catch (error: any) {
      console.error(error)
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (post: BlogPost) => {
    setFormData({
      title: post.title,
      slug: post.slug,
      subtitle: post.subtitle || "",
      content: post.content,
      image: post.image,
      category: post.category,
      tags: post.tags.join(", "),
      isPublished: post.isPublished
    })
    setEditId(post._id)
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
        await axios.delete("/api/blogs", { data: { id } })
        setPosts(posts.filter(p => p._id !== id))
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete post.', 'error')
      }
    }
  }

  // --- RENDER VIEW ---

  if (view === "form") {
    return (
      <div className=" mx-auto p-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => { setView("list"); setFormData(initialFormState); setIsEditing(false); }} className="gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to List
          </Button>
          <h2 className="text-2xl font-bold text-white">{isEditing ? "Edit Blog Post" : "Create New Post"}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#0f172a] border-white/10">
              <CardContent className="p-6 space-y-4">
                
                {/* Title & Slug */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Blog Title</Label>
                    <Input 
                      value={formData.title} 
                      onChange={(e) => handleSlugGen(e.target.value)} 
                      placeholder="Enter blog title..."
                      className="bg-[#1e293b] border-white/10 text-white mt-1.5"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Slug (URL)</Label>
                    <Input 
                      value={formData.slug} 
                      onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                      placeholder="how-to-learn-coding"
                      className="bg-[#1e293b] border-white/10 text-gray-400 mt-1.5"
                    />
                  </div>
                </div>

                {/* Subtitle */}
                <div>
                  <Label className="text-gray-300">Subtitle / Short Description</Label>
                  <Textarea 
                    value={formData.subtitle} 
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})} 
                    className="bg-[#1e293b] border-white/10 text-white mt-1.5 h-20"
                  />
                </div>

                {/* Content Editor (React Quill) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-gray-300">Main Content</Label>
                    
                    {/* Insert Image Feature */}
                    <div className="relative">
                        <input 
                          type="file" 
                          id="content-img" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleContentImageUpload}
                        />
                        <label htmlFor="content-img">
                          <Button 
                            asChild 
                            variant="outline" 
                            size="sm" 
                            className="text-xs gap-2 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-white cursor-pointer"
                            disabled={uploadingContentImage}
                          >
                            <span>
                              {uploadingContentImage ? <Loader2 className="h-3 w-3 animate-spin"/> : <ImageIcon className="h-3 w-3" />}
                              Insert Image
                            </span>
                          </Button>
                        </label>
                    </div>
                  </div>
                  
                  {/* Rich Text Editor */}
                  <div className="bg-white rounded-md text-black overflow-hidden border border-white/20">
                    <ReactQuill 
                      theme="snow"
                      value={formData.content} 
                      onChange={(value) => setFormData({ ...formData, content: value })} 
                      modules={modules}
                      className="h-[400px] mb-12" 
                    />
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    * Pro Tip: Upload an image using the button, and it will be inserted into the editor.
                  </p>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Sidebar Options */}
          <div className="space-y-6">
            
            {/* Publish Status */}
            <Card className="bg-[#0f172a] border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Label className="text-white">Publish Status</Label>
                  <Switch 
                    checked={formData.isPublished}
                    onCheckedChange={(checked: any) => setFormData({...formData, isPublished: checked})}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.isPublished ? "Post will be visible to everyone." : "Post is saved as a draft."}
                </p>
              </CardContent>
            </Card>

            {/* Cover Image */}
            <Card className="bg-[#0f172a] border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">Cover Image</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="relative group w-full h-48 bg-[#1e293b] rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                  {formData.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <span className="text-xs">No image selected</span>
                    </div>
                  )}
                  
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                    </div>
                  )}

                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-medium">
                    <Upload className="h-6 w-6 mb-1" />
                    Change Cover
                    <input type="file" className="hidden" onChange={handleCoverImageUpload} accept="image/*" />
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Category & Tags */}
            <Card className="bg-[#0f172a] border-white/10">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-gray-300">Category</Label>
                  <Input 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    className="bg-[#1e293b] border-white/10 text-white mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Tags</Label>
                  <Input 
                    value={formData.tags} 
                    onChange={(e) => setFormData({...formData, tags: e.target.value})} 
                    placeholder="Nextjs, MongoDB, Tutorial"
                    className="bg-[#1e293b] border-white/10 text-white mt-1.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas.</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Button onClick={handleSubmit} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg">
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              {isEditing ? "Update Post" : "Publish Post"}
            </Button>

          </div>
        </div>
      </div>
    )
  }

  // --- LIST VIEW ---
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 min-h-screen bg-[#020817]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Blog Posts</h1>
          <p className="text-gray-400 mt-1">Manage, create, and edit your blog content.</p>
        </div>
        <Button 
          onClick={() => { setView("form"); setFormData(initialFormState); setIsEditing(false); }} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>

      {/* Content Area */}
      {isDataLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-[#0f172a] rounded-xl border border-white/5">
          <p className="text-gray-400 mb-4">No blog posts found.</p>
          <Button variant="outline" onClick={() => setView("form")}>Get Started</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post._id} className="group bg-[#0f172a] border-white/10 overflow-hidden hover:border-emerald-500/50 transition-all duration-300">
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-[#1e293b]">
                {post.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <ImageIcon className="h-10 w-10 opacity-30" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                   <span className={`px-2 py-1 rounded text-xs font-bold ${post.isPublished ? 'bg-emerald-500 text-white' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50'}`}>
                      {post.isPublished ? "Published" : "Draft"}
                   </span>
                </div>
              </div>

              <CardContent className="p-5">
                <div className="mb-2 flex items-center gap-2 text-xs text-emerald-400 font-medium uppercase tracking-wider">
                  {post.category}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">
                  {post.subtitle || "No description provided."}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10" onClick={() => handleEditClick(post)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(post._id)}>
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