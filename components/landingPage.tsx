"use client"
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AboutUs from '../components/aboutUs';
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import LocomotiveScrollProvider from '@/components/locomotiveScroll';
import InteractiveCursor from '@/components/interactiveCursor';
import Contact from '@/components/contact';
import MainSection from '@/components/mainSection';
import EventRoller from './eventRoller';
import CountdownSection from './countdownSection';
import SponsorSlider from './SponsorSlider';
import { isMobile } from 'react-device-detect';

// Enhanced loading component
const LoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#004225] via-[#013220] to-[#002616]">
    <div className="text-white text-xl animate-pulse font-lexend">Loading...</div>
  </div>
);

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setIsMobileView(isMobile || window.innerWidth < 768);
    
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    // Show popup after 5 seconds
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const mainSection = document.querySelector('section');
      
      if (mainSection) {
        const mainSectionHeight = mainSection.offsetHeight;
        setShowNav(scrollPosition <= mainSectionHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(loadingTimer);
      clearTimeout(popupTimer);
    };
  }, []);

  // Add the Popup component
  const Popup = () => (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            transition: {
              duration: 1,
              ease: [0.16, 1, 0.3, 1]
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8,
            transition: { duration: 0.5 }
          }}
          className="fixed inset-0 bg-black/80 z-[150] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowPopup(false)}
        >
          <motion.div 
            className="relative bg-black/90 rounded-lg max-w-4xl w-full"
            initial={{ y: 50 }}
            animate={{ 
              y: 0,
              transition: {
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1]
              }
            }}
            exit={{ y: 50 }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 z-[151] 
              hover:bg-red-600 transition-colors cursor-pointer"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>

            {/* Image Container */}
            <motion.div 
              className="relative aspect-video"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                transition: {
                  duration: 0.5,
                  delay: 0.4
                }
              }}
            >
              <Image
                src="/U1CONCERT.png"
                alt="U1 Concert Announcement"
                fill
                className="object-contain rounded-lg"
                priority
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Shared content between both mobile and desktop views
  const pageContent = (
    <>
      <div className="relative z-10">
        <MainSection />
      </div>
      
      <div className="relative z-20">
        <AboutUs />
        <EventRoller/>
        <SponsorSlider />
        <Contact />
        <CountdownSection />
        <Footer />
      </div>
    </>
  );

  return (
    <div className={isMobileView ? "" : "cursor-none"}>
      {!isMobileView && <InteractiveCursor />}
      <Popup /> {/* Add the Popup component here */}
      
      <div 
        className="relative min-h-screen overflow-y-auto"
        style={{
          background: 'linear-gradient(to bottom, #004225 0%, #013220 50%, #002616 100%)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative">
          <div className={`fixed w-full top-0 z-50 transition-all duration-500 ${
            showNav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
          }`}>
            <NavBar />
          </div>

          {isMobileView ? (
            <div className="flex flex-col">
              {pageContent}
            </div>
          ) : (
            <LocomotiveScrollProvider>
              <div className="flex flex-col" data-scroll-container>
                {pageContent}
              </div>
            </LocomotiveScrollProvider>
          )}
        </div>
      </div>
    </div>
  );
}