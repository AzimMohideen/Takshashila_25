"use client"

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const MainSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/footage/landingscreen.mov" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Animated Text Content */}
      <motion.div 
        className="absolute flex items-center justify-center w-full h-full"
        initial={{ 
          opacity: 0, 
          scale: 0.3,
          y: 100
        }}
        animate={{ 
          opacity: progress / 100, 
          scale: 0.3 + (progress / 100) * 0.7,
          y: 100 - progress
        }}
        transition={{ 
          duration: 0.5,
          ease: "linear"
        }}
      >
        <div className="w-fit h-fit">
          <Image 
            src="/tk25-text.svg" 
            alt="Takshashila Text" 
            width={600} 
            height={150} 
            priority
            className="relative z-10 transition-transform duration-700 ease-in-out hover:scale-115"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default MainSection;
