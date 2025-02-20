"use client"

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const MainSection = () => {
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  return (
    <section className="relative h-screen flex items-center justify-center">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/footage/landingscreen.mov" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-40"></div>
      </div>

      {/* Animated Text Content */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div 
            className="absolute flex items-center justify-center w-full h-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="w-fit h-fit">
              <Image 
                src="/tk25-text.png" 
                alt="Takshashila Text" 
                width={600} 
                height={150} 
                priority
                className="relative z-10 transition-transform duration-800 ease-in-out hover:scale-115"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MainSection;
