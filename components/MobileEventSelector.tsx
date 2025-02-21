'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import EventCard from './eventCard'

// Make all properties optional to handle any data structure
interface Event {
  id: number | string
  title: string
  name?: string
  description: string
  date: string
  time?: string
  registrationLink: string
  category: string
  image: string
  price?: number
}

interface MobileEventSelectorProps {
  events: Event[]
}

const MobileEventSelector = ({ events }: MobileEventSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(events[0])

  const categories = ['All', 'Technical', 'Non-Technical', 'Workshops', 'Pro Shows']

  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory)

  return (
    <div className="w-full px-4 py-6">
      {/* Category Selector */}
      <div className="overflow-x-auto mb-6">
        <div className="flex gap-2 pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-white ${
                selectedCategory === category
                  ? 'bg-emerald-500'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            {...event}
            location="CIT Campus"
            isVinylHovered={false}
          />
        ))}
      </div>
    </div>
  )
}

export default MobileEventSelector 