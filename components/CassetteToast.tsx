"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { FastForward } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CassetteToastProps {
  message: string;
  type: 'success' | 'warning' | 'error';
  closeToast?: () => void;
}

export const CassetteToast = ({ message, type, closeToast }: CassetteToastProps) => {
  const generateBars = (count: number) => {
    return Array.from({ length: count }, () => Math.random() * 0.8 + 0.2);
  };

  const [bars] = useState(generateBars(32));

  const alertStyles = {
    success: {
      color: '#40ff40',
      emoji: '✓',
    },
    warning: {
      color: '#ffff40',
      emoji: '⚠️',
    },
    error: {
      color: '#ff4040',
      emoji: '✕',
    },
  };

  const currentStyle = alertStyles[type];

  return (
    <div className="relative w-[320px] h-[220px] bg-[#1a1a1a] rounded-lg shadow-2xl overflow-hidden">
      {/* Top ridged section */}
      <div className="absolute top-0 inset-x-0 h-8 bg-[#262626]">
        <div className="flex justify-between px-4 py-1">
          <span className="text-[#505050] text-xs">TDK D90</span>
          <span className="text-[#505050] text-xs">90 MIN</span>
        </div>
        <div className="flex space-x-0.5 mt-1">
          {Array.from({ length: 38 }).map((_, i) => (
            <div key={i} className="h-3 w-2 bg-[#1a1a1a]" />
          ))}
        </div>
      </div>

      {/* Main tape window */}
      <div className="absolute top-12 inset-x-6 h-24 bg-[#111] rounded-sm border border-[#333]">
        {/* Tape reels */}
        <div className="absolute inset-0 flex justify-between items-center px-4">
          <motion.div 
            className="w-16 h-16 rounded-full bg-[#222] relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-2 rounded-full bg-[#181818] border-4 border-[#282828]">
              <div className="absolute inset-[2px] rounded-full bg-[#151515]" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-3 bg-[#333]"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 60}deg) translateY(-32px)`
                }}
              />
            ))}
          </motion.div>

          <motion.div 
            className="w-16 h-16 rounded-full bg-[#222] relative"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-2 rounded-full bg-[#181818] border-4 border-[#282828]">
              <div className="absolute inset-[2px] rounded-full bg-[#151515]" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-3 bg-[#333]"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 60}deg) translateY(-32px)`
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Sound wave visualization */}
        <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-20">
          {bars.map((height, index) => (
            <motion.div
              key={index}
              className="w-1"
              style={{ backgroundColor: currentStyle.color }}
              initial={{ height: "10%" }}
              animate={{ 
                height: [`${height * 30}%`, `${height * 70}%`, `${height * 30}%`],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.03
              }}
            />
          ))}
        </div>
      </div>

      {/* Label area */}
      <div className="absolute bottom-8 inset-x-6 h-20 bg-white rounded-sm transform rotate-[0.5deg]">
        <div className="absolute inset-0 bg-[#f0f0f0] border border-[#ddd] rounded-sm p-2">
          <div className="h-full flex flex-col justify-center items-center">
            <div className="text-xs text-[#666] uppercase tracking-widest mb-1">
              {currentStyle.emoji} Side A
            </div>
            <div className="text-sm font-bold text-[#333] text-center">
              {message}
            </div>
          </div>
        </div>
      </div>

      {/* Cassette holes */}
      <div className="absolute top-[88px] left-[46%] w-3 h-3 bg-black rounded-full" />
      <div className="absolute top-[88px] right-[46%] w-3 h-3 bg-black rounded-full" />

      {/* Bottom details */}
      <div className="absolute bottom-2 inset-x-0 flex justify-between px-4">
        <span className="text-[#444] text-xs">TYPE I NORMAL</span>
        <motion.button
          whileHover={{ rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={closeToast}
          className="text-[#444] hover:text-[#ff4040] transition-colors duration-200"
        >
          <FastForward size={12} />
        </motion.button>
      </div>
    </div>
  );
};

// Custom toast function
export const showCassetteToast = (message: string, type: 'success' | 'warning' | 'error') => {
  toast(<CassetteToast message={message} type={type} />, {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    className: "cassette-toast-container",
  });
};

// Custom ToastContainer with styled notifications
export const StyledToastContainer = () => (
  <ToastContainer
    position="top-right"
    autoClose={2500}
    hideProgressBar
    newestOnTop
    closeOnClick={true}
    rtl={false}
    pauseOnFocusLoss={false}
    pauseOnHover={false}
    draggable={false}
    theme="dark"
    className="cassette-toast-root"
  />
); 