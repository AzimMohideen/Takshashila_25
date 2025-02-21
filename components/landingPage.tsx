"use client"
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AboutUs from '../components/aboutUs';
import NavBar from '../components/navBar';
import Footer from '../components/footer';
import LocomotiveScrollProvider from '@/components/locomotiveScroll';
import InteractiveCursor from '@/components/interactiveCursor';
import Contact from '@/components/contact';
import MainSection from '@/components/mainSection';
import EventRoller from './eventRoller';
import CountdownSection from './countdownSection';
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

  useEffect(() => {
    setIsMobileView(isMobile || window.innerWidth < 768);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
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
      clearTimeout(timer);
    };
  }, []);


  // Shared content between both mobile and desktop views
  const pageContent = (
    <>
      <div className="relative z-10">
        <MainSection />
      </div>
      
      <div className="relative z-20">
        <AboutUs />
        <EventRoller/>
        <Contact />
        <CountdownSection />
        <Footer />
      </div>
    </>
  );

  return (
    <div className={isMobileView ? "" : "cursor-none"}>
      {!isMobileView && <InteractiveCursor />}
      
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