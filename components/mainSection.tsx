"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";
import { FaVolumeMute, FaVolumeUp, FaRedo } from "react-icons/fa";

const MainSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  const videoSrc = isMobile ? "/footage/landingscreen_mob.mov" : "https://TEAMCELESTIUS.github.io/Takshashila_25/public/footage/tklife1.mp4";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasPlayed) return;

    const handleTimeUpdate = () => {
      if (isMobile) {
        setProgress(100);
      } else {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const handleVideoEnd = () => {
      setHasPlayed(true); // Mark as played
      video.pause();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleVideoEnd);

    // Set initial progress for mobile
    if (isMobile) {
      setProgress(100);
    }

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, [hasPlayed]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const replayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setHasPlayed(false);
      setProgress(0);
    }
  };

  // Calculate animation values
  const finalScale = 1;
  const finalY = 0;
  const currentScale = isMobile
    ? finalScale
    : progress >= 100
    ? finalScale
    : 0.3 + (Math.min(progress, 100) / 100) * 0.7;
  const currentY = isMobile ? finalY : progress >= 100 ? finalY : 100 - Math.min(progress, 100);

  return (
    <section className={`relative h-screen flex items-center justify-center overflow-hidden ${isMobile ? "touch-auto" : ""}`}>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          playsInline
          loop={false} // Play only once
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc}
        />
        <div className="absolute inset-0 bg-black opacity-40"></div>

        {/* Controls: Replay & Mute */}
        <div className="absolute bottom-4 right-4 z-50 flex gap-3">
          {/* Replay Button */}
          <button
            onClick={replayVideo}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300 text-white"
          >
            <FaRedo size={20} />
          </button>

          {/* Mute/Unmute Button */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300 text-white"
          >
            {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </button>
        </div>
      </div>

      {/* Animated Text Content */}
      <motion.div
        className="absolute flex items-center justify-center w-full h-full"
        initial={{
          opacity: 0,
          scale: 0.3,
          y: 100,
        }}
        animate={{
          opacity: Math.min(1, progress / 50),
          scale: currentScale,
          y: currentY,
        }}
        transition={{
          duration: 0.5,
          ease: "linear",
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
