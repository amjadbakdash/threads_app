import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import React from "react"
import type { Metadata } from "next";
import "../globals.css"

export const metadata:
    Metadata = {
    title: "Threads",
    description: "A Next.js 15 Meta Threads Application"
}

const inter = Inter({ subsets: ['latin'] })


export default function rootLayout({ children }
    : Readonly<{ children: React.ReactNode; }>) {

    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter} bg-dark-1`}>
                    <div className="w-full flex justify-center items-center min-h-screen">
                        {children}
                    </div>
                </body>
            </html>
        </ClerkProvider>
    )
}