"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import EventPopup from "./eventPopup"
import { Lobster } from "next/font/google"

// Initialize the Lobster font
const lobster = Lobster({
  weight: '400',
  subsets: ['latin'],
})

interface EventCardProps {
  title: string
  date: string
  
  image: string
  description: React.ReactNode
  rawDescription: string
  registrationLink: string
  category: string
  isVinylHovered: boolean
  onSelect?: (id: string, playerName: string) => boolean
}

export default function EventCard({
  title,
  date,
  image,
  description,
  rawDescription = '',
  registrationLink,
  category,
  isVinylHovered,
  onSelect,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const getZIndex = () => {
    if (isVinylHovered) {
      return 1
    } else {
      return isHovered ? 7 : 6
    }
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    const target = e.relatedTarget as HTMLElement | null;
    if (!target?.closest?.(".hover-content")) {
      setIsHovered(false);
    }
  };

  const handleClick = () => {
    setShowPopup(true);
  };

  // Function to create a truncated preview of the description
  const getPreviewDescription = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawDescription;
    const textContent = tempDiv.textContent || tempDiv.innerText;
    if (textContent.length <= 150) {
      return description;
    }
    
    // Create truncated preview
    const preview = textContent.substring(0, 150) + '...';
    return <div dangerouslySetInnerHTML={{ __html: preview }} />;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-[calc(100vw-2rem)] md:w-full h-[400px] md:h-[400px] lg:h-[400px] overflow-hidden rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-[1.02] mx-auto"
        style={{
          zIndex: getZIndex(),
          transition: "z-index 0.3s, transform 0.3s",
          maxWidth: "100%"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          priority
          style={{ 
            objectFit: "cover",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.3s"
          }}
          onLoad={() => setImageLoaded(true)}
          className="transition-transform duration-300 ease-in-out transform hover:scale-110"
        />
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-70 p-4 flex flex-col justify-between hover-content"
          style={{
            zIndex: isVinylHovered ? 1 : 7,
            paddingTop: "calc(2rem + 2.5em)",
          }}
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? 0 : "-100%" }}
          transition={{ duration: 0.3 }}
        >

          <div className="flex flex-col gap-2">
            <p className="text-white">{date}</p>
           
            <div className="text-white mt-2">
              {getPreviewDescription()}
            </div>
            {rawDescription.length > 150 && (
              <p className="text-gray-400 text-sm italic">Click to read more...</p>
            )}
          </div>
          <div className="mt-4">
            <button
              className="relative overflow-hidden group bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={(e) => {
                e.stopPropagation()
                setShowPopup(true)
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>

              <span className="absolute inset-0 rounded-lg">
                <span className="absolute inset-[-2px] rounded-lg overflow-hidden">
                  <span className="absolute inset-[-4px] bg-gradient-to-r from-emerald-400/0 via-emerald-400/70 to-emerald-400/0 animate-[border-move_2s_linear_infinite]"></span>
                </span>
              </span>

              <span className="inline-block relative z-10">
                {"VIEW MORE".split("").map((letter, index) => (
                  <motion.span
                    key={index}
                    className="letter inline-block"
                    initial={{ rotateX: 0, opacity: 1 }}
                    animate={{ rotateX: isHovered ? 360 : 0, opacity: 1 }}
                    transition={{ duration: 1.0, delay: index * 0.1 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </button>
          </div>
        </motion.div>
        <div
          className="absolute top-0 left-0 p-3 md:p-4 w-full bg-gradient-to-b from-black/70 to-transparent"
          style={{ zIndex: isVinylHovered ? 1 : 10 }}
        >
          <h3 className={`text-xl md:text-2xl font-bold line-clamp-2 ${lobster.className}`}
              style={{
                color: '#10b981', // emerald-500 color
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)' // adds a subtle shadow for better readability
              }}
          >
            {title}
          </h3>
        </div>
      </motion.div>

      {showPopup && (
        <EventPopup
          id={title}
          title={title}
          date={date}
          description={rawDescription}
          category={category}
          onClose={() => setShowPopup(false)}
          onSelect={onSelect}
          titleClassName={`${lobster.className} font-bold`}
          titleStyle={{
            color: '#10b981',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}
        />
      )}
    </>
  )
}

