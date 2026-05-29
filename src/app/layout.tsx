import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Providers from "@/components/Providers"
import Navbar from "@/components/Navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "DomainBuddy — Find & Register Your Perfect Domain",
  description:
    "Search domain names, get AI-powered suggestions, and register domains through trusted partners.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-black text-white">
        <span style={{ display: "none" }}>
          Impact-Site-Verification: 53b8bfe3-3dd1-434f-9592-1f212631a0ff
        </span>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
