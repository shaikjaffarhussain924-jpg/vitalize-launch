import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface LocationMapProps {
  location?: string
  coordinates?: string
  className?: string
}

export function LocationMap({
  location = "San Francisco, CA",
  coordinates = "37.7749° N, 122.4194° W",
  className,
}: LocationMapProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [-50, 50], [8, -8])
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8])

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative cursor-pointer select-none", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformPerspective: 800,
        }}
        animate={{
          height: isExpanded ? 420 : 220,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-navy/5 z-10 pointer-events-none" />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <div className="absolute inset-0 bg-muted/30" />

              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Main roads */}
                <line x1="0" y1="35" x2="100" y2="35" stroke="currentColor" strokeWidth="0.4" className="text-foreground/10" />
                <line x1="0" y1="65" x2="100" y2="65" stroke="currentColor" strokeWidth="0.4" className="text-foreground/10" />
                <line x1="30" y1="0" x2="30" y2="100" stroke="currentColor" strokeWidth="0.4" className="text-foreground/10" />
                <line x1="70" y1="0" x2="70" y2="100" stroke="currentColor" strokeWidth="0.4" className="text-foreground/10" />

                {/* Secondary streets */}
                {[20, 50, 80].map((y, i) => (
                  <line key={`h${i}`} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.15" className="text-foreground/5" />
                ))}
                {[15, 45, 55, 85].map((x, i) => (
                  <line key={`v${i}`} x1={x} y1="0" x2={x} y2="100" stroke="currentColor" strokeWidth="0.15" className="text-foreground/5" />
                ))}
              </svg>

              {/* Buildings */}
              <div className="absolute top-[18%] left-[12%] w-8 h-6 rounded-sm bg-muted-foreground/8" />
              <div className="absolute top-[42%] left-[38%] w-10 h-8 rounded-sm bg-muted-foreground/10" />
              <div className="absolute top-[22%] right-[20%] w-6 h-10 rounded-sm bg-muted-foreground/6" />
              <div className="absolute bottom-[25%] left-[55%] w-12 h-6 rounded-sm bg-muted-foreground/8" />
              <div className="absolute bottom-[40%] right-[12%] w-8 h-8 rounded-sm bg-muted-foreground/6" />
              <div className="absolute top-[55%] left-[18%] w-6 h-6 rounded-sm bg-muted-foreground/5" />

              {/* Location pin */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <div className="w-4 h-4 rounded-full bg-gold shadow-lg shadow-gold/30 border-2 border-card" />
                <div className="w-6 h-6 rounded-full bg-gold/20 absolute -top-1 -left-1 animate-ping" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid pattern - collapsed */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" style={{ display: isExpanded ? 'none' : 'block' }}>
          <defs>
            <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
        </svg>

        {/* Content */}
        <div className="relative z-20 p-6 h-full flex flex-col justify-between">
          {/* Top */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cta/10">
              <div className="w-1.5 h-1.5 rounded-full bg-cta animate-pulse" />
              <span className="text-[10px] font-medium text-cta tracking-wider uppercase">Live</span>
            </div>
          </div>

          {/* Bottom */}
          <div>
            <motion.p
              className="text-sm font-medium text-foreground"
              animate={{ fontSize: isExpanded ? "1.125rem" : "0.875rem" }}
            >
              {location}
            </motion.p>

            <AnimatePresence>
              {isExpanded && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-muted-foreground mt-1"
                >
                  {coordinates}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              className="h-px bg-gold/30 mt-2 origin-left"
              animate={{ scaleX: isHovered ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </motion.div>

      <motion.p
        className="text-[10px] text-muted-foreground/50 text-center mt-2 tracking-wider uppercase"
        animate={{ opacity: isHovered ? 1 : 0 }}
      >
        Click to expand
      </motion.p>
    </div>
  )
}
