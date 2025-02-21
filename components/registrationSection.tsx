"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function RegistrationForm() {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [workshop, setWorkshop] = useState(false)
  const [price, setPrice] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    calculatePrice()
  }, [selectedDays, workshop])

  const calculatePrice = () => {
    const dayCount = selectedDays.length
    if (dayCount === 0) {
      setPrice(0)
    } else if (dayCount === 1) {
      setPrice(workshop ? 250 : 200)
    } else {
      setPrice(workshop ? 350 : 300)
    }
  }

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleSaveChanges = () => {
    if (workshop && selectedDays.length === 0) {
      setError("Please select at least one day when choosing a workshop.")
      return
    }

    setError(null)
    const userPass = [...selectedDays.map((day) => day.replace("day", "")), ...(workshop ? ["w"] : [])]
    console.log("Saving changes:", userPass)
    alert("Changes saved successfully!")
  }

  return (
    <motion.form
      className="space-y-6 bg-black/30 backdrop-blur-sm p-6 rounded-lg shadow-md max-w-md mx-auto border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-4">
        {["day1", "day2", "day3"].map((day) => (
          <motion.div
            key={day}
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <input
              type="checkbox"
              id={day}
              checked={selectedDays.includes(day)}
              onChange={() => handleDayChange(day)}
              className="form-checkbox h-5 w-5 text-emerald-500"
            />
            <label htmlFor={day} className="text-white">
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </label>
          </motion.div>
        ))}
        <motion.div 
          className="flex items-center space-x-2" 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
        >
          <input
            type="checkbox"
            id="workshop"
            checked={workshop}
            onChange={(e) => setWorkshop(e.target.checked)}
            className="form-checkbox h-5 w-5 text-emerald-500"
          />
          <label htmlFor="workshop" className="text-white">
            Workshop
          </label>
        </motion.div>
      </div>
      
      {error && (
        <motion.p 
          className="text-red-400 mt-2" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
      
      <div className="text-xl font-bold text-emerald-400">
        Total Price: ₹{price}
      </div>
      
      <button
        type="button"
        onClick={handleSaveChanges}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
      >
        Save Changes
      </button>
    </motion.form>
  )
} 