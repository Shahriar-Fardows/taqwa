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
} from "lucide-react";

// Interface
interface Contact {
  _id: string;
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch contact",
        background: "#1e293b",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!contact) return;
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

  // Ultra Minimal Social Card - Dark Theme Styled
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
            Contact Hub
          </h1>
          <p className="text-gray-400 max-w-md leading-relaxed">
            Manage your digital footprint. Update contact details and social
            connections from a unified dashboard.
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

          <div className="grid md:grid-cols-3 gap-6">
            {/* Cards with Glassmorphism */}
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
            <SocialCard
              icon={Facebook}
              label="Facebook"
              url={contact.social?.facebook}
            />
            <SocialCard
              icon={Instagram}
              label="Instagram"
              url={contact.social?.instagram}
            />
            <SocialCard
              icon={Linkedin}
              label="LinkedIn"
              url={contact.social?.linkedin}
            />
            <SocialCard
              icon={Twitter}
              label="Twitter / X"
              url={contact.social?.twitter}
            />
            <SocialCard
              icon={Youtube}
              label="YouTube"
              url={contact.social?.youtube}
            />
            <SocialCard
              icon={MessageCircle}
              label="WhatsApp"
              url={contact.social?.whatsapp}
            />
            <SocialCard
              icon={Video}
              label="TikTok"
              url={contact.social?.tiktok}
            />
          </div>

          {!Object.values(contact.social || {}).some((val) => val) && (
            <div className="border border-dashed border-white/10 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-white/5">
              <Share2 className="h-8 w-8 text-gray-600 mb-3" />
              <p className="text-gray-500">No social profiles connected.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog - Dark Mode */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-[#0f172a] border-white/10 text-white">
          <DialogHeader className="p-8 border-b border-white/10 bg-[#1e293b]/50">
            <DialogTitle className="text-2xl font-bold text-white">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-gray-400 mt-2">
              Make changes to your contact information and social links below.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 p-8">
            <div className="grid gap-10 md:grid-cols-2">
              {/* Left Column: Contact Info */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-500 border-b border-white/10 pb-2 mb-4">
                  Basic Details
                </h4>

                <div className="space-y-5">
                  {[
                    {
                      id: "edit-email",
                      label: "Email Address",
                      value: formData.email,
                      key: "email",
                    },
                    {
                      id: "edit-phone",
                      label: "Phone Number",
                      value: formData.phone,
                      key: "phone",
                    },
                    {
                      id: "edit-address",
                      label: "Address",
                      value: formData.address,
                      key: "address",
                    },
                  ].map((field) => (
                    <div key={field.key} className="grid gap-2">
                      <Label
                        htmlFor={field.id}
                        className="text-gray-300 font-medium"
                      >
                        {field.label}
                      </Label>
                      <Input
                        id={field.id}
                        value={field.value}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="border-white/10 focus-visible:ring-emerald-500 bg-white/5 h-11 text-white placeholder:text-gray-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Social Media */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-500 border-b border-white/10 pb-2 mb-4">
                  Social Links
                </h4>

                <div className="grid gap-4">
                  {[
                    {
                      icon: Facebook,
                      label: "Facebook",
                      value: formData.facebook,
                      key: "facebook",
                    },
                    {
                      icon: Instagram,
                      label: "Instagram",
                      value: formData.instagram,
                      key: "instagram",
                    },
                    {
                      icon: Linkedin,
                      label: "LinkedIn",
                      value: formData.linkedin,
                      key: "linkedin",
                    },
                    {
                      icon: Twitter,
                      label: "Twitter / X",
                      value: formData.twitter,
                      key: "twitter",
                    },
                    {
                      icon: Youtube,
                      label: "YouTube",
                      value: formData.youtube,
                      key: "youtube",
                    },
                    {
                      icon: MessageCircle,
                      label: "WhatsApp",
                      value: formData.whatsapp,
                      key: "whatsapp",
                    },
                    {
                      icon: Video,
                      label: "TikTok",
                      value: formData.tiktok,
                      key: "tiktok",
                    },
                  ].map((item) => (
                    <div key={item.key} className="relative group">
                      <item.icon className="absolute left-3 top-3 h-4 w-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                      <Input
                        className="pl-10 border-white/10 focus-visible:ring-emerald-500 bg-white/5 h-10 text-white placeholder:text-gray-600"
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

          <DialogFooter className="p-6 border-t border-white/10 bg-[#1e293b]/50">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="border-white/10 hover:bg-white/10 text-gray-300 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[140px] border-none"
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}