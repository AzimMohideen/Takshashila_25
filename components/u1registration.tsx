"use client"

import { useState } from "react"
import { color, motion } from "framer-motion"
import axios from "axios"
import { showCassetteToast, StyledToastContainer } from "./CassetteToast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tk-backend.vercel.app"

export function RegForm() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [username, setUsername] = useState("")
  const [collegeName, setCollegeName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validation functions
  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isPhoneValid = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation checks
    if (!username.trim()) {
      showCassetteToast("Please enter your name", "error")
      return
    }
    if (!isEmailValid(email)) {
      showCassetteToast("Please enter a valid email address", "error")
      return
    }
    if (!isPhoneValid(phone)) {
      showCassetteToast("Please enter a valid 10-digit phone number", "error")
      return
    }
    if (!collegeName.trim()) {
      showCassetteToast("Please enter your college name", "error")
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        college: collegeName.trim()
      }

      await axios.post(`${API_URL}/u1`, payload)
      showCassetteToast("Registration successful!", "success")
      
      // Clear form
      setUsername("")
      setEmail("")
      setPhone("")
      setCollegeName("")

    } catch (err: any) {
      console.error("Error:", err)
      showCassetteToast(
        err.response?.data?.message || "Registration failed. Please try again.",
        "error"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <StyledToastContainer />
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 bg-black/70 backdrop-blur-md p-8 rounded-xl shadow-2xl max-w-md mx-auto border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-white/90 text-xl font-bold mb-6 font-lexend">
          U1 Concert Registration
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Full Name"
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white/90 focus:border-emerald-500 transition-colors"
            required
          />
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white/90 focus:border-emerald-500 transition-colors"
            required
          />
          
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white/90 focus:border-emerald-500 transition-colors"
            required
          />
          
          <input
            type="text"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            placeholder="College Name"
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white/90 focus:border-emerald-500 transition-colors"
            required
          />
          <p style={{ color: 'red' , textAlign:"center" , fontSize:'23px'}}>Entry Fee: ₹1000</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg 
            transition-all duration-300 shadow-lg hover:shadow-emerald-500/25
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'Registering...' : 'Register Now'}
        </button>

        <p className="text-white/60 text-sm text-center mt-4">
          Note: Registration confirmation will be sent to your email
        </p>
      </motion.form>
    </>
  )
}