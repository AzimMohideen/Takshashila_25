"use client"

import { useEffect, ReactNode, useState } from "react"
import "locomotive-scroll/dist/locomotive-scroll.css"

interface LocomotiveScrollProps {
  children: ReactNode
  options?: {
    smooth?: boolean
    multiplier?: number
    lerp?: number
  }
}

interface ScrollInstance {
  destroy: () => void;
  scrollTo: (target: HTMLElement, options: { offset: number; duration: number }) => void;
  update: () => void;
} 

export default function LocomotiveScrollProvider({ 
  children, 
  options = { 
    smooth: true,
    multiplier: 1,
    lerp: 0.1
  } 
}: LocomotiveScrollProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let locomotiveInstance: ScrollInstance | null = null;

    const initLocomotiveScroll = async () => {
      try {
        const LocomotiveScroll = (await import("locomotive-scroll")).default
        const scrollContainer = document.querySelector("[data-scroll-container]") as HTMLElement

        if (!scrollContainer) {
          console.warn("No scroll container found");
          return;
        }

        // Check for mobile
        const isMobileDevice = window.innerWidth < 768 || 
                            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // Apply mobile-specific options
        const scrollOptions = {
          ...options,
          smooth: isMobileDevice ? false : options.smooth,
          smartphone: { 
            smooth: false,
            inertia: 0.8
          },
          tablet: {
            smooth: false,
            breakpoint: 768
          }
        };

        // Cleanup any existing instance
        if (locomotiveInstance) {
          locomotiveInstance.destroy();
        }

        locomotiveInstance = new LocomotiveScroll({
          el: scrollContainer,
          ...scrollOptions
        }) as ScrollInstance;

        // Handle anchor links
        const handleAnchorClick = (event: MouseEvent) => {
          event.preventDefault()
          const target = event.currentTarget as HTMLAnchorElement
          const targetId = target.getAttribute("href")?.substring(1)
          const targetElement = document.getElementById(targetId || "")

          if (targetElement && locomotiveInstance) {
            locomotiveInstance.scrollTo(targetElement, {
              offset: 0,
              duration: 1000,
            })
          }
        }

        const anchorLinks = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
        anchorLinks.forEach(link => {
          link.addEventListener("click", handleAnchorClick)
        })

        // Force multiple updates after initialization to ensure everything renders correctly
        setTimeout(() => locomotiveInstance?.update(), 100);
        setTimeout(() => locomotiveInstance?.update(), 500);
        setTimeout(() => locomotiveInstance?.update(), 1000);

        // Update on resize
        const handleResize = () => {
          if (locomotiveInstance) {
            setTimeout(() => {
              if (locomotiveInstance) {
                locomotiveInstance.update();
              }
            }, 100);
          }
        };
        window.addEventListener('resize', handleResize);

        // Add to cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.error("Failed to initialize Locomotive Scroll:", error);
      }
    }

    initLocomotiveScroll();

    return () => {
      if (locomotiveInstance) {
        locomotiveInstance.destroy();
      }
    }
  }, [options, isClient]);

  return (
    <div data-scroll-container>
      {children}
    </div>
  );
}