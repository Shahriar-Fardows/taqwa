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
import { Progress } from "@/components/ui/progress"
import {
  Plus,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Save,
  Loader2,
  ArrowLeft,
  Upload,
  Globe,
  Briefcase,
  Clock,
  ExternalLink
} from "lucide-react"

// --- TYPES ---
interface BusinessItem {
  _id: string
  name: string
  logo: string
  website: string
  role: string
  duration: string
  description: string
}

// --- INITIAL STATE ---
const initialFormState = {
  name: "",
  logo: "",
  website: "",
  role: "",
  duration: "",
  description: ""
}

export default function BusinessAdmin() {
  // Data States
  const [companies, setCompanies] = useState<BusinessItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  
  // View State
  const [view, setView] = useState<"list" | "form">("list")
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  // Form & Upload States
  const [formData, setFormData] = useState(initialFormState)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // --- 1. FETCH DATA ---
  const fetchCompanies = async () => {
    try {
      setIsDataLoading(true)
      const res = await axios.get("/api/business")
      if (res.data.success) {
        setCompanies(res.data.data)
      }
    } catch (error) {
      console.error("Error fetching companies:", error)
    } finally {
      setIsDataLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  // --- 2. LOGO UPLOAD HELPER ---
  const uploadLogo = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const form = new FormData()
      form.append("file", file)

      const res = await axios.post("/api/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total || 1
          const percent = Math.round((progressEvent.loaded * 100) / total)
          setUploadProgress(percent)
        }
      })

      if (res.data.success) return res.data.url
      return null
    } catch (error) {
      console.error("Upload error:", error)
      Swal.fire({ icon: "error", title: "Upload Failed", text: "Could not upload logo." })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Check if image
    if (!file.type.startsWith('image/')) {
        Swal.fire("Error", "Please upload an image file", "error")
        return
    }

    const url = await uploadLogo(file)
    if (url) {
      setFormData(prev => ({ ...prev, logo: url }))
    }
  }

  // --- 3. FORM SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || (!formData.logo && !isEditing)) {
        Swal.fire("Required", "Company Name and Logo are required", "warning")
        return
    }

    setLoading(true)

    try {
      if (isEditing && editId) {
        // UPDATE
        const res = await axios.put("/api/business", { id: editId, ...formData })
        if (res.data.success) {
            Swal.fire("Updated!", "Company info updated.", "success")
            fetchCompanies()
        }
      } else {
        // CREATE
        const res = await axios.post("/api/business", formData)
        if (res.data.success) {
            Swal.fire("Added!", "New company added.", "success")
            fetchCompanies()
        }
      }
      
      // Reset
      setView("list")
      setIsEditing(false)
      setFormData(initialFormState)

    } catch (error: any) {
      console.error(error)
      Swal.fire("Error", error.response?.data?.message || "Something went wrong", "error")
    } finally {
      setLoading(false)
    }
  }

  // --- 4. EDIT & DELETE ---
  const handleEditClick = (item: BusinessItem) => {
    setFormData({
      name: item.name,
      logo: item.logo,
      website: item.website,
      role: item.role,
      duration: item.duration,
      description: item.description
    })
    setEditId(item._id)
    setIsEditing(true)
    setView("form")
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This will remove the company from your portfolio.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await axios.delete("/api/business", { data: { id } })
        setCompanies(prev => prev.filter(c => c._id !== id))
        Swal.fire('Deleted!', 'Company has been removed.', 'success')
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete.', 'error')
      }
    }
  }

  // ==========================
  // VIEW: FORM (CREATE/EDIT)
  // ==========================
  if (view === "form") {
    return (
      <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => { setView("list"); setFormData(initialFormState); setIsEditing(false); }} className="gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to List
          </Button>
          <h2 className="text-2xl font-bold text-white">{isEditing ? "Edit Company Info" : "Add New Client/Company"}</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Logo Upload */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#0f172a] border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white">Company Logo</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative group w-full h-48 bg-[#1e293b] rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden hover:border-emerald-500/50 transition-colors">
                  {formData.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={formData.logo} alt="Logo" className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <span className="text-xs">Upload Logo (PNG/JPG)</span>
                    </div>
                  )}
                  
                  {/* Progress Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-20">
                        <span className="text-emerald-500 font-bold text-xl mb-2">{uploadProgress}%</span>
                        <Progress value={uploadProgress} className="h-2 w-full" />
                    </div>
                  )}

                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-medium z-10">
                    <Upload className="h-6 w-6 mb-1" />
                    {formData.logo ? "Change Logo" : "Upload Logo"}
                    <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" disabled={isUploading} />
                  </label>
                </div>
                <p className="text-[10px] text-gray-500 mt-3 text-center">
                    Preferred: Transparent PNG
                </p>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Info Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-[#0f172a] border-white/10">
              <CardContent className="p-6 space-y-5">
                
                <div className="space-y-2">
                  <Label className="text-gray-300">Company Name *</Label>
                  <Input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Google, TechCorp"
                    className="bg-[#1e293b] border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label className="text-gray-300">Your Role</Label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input 
                                value={formData.role} 
                                onChange={(e) => setFormData({...formData, role: e.target.value})} 
                                placeholder="e.g. Senior Developer"
                                className="bg-[#1e293b] border-white/10 text-white pl-9"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-300">Duration</Label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                            <Input 
                                value={formData.duration} 
                                onChange={(e) => setFormData({...formData, duration: e.target.value})} 
                                placeholder="e.g. Jan 2023 - Present"
                                className="bg-[#1e293b] border-white/10 text-white pl-9"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Website URL</Label>
                  <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                            value={formData.website} 
                            onChange={(e) => setFormData({...formData, website: e.target.value})} 
                            placeholder="https://company.com"
                            className="bg-[#1e293b] border-white/10 text-white pl-9"
                        />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Short Description</Label>
                  <Textarea 
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    placeholder="Briefly describe what you did..."
                    className="bg-[#1e293b] border-white/10 text-white h-24"
                  />
                </div>

                <Button onClick={handleSubmit} disabled={loading || isUploading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg mt-4">
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                  {isEditing ? "Update Info" : "Save Company"}
                </Button>

              </CardContent>
            </Card>
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Business & Clients</h1>
          <p className="text-gray-400 mt-1">Manage companies and clients you have worked with.</p>
        </div>
        <Button 
          onClick={() => { setView("form"); setFormData(initialFormState); setIsEditing(false); }} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Company
        </Button>
      </div>

      {/* Content Area */}
      {isDataLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20 bg-[#0f172a] rounded-xl border border-white/5">
          <p className="text-gray-400 mb-4">No companies added yet.</p>
          <Button variant="outline" onClick={() => setView("form")}>Add Your First Client</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company._id} className="group bg-[#0f172a] border-white/10 hover:border-emerald-500/50 transition-all duration-300 flex flex-col h-full">
              <CardContent className="p-6 flex flex-col items-center text-center flex-1">
                
                {/* Logo */}
                <div className="w-24 h-24 mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{company.name}</h3>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-3">
                    <Briefcase className="h-3 w-3" /> {company.role || "N/A"}
                </div>

                <div className="text-xs text-gray-500 mb-4 bg-[#1e293b] px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {company.duration || "Duration not set"}
                </div>

                <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                    {company.description || "No description provided."}
                </p>

                <div className="mt-auto w-full pt-4 border-t border-white/5 flex items-center justify-between">
                    {company.website ? (
                        <a href={company.website} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-emerald-500 transition-colors flex items-center gap-1 text-xs font-medium">
                            <ExternalLink className="h-3 w-3" /> Visit
                        </a>
                    ) : <span className="text-xs text-gray-600">No Link</span>}

                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10" onClick={() => handleEditClick(company)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(company._id)}>
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