import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { CircleData } from "@/data/circleData";
import { useIsMobile } from "@/hooks/use-mobile";


interface InteractiveCircleProps {
  circle: CircleData;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  size: number;
}

// Uniform sizes for perfect honeycomb alignment
const sizeClasses = {
  // Dynamic size based on layout calculation
};

const colorClasses = {
  primary: "text-primary",
  accent: "text-accent",
  muted: "text-muted-foreground",
};

const InteractiveCircle = ({
  circle,
  isExpanded,
  onExpand,
  onCollapse,
  size,
}: InteractiveCircleProps) => {
  const Icon = circle.icon;
  const isMobile = useIsMobile();

  // Deterministic randomize oscillation based on circle.id
  const oscillationParams = useMemo(() => {
    // Simple hash function to get a seed from the ID string
    const seed = circle.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const getSeededRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const duration = 6 + getSeededRandom(seed) * 2; // 6-8s
    const initialDirection = getSeededRandom(seed + 1) > 0.5 ? 1 : -1;
    const distance = 8 + getSeededRandom(seed + 2) * 4; // 8-12px
    const delay = getSeededRandom(seed + 3) * 2;

    return {
      y: [0, distance * initialDirection, 0, distance * -initialDirection, 0],
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay,
      }
    };
  }, [circle.id]);

  return (
    <motion.div
      layoutId={`circle-container-${circle.id}`}
      className={`relative ${isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    // animate={oscillationParams} // Removed oscillation for strict stable layout
    >
      <motion.div
        onClick={onExpand}
        className={`
          neu-circle flex items-center justify-center
          cursor-pointer
          transition-transform duration-200 ease-out
        `}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          willChange: 'transform',
          WebkitTransform: 'translate3d(0, 0, 0)'
        }}
        whileHover={isMobile ? {} : {
          scale: 1.05,
          transition: { duration: 0.15, ease: "easeOut" }
        }}
        whileTap={{
          scale: isMobile ? 0.98 : 0.95,
          transition: { duration: 0.1, ease: "easeOut" }
        }}
      >
        <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
          <Icon className={`w-6 h-6 md:w-8 md:h-8 ${colorClasses[circle.color]}`} />
          <span className="text-[10px] md:text-sm font-semibold text-foreground/90 leading-tight">
            {circle.label}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InteractiveCircle;
