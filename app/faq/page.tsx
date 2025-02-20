'use client'
import React from 'react';
import NavBar from '@/components/navBar';
import InteractiveCursor from '@/components/interactiveCursor';
import LocomotiveScrollProvider from '@/components/locomotiveScroll';
import Footer from '@/components/footer';

const FAQPage = () => {
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
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-semibold text-cyan-400 text-center mb-12">Frequently Asked Questions</h1>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-black/50 p-6 rounded-lg hover:bg-black/60 transition-all">
                <h3 className="text-xl font-medium text-cyan-400 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔹</span>
                  {faq.question}
                </h3>
                <p className="text-gray-300 ml-8">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </LocomotiveScrollProvider>
  );
};

const faqs = [
  {
    question: "When and where is the event happening?",
    answer: "The event will take place on 26nd February 2025 at Chennai Institute of Technology, Kundrathur. Stay tuned for the full schedule!"
  },
  {
    question: "Who can participate in the competitions?",
    answer: "Students from all colleges are welcome to participate. Some events may require prior registration—check the Events Page for details."
  },
  {
    question: "Is there an entry fee for the event?",
    answer: "Entry to the cultural fest is free for all attendees! However, certain competitions may have a registration fee."
  },
  {
    question: "How do I register for competitions?",
    answer: "You can register online through our Registration Page or at the venue on the event day (subject to availability)."
  },
  {
    question: "What kind of events can we expect?",
    answer: "From electrifying battle of the bands and solo performances to thrilling dance-offs and art showcases, there's something for everyone! 🎸🎤💃"
  },
  {
    question: "Will there be food stalls at the venue?",
    answer: "Yes! A variety of food stalls will be available to keep you energized throughout the event. 🍔🎶"
  },
  {
    question: "Who are the chief guests or performers?",
    answer: "Stay tuned for exciting announcements about celebrity guests, DJs, and band performances! Follow us on social media for updates."
  },

];

export default FAQPage; 