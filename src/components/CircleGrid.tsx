import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { circleData } from "@/data/circleData";
import InteractiveCircle from "./InteractiveCircle";
import CirclePopup from "./CirclePopup";

const CircleGrid = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Navbar circle IDs
  const navCircleIds = ["about", "web-dev", "process", "contact"];

  // Responsive Grid Layout
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Initial set
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { cols, circleSize } = useMemo(() => {
    const totalCircles = 24; // Hardcoded count from circleData

    // Desktop: Keep original fixed layout logic BUT respect height constraints
    if (windowSize.width >= 1024) {
      const targetCols = 6;
      const rows = 4; // ceil(24/6)
      const gap = 15;
      const padding = 20;
      const safetyBuffer = 60; // Increased to 60px to ensure fit at 100% zoom with browser UI

      // Width Constraint
      const availableWidth = Math.min(windowSize.width, 1400) - (padding * 2);
      const sizeByWidth = (availableWidth / targetCols) - gap;

      // Height Constraint
      // Hex packing height approx: size * (1 + (rows - 1) * 0.85)
      const heightFactor = 0.85;
      const availableHeight = windowSize.height - (padding * 2) - safetyBuffer;
      const sizeByHeight = availableHeight / (1 + (rows - 1) * heightFactor);

      let size = Math.min(sizeByWidth, sizeByHeight);

      // Clamp: Min 50 allows shrinking for short screens
      // Max 130 reduced from 140 to ensure it doesn't look too crowded or overflow
      size = Math.min(Math.max(size, 50), 130);

      return { cols: targetCols, circleSize: size };
    }

    // Mobile/Tablet: Dynamic packing to fit ALL circles in viewport
    const aspectRatio = windowSize.width / windowSize.height;

    // Estimate best column count based on aspect ratio
    // Formula attempts to make a grid with similar aspect ratio to screen
    let targetCols = Math.round(Math.sqrt(totalCircles * aspectRatio));

    // Clamp columns to reasonable bounds for mobile
    if (windowSize.width < 480) {
      // Force fewer columns on very narrow screens unless landscape
      targetCols = Math.max(2, Math.min(targetCols, 4));
    } else {
      targetCols = Math.max(3, Math.min(targetCols, 7));
    }

    const rows = Math.ceil(totalCircles / targetCols);

    // Mobile adjustment: Gap is proportional to size (0.2 * size) in the render loop.
    // We need to solve for size in:
    // WidthAvailable = size * cols + size * 0.2 * (cols - 1) + size * 0.6 (stagger offset)
    // WidthAvailable = size * (cols + 0.2 * cols - 0.2 + 0.6)
    // WidthAvailable = size * (1.2 * cols + 0.4)
    // size = WidthAvailable / (1.2 * cols + 0.4)

    const padding = 20;
    const safetyBuffer = 10;
    const availableWidth = windowSize.width - (padding * 2) - safetyBuffer;

    const widthConstraint = availableWidth / (1.2 * targetCols + 0.4);

    // Calculate max size by height
    // Considering hexagonal packing overlap (approx 0.85 height per row factor + offset)
    const heightFactor = 0.85;
    const availableHeight = windowSize.height - (padding * 2) - safetyBuffer;
    // Height needed = size + (rows - 1) * size * heightFactor
    // availableHeight = size * (1 + (rows - 1) * heightFactor)
    // size = availableHeight / (1 + (rows - 1) * heightFactor)
    const heightConstraint = availableHeight / (1 + (rows - 1) * heightFactor);

    let size = Math.min(widthConstraint, heightConstraint);

    // Clamp size - allow much smaller circles on mobile to fit everything
    // Increased max size to 180 to allow tablets/iPads to fill the screen (minimize empty space)
    size = Math.min(Math.max(size, 20), 180);

    return { cols: targetCols, circleSize: size };
  }, [windowSize.width, windowSize.height]);

  // Pre-calculate oscillation animations to ensure stability
  const oscillations = useMemo(() => {
    return circleData.map(() => {
      // Randomize direction: slightly up, down, left, or right
      const isX = Math.random() > 0.5;
      const dir = Math.random() > 0.5 ? 5 : -5;
      return {
        x: isX ? [0, dir, 0] : [0, 0, 0],
        y: !isX ? [0, dir, 0] : [0, 0, 0],
        duration: 3 + Math.random() * 2, // Slow, gentle movement (3-5s)
        delay: Math.random() * 2 // Random start offset
      };
    });
  }, []);

  const activeCircle = useMemo(() =>
    expandedId ? circleData.find(c => c.id === expandedId) : null,
    [expandedId]);

  return (
    <>
      <div
        className={`absolute inset-0 overflow-hidden transition-all duration-500 ease-in-out ${expandedId ? "blur-sm opacity-40 scale-[0.98] pointer-events-none" : ""
          }`}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
              top: "10%",
              left: "5%",
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.2, 0.15],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, hsl(var(--accent) / 0.1) 0%, transparent 70%)",
              bottom: "15%",
              right: "10%",
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        {/* Circles Container */}
        <div
          className="absolute inset-0"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden', // Force no scroll
            height: '100%'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, ${circleSize}px)`,
              gap: `${circleSize * 0.2}px`,
              padding: '20px',
              width: '100%',
              justifyContent: 'center',
              // Visual centering helper if content is smaller
              margin: 'auto',
            }}
          >
            {circleData.map((circle, index) => {
              const row = Math.floor(index / cols);
              const isOddRow = row % 2 === 1;
              const move = oscillations[index];

              return (
                <motion.div
                  key={circle.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: move.x,
                    y: move.y
                  }}
                  transition={{
                    opacity: { duration: 0.5, delay: circle.delay || 0 },
                    scale: { duration: 0.5, delay: circle.delay || 0 },
                    x: {
                      duration: move.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: move.delay
                    },
                    y: {
                      duration: move.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: move.delay
                    }
                  }}
                  style={{
                    marginLeft: isOddRow ? `${circleSize * 0.6}px` : '0',
                    marginRight: isOddRow ? `-${circleSize * 0.6}px` : '0',
                    marginBottom: `-${circleSize * 0.25}px`,
                    zIndex: navCircleIds.includes(circle.id) ? 20 : 10,
                    position: 'relative',
                  }}
                >
                  <InteractiveCircle
                    circle={circle}
                    isExpanded={expandedId === circle.id}
                    onExpand={() => setExpandedId(circle.id)}
                    onCollapse={() => setExpandedId(null)}
                    size={circleSize}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div >

      {/* Full Screen Popup Overlay */}
      <AnimatePresence>
        {
          activeCircle && (
            <CirclePopup
              circle={activeCircle}
              onClose={() => setExpandedId(null)}
            />
          )
        }
      </AnimatePresence >
    </>
  );
};

export default CircleGrid;
