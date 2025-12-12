"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, Phone, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Dynamic menu links
const menuLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
]

export function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen)
  const closeDrawer = () => setIsDrawerOpen(false)

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-foreground">
            Logo
          </Link>

          {/* Desktop Menu Links */}
          <div className="hidden items-center gap-6 md:flex">
            {menuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact Button */}
          <div className="hidden md:block">
            <Button asChild>
              <a href="tel:+8801712345678" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Us
              </a>
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button onClick={toggleDrawer} className="md:hidden rounded-md p-2 hover:bg-accent" aria-label="Toggle menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={closeDrawer} />}

      {/* Mobile Drawer - Slides from Right */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[280px] bg-background shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          isDrawerOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={closeDrawer} className="rounded-md p-2 hover:bg-accent" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Menu Links */}
        <div className="flex flex-col gap-1 p-4">
          {menuLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeDrawer}
              className="rounded-md px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Drawer Contact Button */}
        <div className="absolute bottom-6 left-4 right-4">
          <Button asChild className="w-full">
            <a href="tel:+8801712345678" className="flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Call: +880 1712-345678</span>
            </a>
          </Button>
        </div>
      </div>
    </>
  )
}
