"use client"

import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import Image from "next/image"
import Swal from "sweetalert2"
import { 
  Loader2, 
  Plus, 
  Monitor, 
  Smartphone, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Upload,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  ImageIcon
} from "lucide-react"

// --- Types ---
interface Banner {
  _id: string
  title: string
  desktopImage: string
  mobileImage: string
  link: string
  isActive: boolean
  order: number
}

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  // --- Form States ---
  const [title, setTitle] = useState("")
  const [link, setLink] = useState("")
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  
  // Image Files & Previews
  const [desktopFile, setDesktopFile] = useState<File | null>(null)
  const [mobileFile, setMobileFile] = useState<File | null>(null)
  const [desktopPreview, setDesktopPreview] = useState("")
  const [mobilePreview, setMobilePreview] = useState("")

  // Refs for file inputs
  const desktopInputRef = useRef<HTMLInputElement>(null)
  const mobileInputRef = useRef<HTMLInputElement>(null)

  // --- 1. Fetch Banners ---
  const fetchBanners = async () => {
    try {
      const res = await axios.get("/api/banners")
      if (res.data.success) {
        setBanners(res.data.data)
      }
    } catch (error) {
      console.error(error)
      Swal.fire("Error", "Failed to load banners", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  // --- 2. Handle Image Selection ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "desktop" | "mobile") => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      if (type === "desktop") {
        setDesktopFile(file)
        setDesktopPreview(url)
      } else {
        setMobileFile(file)
        setMobilePreview(url)
      }
    }
  }

  // --- 3. Open/Close Modal ---
  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner)
      setTitle(banner.title)
      setLink(banner.link)
      setOrder(banner.order)
      setIsActive(banner.isActive)
      setDesktopPreview(banner.desktopImage)
      setMobilePreview(banner.mobileImage)
    } else {
      setEditingBanner(null)
      resetForm()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setLink("")
    setOrder(0)
    setIsActive(true)
    setDesktopFile(null)
    setMobileFile(null)
    setDesktopPreview("")
    setMobilePreview("")
    if (desktopInputRef.current) desktopInputRef.current.value = ""
    if (mobileInputRef.current) mobileInputRef.current.value = ""
  }

  // --- 4. Submit Handler (Create/Update) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingBanner && !desktopFile) {
        return Swal.fire("Error", "Desktop image is required", "warning")
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append("title", title)
    formData.append("link", link)
    formData.append("order", order.toString())
    formData.append("isActive", isActive.toString())

    if (desktopFile) formData.append("desktopImage", desktopFile)
    if (mobileFile) formData.append("mobileImage", mobileFile)

    try {
      if (editingBanner) {
        // Update
        formData.append("id", editingBanner._id)
        await axios.put("/api/banners", formData)
        Swal.fire({ icon: "success", title: "Updated!", timer: 1500, showConfirmButton: false, background: "#1e293b", color: "#fff" })
      } else {
        // Create
        await axios.post("/api/banners", formData)
        Swal.fire({ icon: "success", title: "Created!", timer: 1500, showConfirmButton: false, background: "#1e293b", color: "#fff" })
      }
      closeModal()
      fetchBanners()
    } catch (error) {
      console.error(error)
      Swal.fire({ icon: "error", title: "Failed", text: "Something went wrong", background: "#1e293b", color: "#fff" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- 5. Delete Handler ---
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#d33",
      background: "#1e293b", 
      color: "#fff"
    })

    if (result.isConfirmed) {
      try {
        await axios.delete("/api/banners", { data: { id } })
        Swal.fire({ title: "Deleted!", icon: "success", background: "#1e293b", color: "#fff", timer: 1000, showConfirmButton: false })
        fetchBanners()
      } catch (error) {
        Swal.fire("Error", "Failed to delete", "error")
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12 font-sans">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
             <ImageIcon className="text-emerald-500" /> Banner Management
          </h1>
          <p className="text-gray-400 mt-1">Manage your website&apos;s home sliders & banners.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-5 h-5" /> Add New Banner
        </button>
      </div>

      {/* --- Banner Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-[#1e293b] border border-white/5 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all">
            
            {/* Preview Images (Desktop & Mobile Side-by-Side) */}
            <div className="relative h-48 w-full bg-[#020617] flex">
              {/* Desktop Preview */}
              <div className="w-2/3 relative border-r border-white/10">
                <Image src={banner.desktopImage} alt="Desktop" fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] flex items-center gap-1">
                   <Monitor className="w-3 h-3" /> Desktop
                </div>
              </div>
              {/* Mobile Preview */}
              <div className="w-1/3 relative">
                 <Image src={banner.mobileImage} alt="Mobile" fill className="object-cover" />
                 <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] flex items-center gap-1">
                   <Smartphone className="w-3 h-3" /> Mobile
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-lg font-bold text-white truncate pr-2">{banner.title}</h3>
                 <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${banner.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                    {banner.isActive ? "Active" : "Inactive"}
                 </span>
              </div>
              
              <div className="text-sm text-gray-400 mb-4 flex flex-col gap-1">
                 <p className="flex items-center gap-1"><span className="text-emerald-500">#</span> Order: {banner.order}</p>
                 {banner.link && (
                    <a href={banner.link} target="_blank" className="flex items-center gap-1 hover:text-emerald-400 truncate">
                       <LinkIcon className="w-3 h-3" /> {banner.link}
                    </a>
                 )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
                <button 
                  onClick={() => openModal(banner)} 
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#0f172a] hover:bg-emerald-600 hover:text-white transition-colors text-sm font-medium border border-white/10"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(banner._id)} 
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#0f172a] hover:bg-red-500 hover:text-white transition-colors text-sm font-medium border border-white/10"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500 bg-[#1e293b]/50 rounded-2xl border-2 border-dashed border-white/10">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No banners found. Create one!</p>
          </div>
        )}
      </div>

      {/* --- Modal Form --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center p-6 border-b border-white/10 sticky top-0 bg-[#1e293b] z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {editingBanner ? <Edit className="w-5 h-5 text-emerald-500"/> : <Plus className="w-5 h-5 text-emerald-500"/>}
                {editingBanner ? "Edit Banner" : "Create New Banner"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Text Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-2">Banner Title</label>
                   <input 
                     type="text" 
                     value={title} 
                     onChange={(e) => setTitle(e.target.value)} 
                     placeholder="e.g. Eid Sale 2025" 
                     className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                     required
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-2">Redirect Link (Optional)</label>
                   <input 
                     type="text" 
                     value={link} 
                     onChange={(e) => setLink(e.target.value)} 
                     placeholder="https://..." 
                     className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                   />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Display Order</label>
                    <input 
                      type="number" 
                      value={order} 
                      onChange={(e) => setOrder(parseInt(e.target.value))} 
                      className="w-full bg-[#0f172a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                    />
                 </div>
                 <div className="flex items-center gap-4 mt-8">
                    <label className="text-sm font-medium text-gray-400">Status:</label>
                    <div className="flex gap-4">
                      <button 
                         type="button"
                         onClick={() => setIsActive(true)}
                         className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border ${isActive ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-[#0f172a] border-white/10 text-gray-500"}`}
                      >
                         <CheckCircle className="w-4 h-4" /> Active
                      </button>
                      <button 
                         type="button"
                         onClick={() => setIsActive(false)}
                         className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border ${!isActive ? "bg-red-500/20 border-red-500 text-red-400" : "bg-[#0f172a] border-white/10 text-gray-500"}`}
                      >
                         <XCircle className="w-4 h-4" /> Inactive
                      </button>
                    </div>
                 </div>
              </div>

              {/* Image Upload Area */}
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                 
                 {/* Desktop Image */}
                 <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
                       <Monitor className="w-4 h-4 text-emerald-500" /> Desktop Image
                       <span className="text-xs font-normal text-gray-500">(16:9 Recommended)</span>
                    </label>
                    
                    <div 
                      onClick={() => desktopInputRef.current?.click()}
                      className="relative h-40 bg-[#0f172a] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-[#0f172a]/80 transition-all group overflow-hidden"
                    >
                       {desktopPreview ? (
                          <Image src={desktopPreview} alt="Desktop Preview" fill className="object-cover" />
                       ) : (
                          <>
                             <Upload className="w-8 h-8 text-gray-500 group-hover:text-emerald-500 mb-2" />
                             <span className="text-xs text-gray-500">Click to upload</span>
                          </>
                       )}
                       {/* Overlay on hover if image exists */}
                       {desktopPreview && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Edit className="w-6 h-6 text-white" />
                          </div>
                       )}
                    </div>
                    <input 
                       type="file" 
                       ref={desktopInputRef} 
                       hidden 
                       accept="image/*" 
                       onChange={(e) => handleImageChange(e, "desktop")} 
                    />
                 </div>

                 {/* Mobile Image */}
                 <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-300">
                       <Smartphone className="w-4 h-4 text-emerald-500" /> Mobile Image
                       <span className="text-xs font-normal text-gray-500">(9:16 or Square)</span>
                    </label>
                    
                    <div 
                      onClick={() => mobileInputRef.current?.click()}
                      className="relative h-40 bg-[#0f172a] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-[#0f172a]/80 transition-all group overflow-hidden"
                    >
                       {mobilePreview ? (
                          <Image src={mobilePreview} alt="Mobile Preview" fill className="object-contain" />
                       ) : (
                          <>
                             <Upload className="w-8 h-8 text-gray-500 group-hover:text-emerald-500 mb-2" />
                             <span className="text-xs text-gray-500">Click to upload</span>
                          </>
                       )}
                       {mobilePreview && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Edit className="w-6 h-6 text-white" />
                          </div>
                       )}
                    </div>
                    <input 
                       type="file" 
                       ref={mobileInputRef} 
                       hidden 
                       accept="image/*" 
                       onChange={(e) => handleImageChange(e, "mobile")} 
                    />
                 </div>

              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                 <button 
                   type="button" 
                   onClick={closeModal}
                   className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-bold"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   disabled={isSubmitting}
                   className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                 >
                   {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                   {editingBanner ? "Update Banner" : "Save Banner"}
                 </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}