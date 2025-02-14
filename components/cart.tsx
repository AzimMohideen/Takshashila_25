"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toaster, toast } from "sonner"

const eventImages = [
  "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80",
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&q=80",
]

interface Event {
  id: string;
  title: string;
  players: string[];
  price: number;
  image: string;
}

export default function Cart() {
  const [events, setEvents] = useState<Event[]>([])
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartIds = JSON.parse(sessionStorage.getItem("cart") || "[]")
      const loadedEvents = cartIds.map((id: string, index: number) => ({
        id,
        title: `Event ${id}`,
        players: JSON.parse(sessionStorage.getItem(id) || "[]"),
        price: 99.99,
        image: eventImages[index % eventImages.length]
      }))
      setEvents(loadedEvents)

      const initialQuantities: { [key: string]: number } = {}
      loadedEvents.forEach((event: Event) => {
        initialQuantities[event.id] = 1
      })
      setQuantities(initialQuantities)
    }
  }, [])

  const handleIncrement = (eventId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [eventId]: (prev[eventId] || 1) + 1
    }))
    toast.success("Quantity updated!", {
      position: "bottom-right",
      duration: 1500,
    })
  }

  const handleDecrement = (eventId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [eventId]: Math.max((prev[eventId] || 1) - 1, 1)
    }))
  }

  const removeEvent = (eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId)
    setEvents(updatedEvents)
    const cartIds = updatedEvents.map(event => event.id)
    sessionStorage.setItem("cart", JSON.stringify(cartIds))
    sessionStorage.removeItem(eventId)
    toast.warning("Item removed from cart")
  }

  const total = events.reduce(
    (sum, event) => sum + (event.price * (quantities[event.id] || 1)),
    0
  )

  const clearCart = () => {
    events.forEach(event => {
      sessionStorage.removeItem(event.id)
    })
    sessionStorage.removeItem("cart")
    setEvents([])
  }

  const handleCheckout = async () => {
    if (events.length === 0) {
      toast.error("Your cart is empty!")
      return
    }

    try {
      // Create a Razorpay order via your API endpoint
      const response = await fetch("/api/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, cart: events }),
      })
      const data = await response.json()
      if (!data.order) {
        throw new Error("Order creation failed!")
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Takshashila",
        description: "Event Registration Payment",
        order_id: data.order.id,
        handler: (response: any) => {
          toast.success("Payment successful!")
          clearCart()
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#3399cc"
        }
      }

      // @ts-ignore
      const rzp = new Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Payment failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-black p-8">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-5xl font-bold text-center mb-12 text-white">
          Your Event Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-lg flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 relative overflow-hidden group hover:bg-white/20 transition-all duration-300"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full sm:w-32 h-32 rounded-md object-cover"
                  />
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                    <p className="text-white/80 mt-2">Players: {event.players.length}</p>
                    <p className="text-white/80 font-medium mt-2">${event.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDecrement(event.id)}
                      className="bg-green-800 hover:bg-green-700 text-white border-green-600"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center text-white">
                      {quantities[event.id] || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleIncrement(event.id)}
                      className="bg-green-800 hover:bg-green-700 text-white border-green-600"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeEvent(event.id)}
                      className="bg-red-800 hover:bg-red-700 text-white border-red-600 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {events.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <ShoppingCart size={48} className="mx-auto mb-4 text-white/50" />
                <p className="text-xl text-white">Your cart is empty</p>
                <p className="text-white/70 mt-2">Add some events to get started</p>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <motion.div
              className="bg-white/10 backdrop-blur-sm p-8 rounded-lg sticky top-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-semibold mb-6 text-white">Cart Summary</h2>
              <div className="space-y-4 mb-6">
                {events.map((event) => (
                  <div key={event.id} className="flex justify-between text-white">
                    <span>{event.title}</span>
                    <span>${(event.price * (quantities[event.id] || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/20 pt-4 mb-8">
                <div className="flex justify-between text-2xl font-bold text-white">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                className="w-full text-lg py-6 bg-gradient-to-r from-green-800 to-green-700 hover:from-green-700 hover:to-green-600 text-white transition-all duration-300"
              >
                Proceed to Checkout
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}