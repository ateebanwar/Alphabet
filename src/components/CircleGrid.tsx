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

    // Desktop: Keep original fixed layout logic
    if (windowSize.width >= 1024) {
      const targetCols = 6;
      const gap = 15;
      const availableWidth = Math.min(windowSize.width, 1400) - 40;
      let size = (availableWidth / targetCols) - gap;
      size = Math.min(Math.max(size, 90), 140);
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
    const availableWidth = windowSize.width - (padding * 2);

    const widthConstraint = availableWidth / (1.2 * targetCols + 0.4);

    // Calculate max size by height
    // Considering hexagonal packing overlap (approx 0.85 height per row factor + offset)
    const heightFactor = 0.85;
    const availableHeight = windowSize.height - (padding * 2);
    // Height needed = size + (rows - 1) * size * heightFactor
    // availableHeight = size * (1 + (rows - 1) * heightFactor)
    // size = availableHeight / (1 + (rows - 1) * heightFactor)
    const heightConstraint = availableHeight / (1 + (rows - 1) * heightFactor);

    let size = Math.min(widthConstraint, heightConstraint);

    // Clamp size - allow much smaller circles on mobile to fit everything
    size = Math.min(Math.max(size, 30), 120);

    return { cols: targetCols, circleSize: size };
  }, [windowSize.width, windowSize.height]);

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
              return (
                <motion.div
                  key={circle.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: circle.delay || 0,
                    ease: [0.4, 0, 0.2, 1],
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
