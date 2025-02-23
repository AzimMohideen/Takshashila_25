"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import NavBar from '@/components/navBar'
import { motion, AnimatePresence } from 'framer-motion'
import InteractiveCursor from '@/components/interactiveCursor'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Notable } from "next/font/google"
import { Oleo_Script } from "next/font/google"

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
    title: "CIT Icons Digital Awards - Edition 2",
    artist: "CIDA",
    date: "February 26,2025",
    time: "7:00 PM",
    venue: "Main Ground",
    image: "/cida.png",
    description: "Get ready for an electrifying night of music and dance with our spectacular DJ performance."
  },
  {
    id: 2,
    title: "U1 Musical Night",
    artist: "Yuvan Shankar Raja",
    date: "February 27,2025",
    time: "7:00 PM",
    venue: "Main Ground",
    image: "/u1back.png",
    description: "Get ready for an electrifying night of music with Yuvan Shankar Raja."
  },
  {
    id: 3,
    title: "DJ Night",
    artist: "DJ Suman",
    date: "February 28,2025",
    time: "7:00 PM",
    venue: "Main Ground",
    image: "/IEDMF FEST.jpg",
    description: "A celebration of culture and tradition through music, dance, and performances."
  },
  {
    id: 4,
    title: "Euphonic Originals",
    artist: "Various Artists from CIT",
    date: "February 28,2025",
    time: "7:00 PM",
    venue: "Main Ground",
    image: "/Euphonic Originals.png",
    description: "Experience the musical talent of CIT as our own students take the stage for an unforgettable live performance. Featuring original compositions and creative renditions by CIT's finest singers and musicians."
  }
]

const notable = Notable({
  weight: '400',
  subsets: ['latin'],
})

const oleoScript = Oleo_Script({
  weight: '400',
  subsets: ['latin'],
})

export default function ProShows() {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0])
  const [isAnimating, setIsAnimating] = useState(false)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex(prev => {
      const nextIndex = prev[0] + newDirection
      if (nextIndex < 0) return [proshows.length - 1, newDirection]
      if (nextIndex >= proshows.length) return [0, newDirection]
      return [nextIndex, newDirection]
    })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") paginate(-1)
      if (e.key === "ArrowRight") paginate(1)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  })

  // Auto-advance effect
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1)
    }, 5000)
    return () => clearInterval(timer)
  }, )

  const currentShow = proshows[currentIndex]

  return (
    <div className="h-screen overflow-hidden bg-black cursor-none">
      <NavBar />
      <InteractiveCursor />
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-24 left-0 right-0 z-10 text-center px-4"
      >
        <h1 className={`text-5xl md:text-6xl font-bold text-white mb-4 ${notable.className} 
          drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] 
          [text-shadow:0_4px_8px_rgba(0,0,0,0.8),0_2px_2px_rgba(0,0,0,0.6),0_-1px_3px_rgba(255,255,255,0.15)]`}>
          Pro Shows
        </h1>
        <div className="inline-block bg-black/50 backdrop-blur-md px-8 py-3 rounded-full border border-white/20 shadow-lg">
          <p className="text-white text-xl font-semibold tracking-wide">
            Exclusive Entertainment only for CITians!! <span className="text-red-500 font-bold">Other college students are not allowed.</span>
          </p>
        </div>
      </motion.div>
      
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
            onAnimationComplete={() => setIsAnimating(false)}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={currentShow.image}
                alt={currentShow.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 lg:p-24">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-4xl"
              >
                <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 ${oleoScript.className}`}>
                  {currentShow.title}
                </h1>
                <h2 className="text-2xl md:text-3xl text-white/80 mb-6">
                  {currentShow.artist}
                </h2>
                <div className="flex flex-wrap gap-6 text-white/90 text-lg mb-8">
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5">📅</span> {currentShow.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5">⏰</span> {currentShow.time}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-5 h-5">📍</span> {currentShow.venue}
                  </p>
                </div>
                <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
                  {currentShow.description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors cursor-none"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="w-12 h-12" />
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors cursor-none"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="w-12 h-12" />
        </button>

        {/* Progress Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          {proshows.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex([index, index > currentIndex ? 1 : -1])}
              className={`w-3 h-3 rounded-full transition-all cursor-none
                ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}