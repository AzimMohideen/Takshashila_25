"use client"
import { useEffect, useState } from 'react';
import AboutUs from '../components/aboutUs';
import NavBar from '../components/navBar';
import SponsorSlider from '../components/SponsorSlider';
import Footer from '../components/footer';
import InteractiveCursor from '@/components/interactiveCursor';
import Contact from '@/components/contact';
import MainSection from '@/components/mainSection';
import EventRoller from './eventRoller';
import CountdownSection from './countdownSection';
import { isMobile } from 'react-device-detect';

// Modified version of LocomotiveScrollProvider that handles mobile better
const CustomLocomotiveScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    if (isMobile) return; 

    let locomotiveInstance: any = null;

    const initLocomotiveScroll = async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      
      // Don't use data-scroll-container selector which is causing conflicts
      const scrollContainer = document.getElementById("main-content");

      if (!scrollContainer) return;

      // Cleanup any existing instance
      if (locomotiveInstance) {
        locomotiveInstance.destroy();
      }

      locomotiveInstance = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        multiplier: 0.8, // Reduced for smoother feel
        lerp: 0.08,      // Slightly faster response
        smartphone: { smooth: false },
      });

      // Handle anchor links
      interface ScrollOptions {
        offset: number;
        duration: number;
      }

      const handleAnchorClick = (event: Event): void => {
        event.preventDefault();
        const target = event.currentTarget as HTMLAnchorElement;
        const targetId: string | undefined = target.getAttribute("href")?.substring(1);
        const targetElement: HTMLElement | null = document.getElementById(targetId || "");

        if (targetElement && locomotiveInstance) {
          locomotiveInstance.scrollTo(targetElement, {
        offset: 0,
        duration: 1000,
          } as ScrollOptions);
        }
      };

      const anchorLinks = document.querySelectorAll('a[href^="#"]');
      anchorLinks.forEach(link => {
        link.addEventListener("click", handleAnchorClick);
      });

      // Force a refresh after initialization
      setTimeout(() => {
        locomotiveInstance?.update();
      }, 500);
    };

    initLocomotiveScroll();

    return () => {
      if (locomotiveInstance) {
        locomotiveInstance.destroy();
      }
    };
  }, [isClient]);

  // Don't add the data-scroll-container to the wrapper on mobile
  return (
    <div id="main-content" className={isMobile ? "mobile-scroll" : ""}>
      {children}
    </div>
  );
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    // Set video source based on device type
    setVideoSrc(isMobile ? '/footage/landingscreen_mob.mov' : '/footage/landingscreen_lap.mov');

    const handleScroll = () => {
      const isScrolled = window.scrollY > window.innerHeight;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fix mobile scrolling directly at the document level
  useEffect(() => {
    if (isMobile) {
      // Reset any problematic styles that might be preventing scrolling
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
      document.body.style.overflowY = 'auto';
      document.body.style.height = 'auto';
      document.body.style.position = 'relative';
      
      // Add mobile-specific styles
      const style = document.createElement('style');
      style.innerHTML = `
        html, body {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          height: auto !important;
          position: relative !important;
          touch-action: auto !important;
        }
        .mobile-scroll {
          overflow-y: auto !important;
          height: auto !important;
          touch-action: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  return (
    <div className={isMobile ? "" : "cursor-none"}>
      {!isMobile && <InteractiveCursor />}
      
      <CustomLocomotiveScrollProvider>
        <div 
          className="relative min-h-screen w-full overflow-x-hidden"
          style={{
            background: 'linear-gradient(to bottom, #004225 0%, #013220 50%, #002616 100%)',
          }}
        >
          {/* Subtle overlay for better content visibility */}
          <div className="absolute inset-0 bg-black/50 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 w-full">
            <NavBar />
            <div className="flex flex-col w-full">
              <MainSection />
              <AboutUs />
              <EventRoller/>
              <SponsorSlider />
              <Contact />
              <CountdownSection />
              <Footer />
            </div>
          </div>
        </div>
      </CustomLocomotiveScrollProvider>
    </div>
  );
}