'use client'
import React from 'react';
import NavBar from '@/components/navBar';
import InteractiveCursor from '@/components/interactiveCursor';
import LocomotiveScrollProvider from '@/components/locomotiveScroll';
import Footer from '@/components/footer';

const GuidelinesPage = () => {
  return (
    <LocomotiveScrollProvider>
      <InteractiveCursor />
      <NavBar />
      <section 
        className="min-h-screen py-20 relative" 
        data-scroll-section
        style={{
          backgroundImage: 'url("/Tkback2.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-semibold text-cyan-400 text-center mb-12">Event Guidelines 🎶</h1>
          
          <p className="text-gray-300 mb-8 text-center">
            To ensure a smooth and enjoyable experience for everyone, please follow these guidelines:
          </p>

          <div className="space-y-8">
            {guidelines.map((guideline, index) => (
              <div key={index} className="bg-black/50 p-6 rounded-lg hover:bg-black/60 transition-all">
                <h2 className="text-2xl font-medium text-cyan-400 mb-4">{`${index + 1}. ${guideline.title}`}</h2>
                <ul className="text-gray-300 space-y-2 ml-4">
                  {guideline.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="list-disc ml-4">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </LocomotiveScrollProvider>
  );
};

const guidelines = [
  {
    title: "General Instructions",
    points: [
      "All participants and attendees must carry a valid college ID or event pass for verification.",
      "Please follow the schedule and be present at the venue on time for competitions and performances.",
      "Strictly adhere to the rules set by the organizing committee and event coordinators."
    ]
  },
  {
    title: "Participation Rules",
    points: [
      "Participants must register in advance for competitions and performances via the official Registration Page.",
      "Last-minute entries will only be accepted based on availability and event-specific rules.",
      "Any form of plagiarism, cheating, or rule violation may result in immediate disqualification."
    ]
  },
  {
    title: "Code of Conduct",
    points: [
      "Maintain a respectful and friendly atmosphere. Any form of harassment, discrimination, or disruptive behavior will not be tolerated.",
      "Attendees must respect fellow participants, judges, and organizing staff.",
      "Any damage to property, misconduct, or rule-breaking may lead to disqualification and removal from the venue."
    ]
  },
  {
    title: "Dress Code & Performance Guidelines",
    points: [
      "Participants must wear appropriate attire suited for performances and competitions.",
      "Costumes, props, and music must be decent, culturally appropriate, and non-offensive.",
      "All performances, including music and dance, should adhere to the time limit provided by event coordinators."
    ]
  },
  {
    title: "Media & Photography",
    points: [
      "The organizing team reserves the right to capture photos and videos of the event for promotional purposes.",
      "Personal photography and videography are allowed, but unauthorized live streaming of performances may be restricted."
    ]
  },
  {
    title: "Safety & Security",
    points: [
      "Keep your belongings safe! The event organizers are not responsible for any lost or stolen items.",
      "In case of an emergency, contact the nearest event volunteer or security personnel.",
      "Strictly no alcohol, drugs, smoking, or prohibited substances are allowed on campus or at the venue."
    ]
  },
  {
    title: "Food & Refreshments",
    points: [
      "Food stalls will be available at the venue. Please dispose of waste responsibly in designated bins.",
      "Outside food and beverages may not be allowed, depending on venue rules."
    ]
  },
  {
    title: "Decision & Judging Criteria",
    points: [
      "The decision of the judges and event organizers is final and binding.",
      "Any disputes or queries regarding results must be addressed to the organizing committee immediately after the competition."
    ]
  }
];

export default GuidelinesPage; 