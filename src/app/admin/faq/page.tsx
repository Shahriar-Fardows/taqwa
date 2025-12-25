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
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  Loader2,
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react"

// --- TYPES ---
interface FAQItem {
  _id: string
  question: string
  answer: string
  category: string
  isActive: boolean
  createdAt: string
}

// --- INITIAL STATE ---
const initialFormState = {
  question: "",
  answer: "",
  category: "General",
  isActive: true
}

export default function FAQAdmin() {
  // Data States
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  
  // View State
  const [view, setView] = useState<"list" | "form">("list")
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  // Form State
  const [formData, setFormData] = useState(initialFormState)
  const [searchTerm, setSearchTerm] = useState("")

  // --- 1. FETCH DATA ---
  const fetchFAQs = async () => {
    try {
      setIsDataLoading(true)
      const res = await axios.get("/api/faq")
      if (res.data.success) {
        setFaqs(res.data.data)
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error)
    } finally {
      setIsDataLoading(false)
    }
  }

  useEffect(() => {
    fetchFAQs()
  }, [])

  // --- 2. FORM HANDLERS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.question || !formData.answer) {
        Swal.fire("Required", "Question and Answer are required", "warning")
        return
    }

    setLoading(true)

    try {
      if (isEditing && editId) {
        // UPDATE
        const res = await axios.put("/api/faq", { id: editId, ...formData })
        if (res.data.success) {
            Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false })
            fetchFAQs()
        }
      } else {
        // CREATE
        const res = await axios.post("/api/faq", formData)
        if (res.data.success) {
            Swal.fire({ icon: 'success', title: 'Created!', timer: 1500, showConfirmButton: false })
            fetchFAQs()
        }
      }
      
      // Reset
      setView("list")
      setIsEditing(false)
      setFormData(initialFormState)

    } catch (error: any) {
      console.error(error)
      Swal.fire("Error", "Something went wrong", "error")
    } finally {
      setLoading(false)
    }
  }

  // --- 3. ACTIONS ---
  const handleEditClick = (item: FAQItem) => {
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
      isActive: item.isActive
    })
    setEditId(item._id)
    setIsEditing(true)
    setView("form")
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This FAQ will be deleted permanently.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await axios.delete("/api/faq", { data: { id } })
        setFaqs(prev => prev.filter(f => f._id !== id))
        Swal.fire('Deleted!', 'FAQ has been deleted.', 'success')
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete.', 'error')
      }
    }
  }

  const toggleActive = async (item: FAQItem) => {
    // Optimistic Update
    const updatedFaqs = faqs.map(f => f._id === item._id ? { ...f, isActive: !f.isActive } : f)
    setFaqs(updatedFaqs)

    try {
        await axios.put("/api/faq", {
            id: item._id,
            question: item.question,
            answer: item.answer,
            category: item.category,
            isActive: !item.isActive
        })
    } catch (error) {
        // Revert on error
        fetchFAQs()
        console.error("Toggle failed", error)
    }
  }

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ==========================
  // VIEW: FORM (CREATE/EDIT)
  // ==========================
  if (view === "form") {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => { setView("list"); setFormData(initialFormState); setIsEditing(false); }} className="gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to List
          </Button>
          <h2 className="text-2xl font-bold text-white">{isEditing ? "Edit FAQ" : "Create New FAQ"}</h2>
        </div>

        <Card className="bg-[#0f172a] border-white/10 shadow-2xl">
            <CardContent className="p-8 space-y-6">
                
                {/* Question */}
                <div className="space-y-2">
                    <Label className="text-gray-300">Question</Label>
                    <div className="relative">
                        <HelpCircle className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                        <Input 
                            value={formData.question} 
                            onChange={(e) => setFormData({...formData, question: e.target.value})} 
                            placeholder="e.g. How do I start a project?"
                            className="bg-[#1e293b] border-white/10 text-white pl-10 h-12 text-lg"
                        />
                    </div>
                </div>

                {/* Answer */}
                <div className="space-y-2">
                    <Label className="text-gray-300">Answer</Label>
                    <div className="relative">
                        <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                        <Textarea 
                            value={formData.answer} 
                            onChange={(e) => setFormData({...formData, answer: e.target.value})} 
                            placeholder="Detailed answer here..."
                            className="bg-[#1e293b] border-white/10 text-white pl-10 min-h-[150px] leading-relaxed"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div className="space-y-2">
                        <Label className="text-gray-300">Category</Label>
                        <Input 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})} 
                            placeholder="e.g. General, Pricing"
                            className="bg-[#1e293b] border-white/10 text-white"
                        />
                    </div>

                    {/* Active Status */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-gray-300">Status</Label>
                        <div className="flex items-center justify-between p-3 bg-[#1e293b] rounded-md border border-white/5">
                            <span className={`text-sm font-medium ${formData.isActive ? 'text-emerald-400' : 'text-gray-400'}`}>
                                {formData.isActive ? "Visible on website" : "Hidden (Draft)"}
                            </span>
                            <Switch 
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                                className="data-[state=checked]:bg-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                <Button onClick={handleSubmit} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-6 text-lg mt-4 shadow-lg shadow-emerald-500/20">
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    {isEditing ? "Update FAQ" : "Save FAQ"}
                </Button>

            </CardContent>
        </Card>
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
          <h1 className="text-3xl font-bold text-white tracking-tight">FAQ Manager</h1>
          <p className="text-gray-400 mt-1">Manage frequently asked questions for your support page.</p>
        </div>
        <Button 
          onClick={() => { setView("form"); setFormData(initialFormState); setIsEditing(false); }} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Question
        </Button>
      </div>

      {/* Search & Stats */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input 
                placeholder="Search questions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0f172a] border-white/10 pl-9 text-white focus:border-emerald-500"
            />
        </div>
      </div>

      {/* Content Area */}
      {isDataLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="text-center py-20 bg-[#0f172a] rounded-xl border border-white/5">
          <HelpCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No FAQs found.</p>
          <Button variant="outline" onClick={() => setView("form")}>Create First FAQ</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFaqs.map((faq) => (
            <Card key={faq._id} className={`bg-[#0f172a] border transition-all duration-300 ${faq.isActive ? 'border-white/10' : 'border-red-900/30 opacity-75'}`}>
              <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start">
                
                {/* Icon & Status */}
                <div className="shrink-0 flex flex-col items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${faq.isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-800 text-gray-500'}`}>
                        <HelpCircle className="h-5 w-5" />
                    </div>
                    <Switch 
                        checked={faq.isActive}
                        onCheckedChange={() => toggleActive(faq)}
                        className="scale-75 data-[state=checked]:bg-emerald-500"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-gray-400 border border-white/5">
                            {faq.category}
                        </span>
                        {!faq.isActive && <span className="text-xs text-red-400 flex items-center gap-1"><XCircle className="h-3 w-3"/> Hidden</span>}
                        {faq.isActive && <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Active</span>}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0">
                    <Button size="icon" variant="ghost" onClick={() => handleEditClick(faq)} className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(faq._id)} className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}