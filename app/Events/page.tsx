"use client";

import { useEffect, useState } from "react";
import "locomotive-scroll/dist/locomotive-scroll.css";

import InteractiveCursor from "@/components/interactiveCursor";
import Footer from "@/components/footer";
import NavBar from "@/components/navBar";
import Eventsdisc from "@/components/event_selector";


interface CustomEvent {
  id: number;
  title: string;
  category: "Technical" | "Non-Technical" | "Workshops" | "All"; // Match the expected category types
  date: string;
  location: string;
  image: string;
  description: string;
  registrationLink: string;
}

// Add these category and event type definitions
const categories = ["Technical", "Non-Technical", "Workshops"] as const;
const eventTypes = {
  Technical: ["Hackathon", "Coding Challenge", "Robotics", "IoT Project", "AI Competition"],
  "Non-Technical": ["Cultural Show", "Art Exhibition", "Literary Event", "Gaming Tournament", "Quiz"],
  Workshops: ["Web Development", "Data Science", "Cloud Computing", "Mobile App Dev", "Cybersecurity"]
} as const;

// Helper function to get random date between March 15-18, 2024
const getRandomDate = () => {
  const dates = ["March 15", "March 16", "March 17", "March 18"];
  return `${dates[Math.floor(Math.random() * dates.length)]}, 2024`;
};

// Helper function to get random location
const getRandomLocation = () => {
  const locations = [
    "Tech Arena",
    "Innovation Hub",
    "Design Studio",
    "Workshop Lab",
    "Main Auditorium",
    "Seminar Hall",
    "Creative Space",
    "Learning Center"
  ];
  return locations[Math.floor(Math.random() * locations.length)];
};

// Helper function to get random image
const getRandomImage = () => {
  const images = ["/1.png", "/2.png", "/3.png"];
  return images[Math.floor(Math.random() * images.length)];
};

const eventlist: CustomEvent[] = [
  // Original events
  {
    id: 1,
    title: "Codeathon",
    date: "March 15-17, 2024",
    location: "Tech Arena",
    image: "/3.png",
    description: "Showcase your technical skills through coding competitions, hackathons, and robotics challenges.",
    registrationLink: "#",
    category: "Technical"
  },
  {
    id: 2,
    title: "Treasure Hunt",
    date: "March 16-18, 2024",
    location: "Cultural Center",
    image: "/2.png",
    description: "Express yourself through art, music, dance, and various cultural competitions.",
    registrationLink: "#",
    category: "Non-Technical"
  },
  {
    id: 3,
    title: "UI/UX",
    date: "March 15-18, 2024",
    location: "Learning Hub",
    image: "/1.png",
    description: "Learn from industry experts in hands-on workshops covering cutting-edge technologies.",
    registrationLink: "#",
    category: "Workshops"
  },
  // Generate additional events
  ...Array.from({ length: 7 }, (_, index) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const eventType = eventTypes[category][Math.floor(Math.random() * eventTypes[category].length)];
    
    return {
      id: index + 4,
      title: `${eventType} ${Math.floor(Math.random() * 100 + 1)}`,
      category: category,
      date: getRandomDate(),
      location: getRandomLocation(),
      image: getRandomImage(),
      description: `Join us for an exciting ${category.toLowerCase()} event focused on ${eventType.toLowerCase()}. This event promises to bring together enthusiasts and experts for an unforgettable experience.`,
      registrationLink: "#"
    };
  })
];


export default function Events() {
  const [, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Handle hash navigation when the page loads
    const hash = window.location.hash;
    if (hash) {
      // Remove the # from the hash
      const sectionId = hash.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure content is loaded
      }
    }
  }, []);

  return (
    <div className="cursor-none">
      
      <div className="relative z-50">
      <NavBar />
      <InteractiveCursor />
      
      {/* Integrated Eventsdisc Component */}
      <Eventsdisc events={eventlist} />
      </div>
      <Footer />
    </div>
  );
}
