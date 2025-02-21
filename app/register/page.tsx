"use client"

import NavBar from '@/components/navBar'
import Footer from '@/components/footer'
import { RegistrationForm } from "@/components/registrationSection"
import InteractiveCursor from '@/components/interactiveCursor'

export default function RegisterPage() {
  return (
    <div className="cursor-none min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/TKback2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      
      {/* Black Overlay */}
      <div className="fixed inset-0 bg-black/60 z-10" />
      
      {/* Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <InteractiveCursor />
        <NavBar />
        
        {/* Main content with padding for navbar */}
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-6 text-white text-center font-lexend">
              Event Registration
            </h1>
            
            <div className="bg-white/10 backdrop-blur-sm border-l-4 border-emerald-500 text-white/90 p-4 mb-6 rounded-lg max-w-md mx-auto">
              <p className="font-bold mb-2">Registration Instructions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Select the days you wish to attend</li>
                <li>Choose if you want to participate in the workshop</li>
                <li>Review the calculated price based on your selections</li>
                <li>Click <q>Save Changes</q> to confirm your registration</li>
              </ul>
            </div>

            <RegistrationForm />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
} 