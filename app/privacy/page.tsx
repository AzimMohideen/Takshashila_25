'use client'
import React from 'react';
import NavBar from '@/components/navBar';
import InteractiveCursor from '@/components/interactiveCursor';
import LocomotiveScrollProvider from '@/components/locomotiveScroll';
import Footer from '@/components/footer';

const PrivacyPage = () => {
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
          <h1 className="text-4xl font-semibold text-cyan-400 text-center mb-12">Privacy Policy 🎶</h1>
          
          <p className="text-gray-300 mb-8 text-center">
            At Events, we respect your privacy and are committed to protecting your personal information. 
            This policy explains how we collect, use, and safeguard your data when you interact with our website and participate in the event.
          </p>

          <div className="space-y-8">
            {privacyPolicies.map((policy, index) => (
              <div key={index} className="bg-black/50 p-6 rounded-lg hover:bg-black/60 transition-all">
                <h2 className="text-2xl font-medium text-cyan-400 mb-4">{`${index + 1}. ${policy.title}`}</h2>
                <ul className="text-gray-300 space-y-2 ml-4">
                  {policy.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="list-disc ml-4">{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-gray-300 mt-8 text-center italic">
            Thank you for being a part of Events! 🎸🎤🎶
          </p>
        </div>
      </section>
      <Footer />
    </LocomotiveScrollProvider>
  );
};

const privacyPolicies = [
  {
    title: "Information We Collect",
    points: [
      "Personal Information: Name, email, phone number, college name, and event preferences.",
      "Registration Data: Details provided while signing up for competitions or volunteering.",
      "Usage Data: IP addresses, browser type, and website interaction details (collected via cookies)."
    ]
  },
  {
    title: "How We Use Your Information",
    points: [
      "Event Registration & Management: To process your participation in competitions, workshops, or volunteer activities.",
      "Communication: To send important event updates, schedules, and announcements.",
      "Security & Safety: To ensure compliance with event guidelines and maintain a safe environment.",
      "Marketing & Promotions: Photos, videos, or testimonials may be used on our website and social media (with your consent)."
    ]
  },
  {
    title: "Data Sharing & Security",
    points: [
      "We do not sell or share your personal data with third parties for commercial purposes.",
      "Your information is only shared with authorized event organizers and partners for event-related activities.",
      "We implement security measures to protect your data from unauthorized access, but we cannot guarantee absolute security over the internet."
    ]
  },
  {
    title: "Use of Cookies",
    points: [
      "Our website may use cookies to improve user experience and analyze website traffic.",
      "You can manage or disable cookies in your browser settings."
    ]
  },
  {
    title: "Your Rights & Choices",
    points: [
      "You can request access to your personal data or ask for corrections.",
      "If you wish to opt out of event communications or data collection, contact us."
    ]
  },
  {
    title: "External Links",
    points: [
      "Our website may contain links to third-party sites. We are not responsible for the privacy practices of external websites."
    ]
  },
  {
    title: "Policy Updates",
    points: [
      "We may update this privacy policy from time to time. Changes will be posted on this page with the updated date."
    ]
  }
];

export default PrivacyPage; 