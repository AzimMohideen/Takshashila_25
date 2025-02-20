"use client"

import { CountdownTimer } from "./countdown-timer"

const CountdownSection = () => {
  return (
    <section
      className="min-h-[50vh] bg-grey/50 bg-opacity-40 z-10 backdrop-blur-sm flex flex-col items-center justify-center py-24 px-4 md:px-16 overflow-hidden"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-4xl text-white relative pb-4 after:content-[''] 
                      after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 
                      after:w-16 after:h-1 after:bg-green-600 font-lexend text-center">
            DIVE INTO THE RHYTHM OF LIFE
          </h2>
          <div className="w-full backdrop-blur-sm bg-black/30 rounded-xl p-8 md:p-12">
            <CountdownTimer targetDateTime="2025-02-26T08:00:00" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CountdownSection 