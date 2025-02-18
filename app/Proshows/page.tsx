"use client"

import { useState } from 'react'
import Image from 'next/image'
import NavBar from '@/components/navBar'
import { motion } from 'framer-motion'
import InteractiveCursor from '@/components/interactiveCursor'
import Footer from '@/components/footer'

interface ProShow {
  id: number
  title: string
  artist: string
  date: string
  time: string
  venue: string
  image: string
  description: string
}

const proshows: ProShow[] = [
  {
    id: 1,
    title: "DJ Night",
    artist: "DJ Artist Name",
    date: "Day 1",
    time: "7:00 PM",
    venue: "Main Ground",
    image: "/images/proshows/dj-night.jpg",
    description: "Get ready for an electrifying night of music and dance with our spectacular DJ performance."
  },
  {
    id: 2,
    title: "Band Performance",
    artist: "Band Name",
    date: "Day 2",
    time: "6:30 PM",
    venue: "Auditorium",
    image: "/images/proshows/band.jpg",
    description: "Experience the magic of live music with an amazing performance by one of India's top bands."
  },
  // Add more shows as needed
]

export default function ProShows() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#004225] to-[#004225] cursor-none">
      <NavBar />
      <InteractiveCursor />
      
      <main className="container mx-auto px-4 py-24">
        <h1 className="text-5xl font-bold text-center text-white mb-16">
          Pro Shows
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proshows.map((show) => (
            <motion.div
              key={show.id}
              className="relative group cursor-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onHoverStart={() => setHoveredCard(show.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                {/* Background Image */}
                <Image
                  src={show.image}
                  alt={show.title}
                  fill
                  className="object-cover"
                />
                
                {/* Title and Basic Info - Always Visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {show.title}
                  </h3>
                  <p className="text-xl text-white/80">
                    {show.artist}
                  </p>
                </div>

                {/* Sliding Description - Now slides from left to right */}
                <motion.div
                  className="absolute inset-0 bg-black/80 p-6 flex flex-col justify-center"
                  initial={{ x: '-100%' }}
                  animate={{ 
                    x: hoveredCard === show.id ? 0 : '-100%'
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="space-y-4 text-white">
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4">📅</span> {show.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4">⏰</span> {show.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4">📍</span> {show.venue}
                      </p>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {show.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
          
        </div>
      </main>
      <Footer />
    </div>
  )
}
