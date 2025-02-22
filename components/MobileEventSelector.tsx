'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import EventCard from './eventCard'
import { useRouter } from 'next/navigation'

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
  rawDescription?: string
}

interface MobileEventSelectorProps {
  events: Event[]
}

const MobileEventSelector = ({ events }: MobileEventSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(events[0])
  const router = useRouter()

  const categories = ['All', 'Technical', 'Non-Technical', 'Workshops', 'Pro Shows']

  const handleCategoryClick = (category: string) => {
    if (category === 'Pro Shows') {
      router.push('/Proshows')
    } else {
      setSelectedCategory(category)
    }
  }

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
              onClick={() => handleCategoryClick(category)}
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
        {filteredEvents.map((event, index) => (
          <EventCard
            key={`${event.id}-${index}`}
            {...event}
            rawDescription={event.rawDescription || event.description}
            isVinylHovered={false}
          />
        ))}
      </div>
    </div>
  )
}

export default MobileEventSelector 