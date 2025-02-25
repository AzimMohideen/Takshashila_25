"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Sponsor {
  name: string;
  image: string;
}

const sponsors: Sponsor[] = [
  { name: "AGS", image: "/Sponsors/AGS.png" },
  { name: "Aswins", image: "/Sponsors/Aswins.png" },
  { name: "Balaji Photo Frames", image: "/Sponsors/Balaji photo frames.png" },
  { name: "BIG FM", image: "/Sponsors/BIG fm_.png" },
  { name: "Coldmok", image: "/Sponsors/Coldmok.png" },
  { name: "DB Productions", image: "/Sponsors/DB productions.png" },
  { name: "Deyga", image: "/Sponsors/Deyga.png" },
  { name: "Gamestry", image: "/Sponsors/Gamestry.png" },
  { name: "K CLICKS STUDIO", image: "/Sponsors/K CLICKS STUDIO.png" },
  { name: "Krafton", image: "/Sponsors/Krafton.png" },
  { name: "Kyn", image: "/Sponsors/Kyn.png" },
  { name: "Maker's Cafe", image: "/Sponsors/Maker_s Cafe.png" },
  { name: "Medimix", image: "/Sponsors/Medimix.png" },
  { name: "MGM Healthcare", image: "/Sponsors/MGM health care.png" },
  { name: "NAC", image: "/Sponsors/NAC.png" },
  { name: "Pepsi", image: "/Sponsors/Pepsi.png" },
  { name: "Poorvika", image: "/Sponsors/poorvika.png" },
  { name: "Printex", image: "/Sponsors/Printex.png" },
  { name: "Prithvi Prints", image: "/Sponsors/Prithvi Prints_.png" },
  { name: "Provoke", image: "/Sponsors/Provoke.png" },
  { name: "V-Care", image: "/Sponsors/V - care.png" },
  { name: "Vikatan", image: "/Sponsors/Vikatan.png" },
  // { name: "Chennai symposiums", image: "/Sponsors/Chennai symposiums.png" }
];

interface SponsorSliderProps {
  speed?: number; 
}

export default function SponsorSlider({ speed = 120 }: SponsorSliderProps) {  // increased to 60 seconds
  const [scrollPosition, setScrollPosition] = useState(0);
  const totalSlides = sponsors.length * 2;

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 0.0001) % (totalSlides * 400));  
    }, speed * 10); 
    return () => clearInterval(interval);
  }, [speed, totalSlides]);

  const getSlideClass = (index: number) => {
    // Calculate the position of the slide in the visible frame
    const centerIndex = Math.floor(scrollPosition / 400) % sponsors.length;
    return centerIndex === index ? "scale-110 z-10" : "scale-130 z-10";
  };

  return (
    <section id="sponsors" className="z-10 backdrop-blur-sm flex flex-col items-center justify-center py-16 px-4" data-scroll-section>
      <div className="w-full relative overflow-hidden">
        <div
          className="flex animate-scroll"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          {/* Double the sponsors array to create seamless loop */}
          {[...sponsors, ...sponsors].map((sponsor, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-[400px] mx-4 bg-white/20 backdrop-blur-md 
                      rounded-lg p-6 transition-transform duration-300 ${getSlideClass(index)}`}
            >
              <Image
                src={sponsor.image}
                alt={sponsor.name}
                width={500}
                height={400}
                className="w-full h-auto object-contain"
              />
              <p className="text-white text-base font-semibold text-center mt-4 drop-shadow-lg">
                {sponsor.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
