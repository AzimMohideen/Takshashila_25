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
          backgroundImage: "url('/u1back.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      
      {/* Black Overlay with increased opacity */}
      <div className="fixed inset-0 bg-black/80 z-10" />
      
      {/* Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <InteractiveCursor />
        <NavBar />
        
        {/* Main content with padding for navbar */}
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-6 text-white text-center font-lexend md:text-left">
              Event Registration
            </h1>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Instructions Section - 3/5 width on desktop */}
              <div className="md:w-3/5">
                <div className="bg-white/10 backdrop-blur-sm border-l-4 border-emerald-500 text-white/90 p-8 rounded-lg h-full">
                  <h2 className="text-2xl font-bold mb-6 font-lexend">Registration Instructions</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Step 1: Select Days</h3>
                      <p>Choose which days you&apos;d like to attend. You can select multiple days for a discounted price.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Step 2: Workshop Selection</h3>
                      <p>Decide if you want to participate in our exclusive workshops. Adding a workshop gives you access to specialized training and hands-on experience.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Pricing Structure</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Single Day: ₹200</li>
                        <li>Multiple Days: ₹300</li>
                        <li>Workshop Addition: +₹50 (per registration)</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">Important Notes</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Workshop registration requires at least one day selection</li>
                        <li>Prices include all taxes and materials</li>
                        <li>Registration confirmation will be sent via email</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section - 2/5 width on desktop */}
              <div className="md:w-2/5">
                <RegistrationForm />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
} 