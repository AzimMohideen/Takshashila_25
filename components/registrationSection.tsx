"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tk-backend.vercel.app"

export function RegistrationForm() {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [workshop, setWorkshop] = useState(false)
  const [price, setPrice] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [collegeName, setCollegeName] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [dbCount, setDbCount] = useState<number | null>(null)

  const fetchCount = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/select`)
      setDbCount(data.count)
    } catch (err) {
      console.error("Error fetching count:", err)
    }
  }

  useEffect(() => {
    fetchCount()
  }, [])

  const calculatePrice = useCallback(() => {
    const dayCount = selectedDays.length
    setPrice(dayCount === 0 ? 0 : dayCount === 1 ? (workshop ? 250 : 200) : workshop ? 350 : 300)
  }, [selectedDays.length, workshop])

  useEffect(() => {
    calculatePrice()
  }, [selectedDays, workshop, calculatePrice])

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSaveChanges = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/select`);
      const currentCount = data.count;
      console.log("Current count:", currentCount);
      if (currentCount >= 3) {
        setError("You have reached the maximum number of registrations for today (3).");
        return;
      }
  
      if (workshop && selectedDays.length === 0) {
        setError("Please select at least one day when choosing a workshop.");
        return;
      }
  
      setError(null);
      const userPass = [
        ...selectedDays.map((day) => [day.replace("day", "")]),
        ...(workshop ? [["w"]] : []) 
      ];
  
      const payload = {
        email,
        phone_no: phone,
        username,
        password,
        pass: userPass,
        college_name: collegeName,
        amount: price,
        count: currentCount + 1
      };
  
      await axios.post(`${API_URL}/update`, payload);
      alert(`Registration successful! You have ${3 - (currentCount + 1)} registrations remaining today.`);
      setDbCount(currentCount + 1);
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while processing your registration. Please try again.");
    }
  
    setSelectedDays([]);
    setWorkshop(false);
    setPrice(0);
    setEmail("");
    setPhone("");
    setUsername("");
    setPassword("");
    setCollegeName("");
    setShowModal(false);
  };
  
  return (
    <>
      <motion.form
        className="space-y-8 bg-black/70 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md mx-auto border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Days Selection */}
        <div className="space-y-6">
          <h3 className="text-white/90 text-lg font-semibold mb-4 font-lexend">
            Select Days
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {["day1", "day2", "day3"].map((day) => (
              <div key={day} className="flex items-center space-x-3 bg-white/5 p-4 rounded-lg">
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
          <h3 className="text-white/90 text-lg font-semibold font-lexend">
            Workshop Access
          </h3>
          <div className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="workshop"
                checked={workshop}
                onChange={(e) => {
                  if (selectedDays.length === 0 && e.target.checked) {
                    setError("Please select at least one day before choosing workshop access.")
                  } else {
                    setWorkshop(e.target.checked)
                    setError(null)
                  }
                }}
                className="form-checkbox h-5 w-5 text-emerald-500 rounded"
              />
              <label htmlFor="workshop" className="text-white/90 text-lg">
                Include Workshop Access
              </label>
            </div>
          </div>
        </div>

        {/* Registrations remaining indicator */}
        <div className="text-white/80 text-sm text-center mb-4">
          Registrations remaining today: {dbCount !== null ? 3 - dbCount : "--"}
        </div>

        {/* Price Display */}
        <div className="bg-emerald-900/20 p-4 rounded-lg border border-emerald-500/20">
          <div className="text-xl font-bold text-emerald-400 text-center">
            Total Price: ₹{price}
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

        {/* Button to open modal */}
        <button
          type="button"
          onClick={() => {
            if (selectedDays.length > 0 || workshop) {
              setError(null)
              setShowModal(true)
            } else {
              setError("Please select at least one day or choose workshop access before proceeding.")
            }
          }}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
        >
          Complete Registration
        </button>
      </motion.form>

      {/* Modal for collecting user details */}
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-black/70 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md relative border border-white/20"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
          >
            <h3 className="text-white/90 text-xl font-bold mb-4">
              Enter Your Details
            </h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/5 mb-3 border border-white/10 text-white/90"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full p-3 rounded-lg bg-white/5 mb-3 border border-white/10 text-white/90"
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full p-3 rounded-lg bg-white/5 mb-3 border border-white/10 text-white/90"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/5 mb-3 border border-white/10 text-white/90"
            />
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="College Name"
              className="w-full p-3 rounded-lg bg-white/5 mb-3 border border-white/10 text-white/90"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/90 rounded transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-all duration-300"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}