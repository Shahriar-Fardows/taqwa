"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Save,
  Upload,
  Pencil,
  Loader2,
  Plus,
  X,
  Briefcase,
  Sparkles,
  Users,
  Trash2,
  Linkedin,
  Twitter,
  Facebook,
  Github,
  Globe,
  Instagram,
  Youtube,
  Link as LinkIcon,
} from "lucide-react"

// --- Interfaces ---

interface SocialLink {
  id: string
  platform: string 
  url: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  image: string
  bio: string
  socials: SocialLink[]
}

interface Experience {
  id: string
  role: string
  company: string
  year: string
  description: string
}

interface AboutData {
  _id?: string
  name: string
  designation: string
  tagline: string
  description: string
  imageUrl: string
  skills: string[]
  experiences: Experience[]
  team: TeamMember[]
}

// --- Default/Initial State ---
const initialData: AboutData = {
  name: "",
  designation: "",
  tagline: "",
  description: "",
  imageUrl: "",
  skills: [],
  experiences: [],
  team: []
}

// --- PREDEFINED SOCIAL PLATFORMS ---
const SOCIAL_OPTIONS = [
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "twitter", label: "Twitter / X", icon: Twitter },
  { value: "github", label: "GitHub", icon: Github },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "website", label: "Website", icon: Globe },
  { value: "other", label: "Other", icon: LinkIcon },
];

// --- Helper: Get Icon ---
const getSocialIcon = (platform: string) => {
  const p = platform ? platform.toLowerCase().trim() : "other";
  const found = SOCIAL_OPTIONS.find(opt => opt.value === p);
  if (found) {
    const Icon = found.icon;
    return <Icon className="h-4 w-4" />;
  }
  return <LinkIcon className="h-4 w-4" />;
}

