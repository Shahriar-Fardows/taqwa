"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Pencil,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Save,
  Linkedin,
  Twitter,
  MessageCircle,
  Video,
  ArrowUpRight,
  Share2,
  LayoutGrid
} from "lucide-react"

// Interface
interface Contact {
  _id: string
  email: string
  phone: string
  address: string
  social: {
    facebook?: string
    instagram?: string
    youtube?: string
    linkedin?: string
    twitter?: string
    whatsapp?: string
    tiktok?: string
  }
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)

  // Black and White Theme Colors
  const themeBlack = "#09090b" // Zinc-950

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    twitter: "",
    whatsapp: "",
    tiktok: "",
  })

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/contact")
      if (response.data.success && response.data.data.length > 0) {
        const contactData = response.data.data[0]
        setContact(contactData)
        setFormData({
          email: contactData.email || "",
          phone: contactData.phone || "",
          address: contactData.address || "",
          facebook: contactData.social?.facebook || "",
          instagram: contactData.social?.instagram || "",
          youtube: contactData.social?.youtube || "",
          linkedin: contactData.social?.linkedin || "",
          twitter: contactData.social?.twitter || "",
          whatsapp: contactData.social?.whatsapp || "",
          tiktok: contactData.social?.tiktok || "",
        })
      }
    } catch (error) {
      console.error("Error fetching contact:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch contact",
        confirmButtonColor: themeBlack,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!contact) return
    try {
      const response = await axios.put(`/api/contact`, {
        id: contact._id,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        social: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          youtube: formData.youtube,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          whatsapp: formData.whatsapp,
          tiktok: formData.tiktok,
        },
      })
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "Your contact information is live.",
          confirmButtonColor: themeBlack,
          iconColor: themeBlack,
          timer: 1500,
          showConfirmButton: false
        })
        fetchContact()
        setIsEditOpen(false)
      }
    } catch (error) {
      console.error("Error updating contact:", error)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        confirmButtonColor: themeBlack,
      })
    }
  }

  // Ultra Minimal Social Card
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SocialCard = ({ icon: Icon, label, url }: any) => {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-white hover:border-neutral-900 hover:shadow-sm transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-neutral-50 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <span className="font-medium text-neutral-900">{label}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-900 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
      </a>
    )
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent"></div>
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest text-[10px]">Loading Data</p>
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[50vh] bg-white">
        <div className="p-4 bg-neutral-100 rounded-full mb-4">
            <Globe className="h-8 w-8 text-neutral-900" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">No Data Available</h2>
        <p className="text-neutral-500 mt-2 text-sm">Initialize your database to get started.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900 p-6 md:p-12  mx-auto font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-neutral-100 pb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-950 mb-2">Contact Hub</h1>
          <p className="text-neutral-500 max-w-md leading-relaxed">
            Manage your digital footprint. Update contact details and social connections from a unified dashboard.
          </p>
        </div>
        <Button 
          onClick={() => setIsEditOpen(true)} 
          className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-none px-8 py-6 transition-all shadow-none"
        >
          <Pencil className="mr-2 h-4 w-4" /> Edit Details
        </Button>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        
        {/* Main Info Section */}
        <div className="lg:col-span-3">
            <div className="flex items-center gap-2 mb-6">
                <LayoutGrid className="h-5 w-5 text-neutral-400" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Primary Information</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
                 {/* Email Card */}
                <Card className="rounded-xl border border-neutral-100 bg-neutral-50/50 shadow-none p-6 hover:bg-white hover:border-neutral-200 transition-all duration-300">
                    <CardContent className="p-0 space-y-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-neutral-900" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Email Address</p>
                            <p className="text-lg font-semibold text-neutral-900 truncate">{contact.email}</p>
                        </div>
                    </CardContent>
                </Card>

                 {/* Phone Card */}
                 <Card className="rounded-xl border border-neutral-100 bg-neutral-50/50 shadow-none p-6 hover:bg-white hover:border-neutral-200 transition-all duration-300">
                    <CardContent className="p-0 space-y-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                            <Phone className="h-5 w-5 text-neutral-900" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Phone Number</p>
                            <p className="text-lg font-semibold text-neutral-900 truncate">{contact.phone}</p>
                        </div>
                    </CardContent>
                </Card>

                 {/* Address Card */}
                 <Card className="rounded-xl border border-neutral-100 bg-neutral-50/50 shadow-none p-6 hover:bg-white hover:border-neutral-200 transition-all duration-300">
                    <CardContent className="p-0 space-y-4">
                        <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                            <MapPin className="h-5 w-5 text-neutral-900" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Location</p>
                            <p className="text-lg font-semibold text-neutral-900 truncate">{contact.address}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

        {/* Social Media Grid */}
        <div className="lg:col-span-3">
           <div className="flex items-center justify-between mb-6 border-t border-neutral-100 pt-10">
                <div className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-neutral-400" />
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Social Connections</h3>
                </div>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <SocialCard icon={Facebook} label="Facebook" url={contact.social?.facebook} />
                <SocialCard icon={Instagram} label="Instagram" url={contact.social?.instagram} />
                <SocialCard icon={Linkedin} label="LinkedIn" url={contact.social?.linkedin} />
                <SocialCard icon={Twitter} label="Twitter / X" url={contact.social?.twitter} />
                <SocialCard icon={Youtube} label="YouTube" url={contact.social?.youtube} />
                <SocialCard icon={MessageCircle} label="WhatsApp" url={contact.social?.whatsapp} />
                <SocialCard icon={Video} label="TikTok" url={contact.social?.tiktok} />
            </div>

            {!Object.values(contact.social || {}).some(val => val) && (
                <div className="border border-dashed border-neutral-300 rounded-lg p-12 flex flex-col items-center justify-center text-center bg-neutral-50/30">
                    <Share2 className="h-8 w-8 text-neutral-300 mb-3" />
                    <p className="text-neutral-500">No social profiles connected.</p>
                </div>
            )}
        </div>
      </div>

      {/* Edit Dialog - Minimalist */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-white border-neutral-200">
          
          <DialogHeader className="p-8 border-b border-neutral-100">
            <DialogTitle className="text-2xl font-bold text-neutral-900">Edit Profile</DialogTitle>
            <DialogDescription className="text-neutral-500 mt-2">
              Make changes to your contact information and social links below.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-8">
            <div className="grid gap-10 md:grid-cols-2">
              
              {/* Left Column: Contact Info */}
              <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2 mb-4">
                    Basic Details
                  </h4>
                  
                  <div className="space-y-5">
                      <div className="grid gap-2">
                          <Label htmlFor="edit-email" className="text-neutral-600">Email Address</Label>
                          <Input 
                            id="edit-email" 
                            value={formData.email} 
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                            className="border-neutral-200 focus-visible:ring-neutral-900 bg-neutral-50 h-11" 
                          />
                      </div>
                      <div className="grid gap-2">
                          <Label htmlFor="edit-phone" className="text-neutral-600">Phone Number</Label>
                          <Input 
                            id="edit-phone" 
                            value={formData.phone} 
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                            className="border-neutral-200 focus-visible:ring-neutral-900 bg-neutral-50 h-11" 
                          />
                      </div>
                      <div className="grid gap-2">
                          <Label htmlFor="edit-address" className="text-neutral-600">Address</Label>
                          <Input 
                            id="edit-address" 
                            value={formData.address} 
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })} 
                            className="border-neutral-200 focus-visible:ring-neutral-900 bg-neutral-50 h-11" 
                          />
                      </div>
                  </div>
              </div>

              {/* Right Column: Social Media */}
              <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-2 mb-4">
                    Social Links
                  </h4>
                  
                  <div className="grid gap-4">
                    {/* Helper function to generate clean input fields */}
                    {[
                        { icon: Facebook, label: "Facebook", value: formData.facebook, key: 'facebook' },
                        { icon: Instagram, label: "Instagram", value: formData.instagram, key: 'instagram' },
                        { icon: Linkedin, label: "LinkedIn", value: formData.linkedin, key: 'linkedin' },
                        { icon: Twitter, label: "Twitter / X", value: formData.twitter, key: 'twitter' },
                        { icon: Youtube, label: "YouTube", value: formData.youtube, key: 'youtube' },
                        { icon: MessageCircle, label: "WhatsApp", value: formData.whatsapp, key: 'whatsapp' },
                        { icon: Video, label: "TikTok", value: formData.tiktok, key: 'tiktok' },
                    ].map((item) => (
                        <div key={item.key} className="relative group">
                            <item.icon className="absolute left-3 top-3 h-4 w-4 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" />
                            <Input 
                                className="pl-10 border-neutral-200 focus-visible:ring-neutral-900 h-10" 
                                placeholder={`${item.label} URL`} 
                                value={item.value} 
                                onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })} 
                            />
                        </div>
                    ))}
                  </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 border-t border-neutral-100 bg-white">
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="border-neutral-200 hover:bg-neutral-50 text-neutral-900">
                Cancel
            </Button>
            <Button 
                onClick={handleUpdate} 
                className="bg-neutral-900 hover:bg-neutral-800 text-white min-w-[140px]"
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}