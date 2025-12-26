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
  // Responsive Grid Layout
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Initial set
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { cols, circleSize, verticalGap, horizontalGap, wrapperPadding } = useMemo(() => {
    const totalCircles = 24;

    // --- Desktop Layout (Fixed constraints) ---
    if (windowSize.width >= 1024) {
      const targetCols = 6;
      const rows = 4;
      const gap = 15;
      const padding = 20;
      const safetyBuffer = 60;

      const availableWidth = Math.min(windowSize.width, 1400) - (padding * 2);
      const sizeByWidth = (availableWidth / targetCols) - gap;

      const heightFactor = 0.85;
      const availableHeight = windowSize.height - (padding * 2) - safetyBuffer;
      const sizeByHeight = availableHeight / (1 + (rows - 1) * heightFactor);

      let size = Math.min(sizeByWidth, sizeByHeight);
      size = Math.min(Math.max(size, 50), 130);

      return {
        cols: targetCols,
        circleSize: size,
        verticalGap: -(size * 0.25), // Standard overlap for desktop
        horizontalGap: size * 0.2, // Standard gap
        wrapperPadding: 20
      };
    }

    // --- Mobile/Tablet Dense Layout ---
    // Goal: Fully cover the screen with NO empty space.

    // 1. Determine optimal grid shape (Cols x Rows)
    // We want the grid's aspect ratio to match the screen's AR as closely as possible.
    // Factors of 24: 1x24, 2x12, 3x8, 4x6, 6x4...
    const screenAR = windowSize.width / windowSize.height;
    const padding = windowSize.width < 480 ? 5 : 10; // Minimal padding on mobile

    const validConfigs = [
      { c: 3, r: 8 },
      { c: 4, r: 6 },
      { c: 5, r: 5 }, // Approx for 24 (one empty or filled) - let's stick to exact factors for now or ceil
      { c: 6, r: 4 }
    ];

    // Find config that yields the largest circles while fitting within aspect ratio
    // Ideally, we want the one where (TotalWidth / TotalHeight) ~ ScreenAR
    // Width ~ c, Height ~ r. So look for c/r closest to screenAR.
    let bestConfig = validConfigs[0];

    // Explicit override for standard mobile portrait width
    if (windowSize.width < 550) {
      bestConfig = { c: 3, r: 8 };
    } else {
      let minDiff = Number.MAX_VALUE;

      for (const config of validConfigs) {
        const configAR = config.c / config.r; // Rough grid AR
        const diff = Math.abs(configAR - screenAR);
        if (diff < minDiff) {
          minDiff = diff;
          bestConfig = config;
        }
      }
    }

    // Force 3 columns on very narrow screens if 4 makes them too small, 
    // but usually the AR check covers this (3/8 = 0.375, 4/6 = 0.66).
    // Typical phones are ~0.45-0.5. 3x8 is usually best for portrait.

    const targetCols = bestConfig.c;
    const rows = Math.ceil(totalCircles / targetCols);

    // 2. Calculate Max Size
    // We need to fit 'targetCols' horizontally and 'rows' vertically.
    // Hex layout width approx: size * cols + gap * (cols-1) + stagger/2
    // Let's assume tight packing:
    // W = cols * size
    // H = rows * size * 0.85 (vertical overlap)

    const availableW = windowSize.width - (padding * 2);
    const availableH = windowSize.height - (padding * 2);

    // Size constrained by width
    // We want some small horizontal gap for breathing room, say 5% of size? 
    // Or actually, user said "No empty space".
    // Let's solve for size assuming we touch edges.
    // W = size * targetCols * 1.05 (small gap factor)
    const sizeByW = availableW / (targetCols * 1.05 + 0.5); // +0.5 for stagger offset

    // Size constrained by height
    // H = size * (1 + (rows - 1) * 0.85)
    // We want to FILL height.
    const heightFactor = 0.82; // Slightly tighter overlap
    const sizeByH = availableH / (1 + (rows - 1) * heightFactor);

    // Use the limiting dimension
    let size = Math.min(sizeByW, sizeByH);

    // Clamp size logic re-introduced to safe-guard bounds
    size = Math.min(Math.max(size, 30), 300);

    // 3. Dynamic Spacing to fill remaining space
    // If we limited by width, we might have extra height, and vice versa.
    // actually, we want to STRETCH to fill.
    // But we can't stretch the circle itself (it must remain circular).
    // We must increase the gaps.

    // Re-calculate gaps based on the chosen 'size'.

    // Height coverage:
    // UsedHeight = size * (1 + (rows - 1) * heightFactor)
    // If UsedHeight < availableH, we can increase heightFactor (less overlap/more gap).
    // desiredTotalHeight = availableH
    // size + (rows - 1) * effectiveStepY = availableH
    // effectiveStepY = (availableH - size) / (rows - 1)
    // vertical overlap offset = effectiveStepY - size

    let effectiveStepY = (availableH - size) / Math.max(1, rows - 1);
    // Ensure we don't overlap TOO much (min step) or separate too much
    // effectiveStepY should be ~ size * 0.8 to size * 1.1

    // Clamp vertical gap to ensure density
    // If effectiveStepY is huge, it means we have fewer rows than needed to fill height densely -> should have picked diff config?
    // But we picked best config. Just center or allow gap.
    // User said "No empty space".

    // Refinement: If sizeByW << sizeByH (screen is very tall relative to width),
    // we are width-limited. The circles are small. Current config (e.g. 3x8) leaves vertical space?
    // If 3x8 leaves vertical space, we should increase size? We can't, width is maxed.
    // So we must increase vertical spacing.

    let verticalShift = effectiveStepY - size; // This will be negative for overlap

    // Recalculate horizontal distribution
    // Width = size * cols + (cols-1)*gapX + stagger
    // availableW - stagger*size = size*cols + (cols-1)*gapX
    // gapX = (availableW - (size * (cols + 0.5))) / (cols - 1)

    let gapX = (availableW - (size * (targetCols + 0.5))) / Math.max(1, targetCols - 1);
    gapX = Math.max(0, gapX); // Never negative

    return {
      cols: targetCols,
      circleSize: size,
      verticalGap: verticalShift,
      horizontalGap: gapX,
      wrapperPadding: padding
    };

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
              gap: `${horizontalGap}px`,
              padding: `${wrapperPadding}px`,
              width: '100%',
              justifyContent: 'center',
              alignContent: 'center', // Center vertically if logic leaves small gaps
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
                    marginLeft: isOddRow ? `${circleSize * 0.5}px` : '0', // Standard 50% shift for hex
                    marginRight: isOddRow ? `-${circleSize * 0.5}px` : '0',
                    marginBottom: `${verticalGap}px`, // Dynamic vertical overlap/gap
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
