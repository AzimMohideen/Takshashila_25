"use client"
import { useEffect, useState, Suspense } from 'react';
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

// Loading component
const LoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-[#004225] via-[#013220] to-[#002616]">
    <div className="animate-pulse">Loading...</div>
  </div>
);

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    // Preload critical assets
    const preloadAssets = async () => {
      const videoElement = new Image();
      videoElement.src = isMobile ? '/TK_EDIT_ROZX.mp4' : '/TK_EDIT_ROZX.mp4';
    };

    preloadAssets();
    setVideoSrc(isMobile ? '/TK_EDIT_ROZX.mp4' : '/TK_EDIT_ROZX.mp4');

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const mainSection = document.querySelector('section');
      
      if (mainSection) {
        const mainSectionHeight = mainSection.offsetHeight;
        setShowNav(scrollPosition <= mainSectionHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const content = (
    <div 
      className="relative min-h-screen"
      style={{
        background: 'linear-gradient(to bottom, #004225 0%, #013220 50%, #002616 100%)',
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative">
        <div className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          showNav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}>
          <NavBar />
        </div>

        <div className="flex flex-col" data-scroll-container>
          <div className="relative z-10">
            <Suspense fallback={<LoadingFallback />}>
              <MainSection />
            </Suspense>
          </div>
          
          <div className="relative z-20">
            <Suspense fallback={<LoadingFallback />}>
              <AboutUs />
              <EventRoller/>
              <Contact />
              <CountdownSection />
              <Footer />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cursor-none">
      {!isMobile && <InteractiveCursor />}
      {isMobile ? content : (
        <LocomotiveScrollProvider>
          {content}
        </LocomotiveScrollProvider>
      )}
    </div>
  );
}