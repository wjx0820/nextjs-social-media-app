import type { Metadata } from "next"
import localFont from "next/font/local"

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { ThemeProvider } from "next-themes"
import { extractRouterConfig } from "uploadthing/server"

import { Toaster } from "@/components/ui/toaster"

import { fileRouter } from "./api/uploadthing/core"

import "./globals.css"

import ReactQueryProvider from "./ReactQueryProvider"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    template: "%s | bugbook",
    default: "bugbook",
  },
  description: "The social media app for powernerds",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  )
}
