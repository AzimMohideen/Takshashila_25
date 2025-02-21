"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

export function RegistrationForm() {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [workshop, setWorkshop] = useState(false)
  const [price, setPrice] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const calculatePrice = useCallback(() => {
    const dayCount = selectedDays.length
    if (dayCount === 0) {
      setPrice(0)
    } else if (dayCount === 1) {
      setPrice(workshop ? 250 : 200)
    } else {
      setPrice(workshop ? 350 : 300)
    }
  }, [selectedDays.length, workshop])

  useEffect(() => {
    calculatePrice()
  }, [selectedDays, workshop, calculatePrice])

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
      className="space-y-8 bg-black/70 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md mx-auto border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Days Selection */}
      <div className="space-y-6">
        <h3 className="text-white/90 text-lg font-semibold mb-4 font-lexend">Select Days</h3>
        <div className="grid grid-cols-1 gap-4">
          {["day1", "day2", "day3"].map((day) => (
            <div
              key={day}
              className="flex items-center space-x-3 bg-white/5 p-4 rounded-lg"
            >
              <input
                type="checkbox"
                id={day}
                checked={selectedDays.includes(day)}
                onChange={() => handleDayChange(day)}
                className="form-checkbox h-5 w-5 text-emerald-500 rounded"
              />
              <label htmlFor={day} className="text-white/90 text-lg">
                Day {day.slice(-1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Workshop Selection */}
      <div className="space-y-4">
        <h3 className="text-white/90 text-lg font-semibold font-lexend">Workshop Access</h3>
        <div className="bg-white/5 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="workshop"
              checked={workshop}
              onChange={(e) => setWorkshop(e.target.checked)}
              className="form-checkbox h-5 w-5 text-emerald-500 rounded"
            />
            <label htmlFor="workshop" className="text-white/90 text-lg">
              Include Workshop Access
            </label>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <motion.p 
          className="text-red-400 p-3 bg-red-900/20 rounded-lg border border-red-500/20" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
      
      {/* Price Display */}
      <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/20">
        <div className="text-xl font-bold text-emerald-400 text-center">
          Total Price: ₹{price}
        </div>
      </div>
      
      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSaveChanges}
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
      >
        Complete Registration
      </button>
    </motion.form>
  )
} 