"use client"

import { useState } from 'react'
import Image from 'next/image'
import NavBar from '@/components/navBar'
import { motion } from 'framer-motion'
import InteractiveCursor from '@/components/interactiveCursor'
import { Notable } from "next/font/google"

const notable = Notable({
  weight: '400',
  subsets: ['latin'],
})

export default function YuvanPage() {
  return (
    <div className="h-screen overflow-hidden bg-black cursor-none">
      <NavBar />
      <InteractiveCursor />
      
      <div className="relative w-full h-full">
        <Image
          src="/u1back.png"  // Add your U1 banner image
          alt="U1 Musical Night"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className={`text-4xl md:text-6xl lg:text-7xl text-white mb-6 ${notable.className}`}>
              U1 Musical Night
            </h1>
            <p className="text-white/90 text-xl md:text-2xl mb-8">
              A Magical Evening with Yuvan Shankar Raja
            </p>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 max-w-2xl mx-auto">
                <p className="text-red-500 text-xl font-bold mb-4">
                  Limited Seats Available!!!
                </p>
                <div className="text-white space-y-2">
                  <p>📅 Date: March 1, 2025</p>
                  <p>⏰ Time: 6:00 PM</p>
                  <p>📍 Venue: CIT Main Ground</p>
                </div>
              </div>
              <button 
                onClick={() => window.open('/register', '_self')}
                className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-bold
                hover:bg-green-600 transition-colors cursor-none"
              >
                Register Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}