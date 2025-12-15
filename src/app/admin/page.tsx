"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Separator } from "@/components/ui/separator"
import {
  Pencil,
  Loader2,
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
  ExternalLink,
  Share2
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

  const brandColor = "#ffd54f"

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
        confirmButtonColor: brandColor,
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
          title: "Updated!",
          text: "Contact information has been updated.",
          confirmButtonColor: brandColor,
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
        confirmButtonColor: brandColor,
      })
    }
  }

  // Modern Social Card Component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SocialCard = ({ icon: Icon, label, url, colorClass, bgClass }: any) => {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={`group flex items-center gap-4 p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden`}
      >
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-6 -mt-6 transition-transform group-hover:scale-150 ${bgClass}`} />
        
        <div className={`p-3 rounded-full ${bgClass} ${colorClass} relative z-10`}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div className="flex-1 min-w-0 relative z-10">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
            <span className="truncate max-w-[150px]">View Profile</span>
            <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </a>
    )
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center bg-gray-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-muted opacity-20"></div>
            <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: brandColor }}></div>
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading contact data...</p>
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="p-6 bg-yellow-50 rounded-full mb-4">
            <Globe className="h-10 w-10 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">No Contact Data Found</h2>
        <p className="text-muted-foreground mt-2 mb-6">Please initialize your database with contact information.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/40 p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contact Management</h1>
          <p className="text-muted-foreground mt-1">Manage your business contact details and social links.</p>
        </div>
        <Button 
          onClick={() => setIsEditOpen(true)} 
          className="shadow-sm hover:shadow-md transition-all font-medium px-6"
          style={{ backgroundColor: brandColor, color: "#1a1a1a" }}
        >
          <Pencil className="mr-2 h-4 w-4" /> Edit Information
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Main Contact Info Card (Hero Style) */}
        <Card className="lg:col-span-3 overflow-hidden border-none shadow-md bg-white relative">
            {/* Top decorative bar */}
            <div className="h-2 w-full" style={{ backgroundColor: brandColor }}></div>
            
            <CardContent className="p-0">
                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b">
                    {/* Email */}
                    <div className="p-6 flex flex-col items-center text-center hover:bg-gray-50 transition-colors group">
                        <div className="mb-4 p-3 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                            <Mail className="h-6 w-6" />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Email Address</h3>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{contact.email}</p>
                    </div>

                    {/* Phone */}
                    <div className="p-6 flex flex-col items-center text-center hover:bg-gray-50 transition-colors group">
                        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-full group-hover:scale-110 transition-transform">
                            <Phone className="h-6 w-6" />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Phone Number</h3>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{contact.phone}</p>
                    </div>

                    {/* Address */}
                    <div className="p-6 flex flex-col items-center text-center hover:bg-gray-50 transition-colors group">
                        <div className="mb-4 p-3 bg-orange-50 text-orange-600 rounded-full group-hover:scale-110 transition-transform">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Office Address</h3>
                        <p className="mt-1 text-lg font-semibold text-gray-900">{contact.address}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Social Media Grid */}
        <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Share2 className="h-5 w-5 text-gray-500" />
                <h2 className="text-xl font-semibold text-gray-800">Connected Social Accounts</h2>
            </div>
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <SocialCard 
                    icon={Facebook} label="Facebook" url={contact.social?.facebook}
                    colorClass="text-blue-600" bgClass="bg-blue-100"
                />
                <SocialCard 
                    icon={Instagram} label="Instagram" url={contact.social?.instagram}
                    colorClass="text-pink-600" bgClass="bg-pink-100"
                />
                <SocialCard 
                    icon={Linkedin} label="LinkedIn" url={contact.social?.linkedin}
                    colorClass="text-sky-700" bgClass="bg-sky-100"
                />
                <SocialCard 
                    icon={Twitter} label="Twitter / X" url={contact.social?.twitter}
                    colorClass="text-gray-800" bgClass="bg-gray-200"
                />
                <SocialCard 
                    icon={Youtube} label="YouTube" url={contact.social?.youtube}
                    colorClass="text-red-600" bgClass="bg-red-100"
                />
                <SocialCard 
                    icon={MessageCircle} label="WhatsApp" url={contact.social?.whatsapp}
                    colorClass="text-green-600" bgClass="bg-green-100"
                />
                <SocialCard 
                    icon={Video} label="TikTok" url={contact.social?.tiktok}
                    colorClass="text-black" bgClass="bg-gray-300"
                />
            </div>

            {!Object.values(contact.social || {}).some(val => val) && (
                <Card className="border-dashed bg-gray-50">
                    <CardContent className="flex flex-col items-center justify-center p-10 text-center">
                        <Share2 className="h-10 w-10 text-muted-foreground mb-3 opacity-50" />
                        <p className="text-muted-foreground font-medium">No social media accounts connected yet.</p>
                        <Button variant="link" onClick={() => setIsEditOpen(true)} className="text-blue-600">
                            Add Social Links
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>

      {/* Edit Dialog - Clean & Organized */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
          
          <DialogHeader className="p-6 pb-4 border-b bg-gray-50/50">
            <DialogTitle className="text-xl flex items-center gap-2">
                <div className="p-2 rounded-lg bg-yellow-100">
                    <Pencil className="h-4 w-4 text-yellow-700" />
                </div>
                Edit Information
            </DialogTitle>
            <DialogDescription>
              Update your public contact details and social media links.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="grid gap-8 md:grid-cols-2">
              
              {/* Left Column: Contact Info */}
              <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <h4 className="font-semibold text-gray-800">Contact Details</h4>
                  </div>
                  
                  <div className="space-y-4">
                      <div className="grid gap-2">
                          <Label htmlFor="edit-email">Email Address</Label>
                          <Input id="edit-email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="focus-visible:ring-yellow-400" />
                      </div>
                      <div className="grid gap-2">
                          <Label htmlFor="edit-phone">Phone Number</Label>
                          <Input id="edit-phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="focus-visible:ring-yellow-400" />
                      </div>
                      <div className="grid gap-2">
                          <Label htmlFor="edit-address">Office Address</Label>
                          <Input id="edit-address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="focus-visible:ring-yellow-400" />
                      </div>
                  </div>
              </div>

              {/* Right Column: Social Media */}
              <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b">
                      <Share2 className="h-4 w-4 text-gray-500" />
                      <h4 className="font-semibold text-gray-800">Social Links</h4>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="relative">
                            <Facebook className="absolute left-3 top-2.5 h-4 w-4 text-blue-600" />
                            <Input className="pl-9" placeholder="Facebook URL" value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} />
                        </div>
                        <div className="relative">
                            <Instagram className="absolute left-3 top-2.5 h-4 w-4 text-pink-600" />
                            <Input className="pl-9" placeholder="Instagram URL" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} />
                        </div>
                        <div className="relative">
                            <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-sky-700" />
                            <Input className="pl-9" placeholder="LinkedIn URL" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                        </div>
                        <div className="relative">
                            <Twitter className="absolute left-3 top-2.5 h-4 w-4 text-gray-700" />
                            <Input className="pl-9" placeholder="Twitter/X URL" value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} />
                        </div>
                        <div className="relative">
                            <Youtube className="absolute left-3 top-2.5 h-4 w-4 text-red-600" />
                            <Input className="pl-9" placeholder="YouTube URL" value={formData.youtube} onChange={(e) => setFormData({ ...formData, youtube: e.target.value })} />
                        </div>
                        <div className="relative">
                            <MessageCircle className="absolute left-3 top-2.5 h-4 w-4 text-green-600" />
                            <Input className="pl-9" placeholder="WhatsApp Link" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} />
                        </div>
                        <div className="relative">
                            <Video className="absolute left-3 top-2.5 h-4 w-4 text-black" />
                            <Input className="pl-9" placeholder="TikTok URL" value={formData.tiktok} onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })} />
                        </div>
                    </div>
                  </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-4 border-t bg-gray-50/50">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} style={{ backgroundColor: brandColor, color: "#1a1a1a" }} className="font-medium">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}