import React, { useEffect, useRef } from 'react';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { useRouter } from 'next/navigation';

interface EventPopupProps {
  id: string;
  title: string;
  date: string;

  description: string;
  category: string;
  onClose: () => void;
  onSelect?: (id: string, playerName: string) => boolean;
  titleClassName?: string;
  titleStyle?: React.CSSProperties;
}

export default function EventPopup({
  id,
  title,
  date,

  description,
  category,
  onClose,
  onSelect,
  titleClassName,
  titleStyle
}: EventPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const handleRegister = () => {
    onClose();
    router.push('/register');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-40 p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative"
          style={{
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 left-0 right-0 bg-gradient-to-br from-green-800 to-green-900 p-8 pb-4 z-10">
            <div className="flex justify-between items-start">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-400 ${titleClassName}`}
                style={titleStyle}
              >
                {title}
              </motion.h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-300 hover:text-gray-100 transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>
          </div>

          <div className="px-8 pb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-6 mb-8"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="text-green-400" size={20} />
                    <span className="text-gray-100">{date}</span>
                  </div>
                 
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-300">Category:</span>
                    <span className="px-3 py-1 text-sm bg-green-700 text-green-100 rounded-full">
                      {category}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="description-container">
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRegister}
                className="px-6 py-2.5 rounded-xl text-gray-100 bg-green-700 hover:bg-green-600 transition-colors duration-200"
              >
                Register Now
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}