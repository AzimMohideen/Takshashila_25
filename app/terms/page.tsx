'use client'
import React from 'react';
import NavBar from '@/components/navBar';
import InteractiveCursor from '@/components/interactiveCursor';
import LocomotiveScrollProvider from '@/components/locomotiveScroll';
import Footer from '@/components/footer';

const TermsPage = () => {
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
          <h1 className="text-4xl font-semibold text-cyan-400 text-center mb-12">Terms & Conditions 🎶</h1>
          
          <p className="text-gray-300 mb-8 text-center">
            By participating in or attending Events, you agree to the following terms and conditions:
          </p>

          <div className="space-y-8">
            {terms.map((term, index) => (
              <div key={index} className="bg-black/50 p-6 rounded-lg hover:bg-black/60 transition-all">
                <h2 className="text-2xl font-medium text-cyan-400 mb-4">{`${index + 1}. ${term.title}`}</h2>
                <ul className="text-gray-300 space-y-2 ml-4">
                  {term.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="list-disc ml-4">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-gray-300 mt-8 text-center italic">
            By attending Events, you acknowledge that you have read, understood, and agreed to these terms and conditions.
          </p>
        </div>
      </section>
      <Footer />
    </LocomotiveScrollProvider>
  );
};

const terms = [
  {
    title: "General Guidelines",
    points: [
      "The event is open to students and invited guests only. A valid college ID may be required for entry.",
      "All participants and attendees must adhere to the rules and regulations set by the organizing committee.",
      "The organizers reserve the right to modify the event schedule, rules, or venue at any time."
    ]
  },
  {
    title: "Event Registration & Participation",
    points: [
      "Registration for competitions must be completed before the specified deadline. Late entries may not be accepted.",
      "Participants must follow event-specific rules, which will be provided on the Events Page.",
      "The decision of the judges and organizers will be final and binding in all competitions."
    ]
  },
  {
    title: "Code of Conduct",
    points: [
      "Any form of misconduct, discrimination, harassment, or disruptive behavior will not be tolerated.",
      "Attendees are expected to maintain a respectful and inclusive environment.",
      "Vandalism, unauthorized entry to restricted areas, or damage to property will result in immediate disqualification and removal from the venue."
    ]
  },
  {
    title: "Intellectual Property & Media Rights",
    points: [
      "By attending, you consent to being photographed or recorded for promotional purposes.",
      "Any performances, artworks, or original content showcased during the event remain the intellectual property of the respective creators.",
      "Unauthorized recording or live-streaming of performances may be restricted."
    ]
  },
  {
    title: "Safety & Security",
    points: [
      "The organizing team is not responsible for lost or stolen belongings. Please take care of your personal items.",
      "In case of any emergency, please contact the event volunteers or security personnel immediately.",
      "Strictly no alcohol, drugs, or prohibited substances are allowed at the venue."
    ]
  },
  {
    title: "Ticketing & Refunds",
    points: [
      "Entry to the event is free for all attendees.",
      "Any tickets or passes are non-transferable and non-refundable."
    ]
  },
  {
    title: "Changes & Disclaimers",
    points: [
      "The organizers reserve the right to change event details, reschedule, or cancel any activity due to unforeseen circumstances.",
      "The college and organizing team are not liable for any injuries, accidents, or damages occurring during the event."
    ]
  }
];

export default TermsPage; 