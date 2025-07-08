"use client"

import { useState, useEffect } from "react"
import { Plane, MapPin, Compass } from "lucide-react"

export default function Loading() {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true)
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  const letters = "TRAVELOGE".split("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 animate-float">
          <Plane className="w-8 h-8 text-white/20 rotate-45" />
        </div>
        <div className="absolute top-40 right-32 animate-float-delayed">
          <MapPin className="w-6 h-6 text-white/20" />
        </div>
        <div className="absolute bottom-32 left-32 animate-float-slow">
          <Compass className="w-10 h-10 text-white/20" />
        </div>
        <div className="absolute top-60 right-20 animate-float">
          <Plane className="w-6 h-6 text-white/20 -rotate-12" />
        </div>
        <div className="absolute bottom-20 right-40 animate-float-delayed">
          <MapPin className="w-8 h-8 text-white/20" />
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center z-10">
        {/* Animated Logo/Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
            {letters.map((letter, index) => (
              <span
                key={index}
                className="inline-block animate-bounce-in"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <div className="w-32 h-1 bg-white/30 mx-auto rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300 ease-out animate-shimmer"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in-up">Nơi hành trình bắt đầu</p>

        {/* Progress Bar */}
        <div className="w-80 max-w-sm mx-auto mb-6">
          <div className="flex justify-between text-white/70 text-sm mb-2">
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-300 to-blue-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse-dot"></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse-dot" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse-dot" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: translateY(50px) scale(0.3);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateY(0px) scale(1);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        
        @keyframes pulse-dot {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fade-in-fast {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 1.5s both;
        }
        
        .animate-pulse-dot {
          animation: pulse-dot 1.5s ease-in-out infinite;
        }
        
        .animate-shimmer {
          position: relative;
        }
        
        .animate-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }
        
        .animate-fade-in-fast {
          animation: fade-in-fast 0.5s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  )
}
