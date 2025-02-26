"use client"

import NavBar from '@/components/navBar'
import Footer from '@/components/footer'
import { RegForm } from "@/components/u1registration"
import InteractiveCursor from '@/components/interactiveCursor'

export default function U1RegistrationPage() {
  return (
    <div className="cursor-none min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/U1CONCERT.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      
      {/* Black Overlay */}
      <div className="fixed inset-0 bg-black/80 z-10" />
      
      {/* Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <InteractiveCursor />
        <NavBar />
        
        {/* Main content */}
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-6 text-white text-center font-lexend">
              U1 Concert Registration
            </h1>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Instructions Section */}
              <div className="md:w-3/5">
                <div className="bg-white/10 backdrop-blur-sm border-l-4 border-emerald-500 text-white/90 p-8 rounded-lg h-full">
                  <h2 className="text-2xl font-bold mb-6 font-lexend">Concert Information</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Event Details</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Date: February 27, 2025</li>
                        <li>Time: 7:00 PM</li>
                        <li>Venue: CIT Main Ground</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Important Instructions</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Limited seats available</li>
                        <li>Entry only with valid college ID</li>
                        <li>No entry after event starts</li>
                        <li>Registration is non-transferable</li>
                        <li>Report at college by 10:00 AM</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Registration Process</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Fill out all required fields</li>
                        <li>Double-check your contact information</li>
                        <li>Confirmation will be sent via email</li>
                        <li>Bring the confirmation email on event day</li>
                      </ul>
                    </div>

                    <div className="mt-8 p-4 bg-red-500/20 rounded-lg border border-red-500/40">
                      <h3 className="text-xl font-semibold text-red-400">Important Notice</h3>
                      <ul className="list-disc list-inside space-y-2 mt-2 text-red-300">
                        <li>Registration is not needed for CIT students</li>
                        <li>Other Colleges Bring your college ID for verification</li>
                        <li>No refunds after registration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Form Section */}
              <div className="md:w-2/5">
                <RegForm />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}