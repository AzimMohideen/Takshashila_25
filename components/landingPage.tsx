"use client"
import AboutUs from '../components/aboutUs';
import NavBar from '../components/navBar';
import SponsorSlider from '../components/SponsorSlider';
import Footer from '../components/footer';
import LocomotiveScrollProvider from '@/components/locomotiveScroll';
import InteractiveCursor from '@/components/interactiveCursor';
import { useEffect, useState } from 'react';
import Contact from '@/components/contact';
import MainSection from '@/components/mainSection';
import EventRoller from './eventRoller';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="cursor-none">
      <InteractiveCursor />
      <LocomotiveScrollProvider>
        <div className="relative min-h-screen overflow-hidden">
          {/* Remove fixed background and blur effect */}
          
          <div className="relative z-20">
            <NavBar />
            <div className="flex flex-col min-h-screen" data-scroll-container>
              <MainSection />
              <div className="bg-[#050505]"> {/* Add black background container */}
                <AboutUs />
                <EventRoller/>
                <SponsorSlider />
                <Contact />
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </LocomotiveScrollProvider>
    </div>
  );
}