export default function AdminAbout() {
  const [loading, setLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [aboutData, setAboutData] = useState<AboutData>(initialData)
  
  const [newSkill, setNewSkill] = useState("")

  const API_URL = "/api/about"

  // --- Fetch Data ---
  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      setIsDataLoading(true)
      const res = await axios.get(API_URL)
      if (res.data) {
        setAboutData({ ...initialData, ...res.data })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // --- UPDATED: Server-side Upload Handler ---
  // এটি এখন সরাসরি Cloudinary তে না পাঠিয়ে আপনার /api/upload/image এ পাঠাবে
  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append("file", file)

      // Call our own Next.js API
      const res = await axios.post("/api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (res.data.success) {
        return res.data.url
      }
      return null
    } catch (err) {
      console.error("Upload failed:", err)
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not upload image via server.",
        background: "#1e293b",
        color: "#fff"
      })
      return null
    }
  }

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setAboutData((prev) => ({ ...prev, [id]: value }))
  }

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadToCloudinary(file)
    if (url) setAboutData((prev) => ({ ...prev, imageUrl: url }))
  }

  // Skills
  const addSkill = () => {
    if (newSkill.trim() && !aboutData.skills.includes(newSkill)) {
      setAboutData((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }))
      setNewSkill("")
    }
  }
  const removeSkill = (skill: string) => {
    setAboutData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }))
  }

  // Experience
  const addExperience = () => {
    const newExp: Experience = { id: Date.now().toString(), role: "", company: "", year: "", description: "" }
    setAboutData(prev => ({ ...prev, experiences: [...prev.experiences, newExp] }))
  }
  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setAboutData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }))
  }
  const removeExperience = (id: string) => {
    setAboutData(prev => ({ ...prev, experiences: prev.experiences.filter(exp => exp.id !== id) }))
  }

  // --- Team Logic ---
  const addTeamMember = () => {
    const newMember: TeamMember = { 
      id: Date.now().toString(), 
      name: "", role: "", image: "", bio: "", 
      socials: [] 
    }
    setAboutData(prev => ({ ...prev, team: [...prev.team, newMember] }))
  }
  
  const updateTeamMember = (id: string, field: keyof TeamMember, value: string) => {
    setAboutData(prev => ({
      ...prev,
      team: prev.team.map(member => member.id === id ? { ...member, [field]: value } : member)
    }))
  }

  const handleTeamImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadToCloudinary(file)
    if (url) updateTeamMember(id, "image", url)
  }

  const removeTeamMember = (id: string) => {
    setAboutData(prev => ({ ...prev, team: prev.team.filter(t => t.id !== id) }))
  }

  // Social Link Logic
  const addSocialLink = (memberId: string) => {
    setAboutData(prev => ({
      ...prev,
      team: prev.team.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            socials: [...member.socials, { id: Date.now().toString(), platform: "facebook", url: "" }]
          }
        }
        return member
      })
    }))
  }

  const updateSocialLink = (memberId: string, linkId: string, field: keyof SocialLink, value: string) => {
    setAboutData(prev => ({
      ...prev,
      team: prev.team.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            socials: member.socials.map(link => link.id === linkId ? { ...link, [field]: value } : link)
          }
        }
        return member
      })
    }))
  }

  const removeSocialLink = (memberId: string, linkId: string) => {
    setAboutData(prev => ({
      ...prev,
      team: prev.team.map(member => {
        if (member.id === memberId) {
          return { ...member, socials: member.socials.filter(link => link.id !== linkId) }
        }
        return member
      })
    }))
  }

  // --- Save ---
  const handleSave = async () => {
    setLoading(true)
    try {
      await axios.put(API_URL, aboutData)
      
      Swal.fire({
        icon: "success",
        title: "Saved Successfully",
        text: "Your data has been updated.",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#10b981",
        timer: 1500,
        showConfirmButton: false,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Save error:", error)
      Swal.fire({ icon: "error", title: "Error", text: "Failed to save data. Check console.", background: "#1e293b", color: "#fff" })
    } finally {
      setLoading(false)
    }
  }

  if (isDataLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
    </div>
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-white min-h-screen pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">About & Team</h1>
          <p className="text-gray-400 max-w-md leading-relaxed">
            Manage your personal bio, professional experience, and team members.
          </p>
        </div>
        
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-xl px-6 py-5 shadow-lg shadow-emerald-500/20"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit Content
          </Button>
        )}
      </div>

      {/* --- TOP SECTION: Profile, Bio, Experience (Grid Layout) --- */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Left: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="rounded-xl border border-white/5 bg-white/5 shadow-none overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className={`w-48 h-48 rounded-2xl overflow-hidden border-4 border-emerald-500/20 shadow-2xl bg-[#0f172a]`}>
                  {aboutData.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={aboutData.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                  )}
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                      <Upload className="h-8 w-8 text-white mb-2" />
                      <span className="text-xs text-white font-medium">Change Photo</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                    </label>
                  )}
                </div>
              </div>
              {!isEditing && (
                <div className="mt-4 space-y-2">
                  <h2 className="text-2xl font-bold text-white">{aboutData.name || "Your Name"}</h2>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
                    <Briefcase className="w-3 h-3 mr-2" />
                    {aboutData.designation || "Designation"}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Bio & Experience */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Bio & Skills */}
          <Card className="rounded-xl border border-white/5 bg-white/5 shadow-none">
            <CardHeader className="border-b border-white/10 p-6">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-500" />
                    Personal Information
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {isEditing ? (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Full Name</Label>
                      <Input id="name" value={aboutData.name} onChange={handleInputChange} className="bg-[#0f172a] border-white/10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Designation</Label>
                      <Input id="designation" value={aboutData.designation} onChange={handleInputChange} className="bg-[#0f172a] border-white/10 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                      <Label className="text-gray-300">Tagline</Label>
                      <Input id="tagline" value={aboutData.tagline} onChange={handleInputChange} className="bg-[#0f172a] border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">About Description</Label>
                    <Textarea id="description" rows={5} value={aboutData.description} onChange={handleInputChange} className="bg-[#0f172a] border-white/10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-gray-300">Skills</Label>
                    <div className="flex gap-2">
                        <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} placeholder="Add skill" className="bg-[#0f172a] border-white/10 text-white" />
                        <Button type="button" onClick={addSkill} className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white"><Plus className="h-5 w-5" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {aboutData.skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2 bg-[#0f172a] border border-white/10 px-3 py-1 rounded-lg">
                                <span className="text-sm text-gray-300">{skill}</span>
                                <button type="button" onClick={() => removeSkill(skill)} className="text-gray-500 hover:text-red-400"><X className="h-3 w-3" /></button>
                            </div>
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="prose prose-invert max-w-none">
                   <p className="text-gray-300 whitespace-pre-wrap">{aboutData.description}</p>
                   <div className="flex flex-wrap gap-3 mt-4">
                      {aboutData.skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm border border-emerald-500/20">{skill}</span>
                      ))}
                   </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="rounded-xl border border-white/5 bg-white/5 shadow-none">
            <CardHeader className="border-b border-white/10 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-emerald-500" />
                    Experience
                </CardTitle>
                {isEditing && <Button size="sm" onClick={addExperience} className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"><Plus className="h-4 w-4 mr-1"/> Add</Button>}
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {aboutData.experiences.map((exp) => (
                <div key={exp.id} className="relative border-l-2 border-white/10 pl-6 pb-6 last:pb-0">
                  {isEditing ? (
                    <div className="space-y-3 bg-[#0f172a]/50 p-4 rounded-lg border border-white/5">
                        <div className="flex justify-end"><button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4"/></button></div>
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Role" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="bg-[#0f172a] border-white/10 text-white"/>
                            <Input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="bg-[#0f172a] border-white/10 text-white"/>
                        </div>
                        <Input placeholder="Year" value={exp.year} onChange={(e) => updateExperience(exp.id, 'year', e.target.value)} className="bg-[#0f172a] border-white/10 text-white"/>
                        <Textarea placeholder="Description" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} className="bg-[#0f172a] border-white/10 text-white h-20"/>
                    </div>
                  ) : (
                    <>
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#0f172a]" />
                      <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                      <p className="text-emerald-400 text-sm mb-2">{exp.company} • {exp.year}</p>
                      <p className="text-gray-400 text-sm">{exp.description}</p>
                    </>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- BOTTOM SECTION: Team Members (Full Width) --- */}
      <div className="mt-8">
        <Card className="rounded-xl border border-white/5 bg-white/5 shadow-none w-full">
            <CardHeader className="border-b border-white/10 p-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-500" />
                  Meet The Team
              </CardTitle>
              {isEditing && <Button size="sm" onClick={addTeamMember} className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white"><Plus className="h-4 w-4 mr-1"/> Add Member</Button>}
          </CardHeader>
          <CardContent className="p-8">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {aboutData.team.length === 0 && <p className="text-gray-500 text-sm col-span-full text-center">No team members yet.</p>}

                {aboutData.team.map((member) => (
                  <div key={member.id} className="bg-[#0f172a]/50 border border-white/10 rounded-xl p-5 flex flex-col gap-4 h-full">
                      {isEditing ? (
                        /* --- Team Member Edit Mode --- */
                        <>
                            <div className="flex items-start gap-4">
                              <div className="relative w-16 h-16 shrink-0 bg-black/20 rounded-full overflow-hidden border border-white/10 cursor-pointer group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={member.image || "/placeholder.png"} alt="Team" className="w-full h-full object-cover" />
                                  <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer text-white">
                                      <Upload className="h-4 w-4"/>
                                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleTeamImageUpload(member.id, e)} />
                                  </label>
                              </div>
                              <div className="flex-1 min-w-0">
                                  <button onClick={() => removeTeamMember(member.id)} className="float-right text-red-400 hover:text-red-300 ml-2"><Trash2 className="h-4 w-4"/></button>
                                  <div className="space-y-2">
                                    <Input placeholder="Name" value={member.name} onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)} className="h-8 bg-[#0f172a] border-white/10 text-white text-sm"/>
                                    <Input placeholder="Role" value={member.role} onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)} className="h-8 bg-[#0f172a] border-white/10 text-white text-sm"/>
                                  </div>
                              </div>
                            </div>
                            <Textarea placeholder="Bio" value={member.bio} onChange={(e) => updateTeamMember(member.id, 'bio', e.target.value)} className="bg-[#0f172a] border-white/10 text-white text-xs h-20"/>
                            
                            {/* --- UPDATED Dynamic Social Links Edit with Select --- */}
                            <div className="space-y-2">
                              <Label className="text-xs text-emerald-500 uppercase font-semibold">Social Links</Label>
                              {member.socials.map((link) => (
                                <div key={link.id} className="flex gap-2 items-center">
                                  
                                  {/* ICON SELECT DROPDOWN */}
                                  <div className="relative w-1/3">
                                      <select
                                        value={link.platform}
                                        onChange={(e) => updateSocialLink(member.id, link.id, 'platform', e.target.value)}
                                        className="h-7 w-full text-xs bg-[#0f172a] border border-white/10 text-white rounded px-2 appearance-none cursor-pointer focus:outline-none focus:border-emerald-500"
                                      >
                                        <option value="" disabled>Icon</option>
                                        {SOCIAL_OPTIONS.map((opt) => (
                                          <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                          </option>
                                        ))}
                                      </select>
                                      {/* Visual Icon Hint inside select */}
                                      <div className="absolute right-2 top-1.5 pointer-events-none text-emerald-500">
                                         {getSocialIcon(link.platform)}
                                      </div>
                                  </div>

                                  <Input placeholder="https://..." value={link.url} onChange={(e) => updateSocialLink(member.id, link.id, 'url', e.target.value)} className="h-7 flex-1 text-xs bg-[#0f172a] border-white/10 text-white"/>
                                  <button onClick={() => removeSocialLink(member.id, link.id)} className="text-red-400 hover:bg-white/5 rounded p-1"><X className="h-3 w-3"/></button>
                                </div>
                              ))}
                              
                              <Button size="sm" variant="outline" onClick={() => addSocialLink(member.id)} className="w-full h-7 text-xs border-dashed border-white/20 hover:bg-white/5 text-gray-400">
                                <Plus className="h-3 w-3 mr-1"/> Add Link
                              </Button>
                            </div>
                        </>
                      ) : (
                        /* --- Team Member View Mode --- */
                        <div className="text-center flex flex-col items-center flex-1">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500/20 mb-4 shadow-lg">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={member.image || "https://github.com/shadcn.png"} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="font-bold text-white text-lg">{member.name}</h4>
                            <p className="text-emerald-500 text-sm mb-3 uppercase tracking-wide font-medium">{member.role}</p>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">{member.bio}</p>
                            
                            <div className="mt-auto flex gap-3 justify-center flex-wrap">
                                {member.socials.map((link) => (
                                  <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 text-gray-400 hover:bg-emerald-500 hover:text-white transition-all group" title={link.platform}>
                                    {getSocialIcon(link.platform)}
                                  </a>
                                ))}
                            </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button (Fixed Bottom) */}
      {isEditing && (
          <div className="flex gap-4 pt-4 border-t border-white/10 sticky bottom-6 bg-[#0f172a]/95 backdrop-blur p-4 rounded-xl border border-white/10 shadow-2xl z-10 w-full max-w-4xl mx-auto">
            <Button onClick={handleSave} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save All Changes
            </Button>
            <Button onClick={() => { setIsEditing(false); fetchAboutData(); }} variant="outline" className="border-white/10 bg-transparent text-gray-400 hover:bg-white/5 hover:text-white">
                Cancel
            </Button>
        </div>
      )}
    </div>
  )
}