"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  LayoutGrid,
  Image as ImageIcon,
  Upload,
  Loader2,
  Type,
} from "lucide-react";

// Interface
interface Contact {
  _id: string;
  siteName?: string;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    twitter?: string;
    whatsapp?: string;
    tiktok?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    siteName: "",
    logo: "",
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
  });

  useEffect(() => {
    fetchContact();
  }, []);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/contact");
      if (response.data.success && response.data.data.length > 0) {
        const contactData = response.data.data[0];
        setContact(contactData);
        setFormData({
          siteName: contactData.siteName || "",
          logo: contactData.logo || "",
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
        });
      }
    } catch (error) {
      console.error("Error fetching contact:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      
      const res = await axios.post("/api/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setFormData((prev) => ({ ...prev, logo: res.data.url }));
        Swal.fire({
          icon: "success",
          title: "Uploaded",
          text: "Logo uploaded successfully",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          background: "#1e293b",
          color: "#fff",
        });
      }
    } catch (error) {
      console.error("Upload failed", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not upload image",
        background: "#1e293b",
        color: "#fff",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (!contact) return;
    try {
      const response = await axios.put(`/api/contact`, {
        id: contact._id,
        siteName: formData.siteName,
        logo: formData.logo,
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
      });
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: "Your contact information is live.",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#10b981",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchContact();
        setIsEditOpen(false);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        background: "#1e293b",
        color: "#fff",
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SocialCard = ({ icon: Icon, label, url }: any) => {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            <Icon className="h-5 w-5" />
          </div>
          <span className="font-medium text-gray-200">{label}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-emerald-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
      </a>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"></div>
          <p className="text-xs font-medium text-emerald-500 uppercase tracking-widest">
            Loading Data
          </p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="p-4 bg-white/5 rounded-full mb-4 border border-white/10">
          <Globe className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-white">No Data Available</h2>
        <p className="text-gray-400 mt-2 text-sm">
          Initialize your database to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="text-white space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Contact & Branding
          </h1>
          <p className="text-gray-400 max-w-md leading-relaxed">
            Manage your site branding, logo, contact details and social connections.
          </p>
        </div>
        <Button
          onClick={() => setIsEditOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl px-6 py-5 shadow-lg shadow-emerald-500/20"
        >
          <Pencil className="mr-2 h-4 w-4" /> Edit Details
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Info Section */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2 mb-6">
            <LayoutGrid className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Primary Information
            </h3>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* BRANDING CARD */}
            <Card className="md:col-span-1 rounded-xl border border-white/5 bg-white/5 shadow-none p-6 hover:bg-white/10 hover:border-emerald-500/20 transition-all duration-300 group">
              <CardContent className="p-0 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-emerald-500/50 transition-colors">
                  {contact.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={contact.logo}
                      alt="Site Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Site Name
                  </p>
                  <p className="text-lg font-bold text-white truncate">
                    {contact.siteName || "Not Set"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CONTACT DETAILS CARDS */}
            <div className="md:col-span-3 grid md:grid-cols-3 gap-6">
              {[
                { icon: Mail, label: "Email Address", value: contact.email },
                { icon: Phone, label: "Phone Number", value: contact.phone },
                { icon: MapPin, label: "Location", value: contact.address },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="rounded-xl border border-white/5 bg-white/5 shadow-none p-6 hover:bg-white/10 hover:border-emerald-500/20 transition-all duration-300 group"
                >
                  <CardContent className="p-0 space-y-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-500">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                        {item.label}
                      </p>
                      <p className="text-lg font-semibold text-white truncate">
                        {item.value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media Grid */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6 border-t border-white/10 pt-10">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Social Connections
              </h3>
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

          {!Object.values(contact.social || {}).some((val) => val) && (
            <div className="border border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-white/5">
              <Share2 className="h-8 w-8 text-gray-600 mb-3" />
              <p className="text-gray-500">No social profiles connected.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-[#0f172a] border-white/10 text-white">
          <DialogHeader className="p-8 border-b border-white/10 bg-[#1e293b]/50">
            <DialogTitle className="text-2xl font-bold text-white">
              Edit Site & Contact Info
            </DialogTitle>
            <DialogDescription className="text-gray-400 mt-2">
              Update your logo, site name, contact details and social links.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 p-8">
            <div className="grid gap-10 md:grid-cols-2">
              
              {/* Left Column: Branding & Contact */}
              <div className="space-y-8">
                
                {/* Branding */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-500 border-b border-white/10 pb-2 mb-4">
                    Branding
                  </h4>
                  
                  {/* Logo Upload */}
                  <div className="grid gap-2">
                    <Label className="text-gray-300 font-medium">Website Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {formData.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label htmlFor="logo-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-white/10 text-white hover:bg-white/20 h-9 px-4 py-2 w-full">
                          {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                          {uploading ? "Uploading..." : "Upload Logo"}
                        </label>
                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
                      </div>
                    </div>
                  </div>

                  {/* Site Name */}
                  <div className="grid gap-2">
                    <Label className="text-gray-300 font-medium">Site Name</Label>
                    <div className="relative">
                      <Type className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                      <Input
                        value={formData.siteName}
                        onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                        className="pl-10 border-white/10 focus-visible:ring-emerald-500 bg-white/5 h-10 text-white placeholder:text-gray-600"
                        placeholder="e.g. My Portfolio"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-500 border-b border-white/10 pb-2 mb-4">Basic Details</h4>
                  <div className="space-y-5">
                    <div className="grid gap-2">
                        <Label className="text-gray-300">Email Address</Label>
                        <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="border-white/10 bg-white/5 text-white" />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-gray-300">Phone Number</Label>
                        <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="border-white/10 bg-white/5 text-white" />
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-gray-300">Address</Label>
                        <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="border-white/10 bg-white/5 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Social Media */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-500 border-b border-white/10 pb-2 mb-4">Social Links</h4>
                <div className="grid gap-4">
                  {[
                    { icon: Facebook, label: "Facebook", value: formData.facebook, key: "facebook" },
                    { icon: Instagram, label: "Instagram", value: formData.instagram, key: "instagram" },
                    { icon: Linkedin, label: "LinkedIn", value: formData.linkedin, key: "linkedin" },
                    { icon: Twitter, label: "Twitter", value: formData.twitter, key: "twitter" },
                    { icon: Youtube, label: "YouTube", value: formData.youtube, key: "youtube" },
                    { icon: MessageCircle, label: "WhatsApp", value: formData.whatsapp, key: "whatsapp" },
                    { icon: Video, label: "TikTok", value: formData.tiktok, key: "tiktok" },
                  ].map((item) => (
                    <div key={item.key} className="relative group">
                      <item.icon className="absolute left-3 top-3 h-4 w-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                      <Input
                        className="pl-10 border-white/10 focus-visible:ring-emerald-500 bg-white/5 h-10 text-white placeholder:text-gray-600"
                        placeholder={`${item.label} URL`}
                        value={item.value}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(e) => setFormData({ ...formData, [item.key as any]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </ScrollArea>

          <DialogFooter className="p-6 border-t border-white/10 bg-[#1e293b]/50">
            <Button variant="outline" onClick={() => setIsEditOpen(false)} className="border-white/10 hover:bg-white/10 text-gray-300 bg-transparent">Cancel</Button>
            <Button onClick={handleUpdate} className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[140px] border-none" disabled={uploading}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}