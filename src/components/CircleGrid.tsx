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
    // We want a fixed layout look, not filling the whole screen width blindly.
    // Target roughly 5-6 columns on desktop.
    let targetCols = 6;
    if (windowSize.width < 1024) targetCols = 5;
    if (windowSize.width < 768) targetCols = 4;
    if (windowSize.width < 640) targetCols = 3;
    if (windowSize.width < 480) targetCols = 2;

    // Calculate circle size to fit within the viewport comfortably
    const gap = 15;
    const availableWidth = Math.min(windowSize.width, 1400) - 40; // max width constrained, minus padding
    let size = (availableWidth / targetCols) - gap;

    // Clamp size
    size = Math.min(Math.max(size, 90), 140);

    return { cols: targetCols, circleSize: size };
  }, [windowSize.width]);

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
