"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps extends React.HTMLAttributes<HTMLDivElement> {
  targetDateTime: string // Accept ISO date string or "YYYY-MM-DD HH:mm:ss"
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function CircleProgress({
  value,
  label,
  max,
}: {
  value: number
  label: string
  max: number
}) {
  const radius = 45
  const strokeWidth = 6
  const normalizedValue = value > max ? max : value
  const percentage = (normalizedValue / max) * 100
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex aspect-square w-40 items-center justify-center">
        <svg className="absolute -rotate-90" width="100%" height="100%" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="opacity-20"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgb(45, 212, 191)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-in-out"
            style={{
              filter: "drop-shadow(0 0 12px rgb(45, 212, 191))",
            }}
          />
        </svg>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-white">{value}</span>
          <span className="text-lg uppercase tracking-wider text-gray-400">{label}</span>
        </div>
      </div>
    </div>
  )
}

export function CountdownTimer({ targetDateTime, className, ...props }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isExpired, setIsExpired] = React.useState(false)

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const targetTime = new Date(targetDateTime).getTime()
      const now = new Date().getTime()
      const difference = targetTime - now

      if (difference <= 0) {
        setIsExpired(true)
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      })
    }

    calculateTimeLeft() // Initial calculation
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDateTime])

  return (
    <div className={cn("flex flex-col items-center gap-12", className)} {...props}>
      <h2 className="text-2xl font-semibold tracking-[0.2em] text-white">
        {isExpired ? "COUNTDOWN ENDED" : "COUNTDOWN TIMER"}
      </h2>
      <div className="flex flex-wrap justify-center gap-12">
        <CircleProgress value={timeLeft.days} label="days" max={365} />
        <CircleProgress value={timeLeft.hours} label="hours" max={24} />
        <CircleProgress value={timeLeft.minutes} label="minutes" max={60} />
        <CircleProgress value={timeLeft.seconds} label="seconds" max={60} />
      </div>
    </div>
  )
}

