import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CircleData } from "@/data/circleData";
import CircleContent from "./CircleContent";
import { useIsMobile } from "@/hooks/use-mobile";

interface CirclePopupProps {
    circle: CircleData;
    onClose: () => void;
}

const CirclePopup = ({ circle, onClose }: CirclePopupProps) => {
    const isMobile = useIsMobile();

    // Mobile-optimized animation settings
    const backdropTransition = isMobile ? {
        duration: 0.1,
        ease: [0.4, 0.0, 0.2, 1]
    } : {
        duration: 0.15,
        ease: [0.4, 0.0, 0.2, 1]
    };

    const cardTransition = isMobile ? {
        type: "spring" as const,
        stiffness: 500,
        damping: 45,
        mass: 0.4,
        velocity: 3
    } : {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
        mass: 0.6,
        velocity: 2
    };
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* 1. Mobile-optimized Backdrop Layer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={backdropTransition}
                className={`absolute inset-0 bg-background/60 pointer-events-auto ${
                    isMobile ? '' : 'backdrop-blur-md'
                }`}
                onClick={onClose}
                style={{
                    willChange: 'opacity',
                    WebkitBackdropFilter: isMobile ? 'none' : 'blur(10px)'
                }}
            />

            {/* 2. Mobile-optimized Expanding Card */}
            <motion.div
                layoutId={`circle-container-${circle.id}`}
                className="relative w-full max-w-4xl h-[85vh] md:h-[90vh] bg-card rounded-3xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto border border-white/10"
                transition={cardTransition}
                style={{
                    willChange: 'transform',
                    transform: 'translate3d(0, 0, 0)',
                    WebkitTransform: 'translate3d(0, 0, 0)',
                    backfaceVisibility: 'hidden',
                    perspective: 1000
                }}
            >
                {/* Background decorative elements */}
                <div className="absolute inset-0 neu-circle opacity-100 pointer-events-none" />

                {/* Header - Mobile-optimized animation */}
                <motion.div
                    initial={{ opacity: 0, y: isMobile ? -4 : -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: isMobile ? 0.05 : 0.08,
                        duration: isMobile ? 0.15 : 0.2,
                        ease: [0.4, 0.0, 0.2, 1]
                    }}
                    className="relative z-50 flex items-center p-4 md:p-6 shrink-0 border-b border-white/5 bg-card/50 backdrop-blur-sm"
                    style={{
                        willChange: 'opacity, transform',
                        WebkitTransform: 'translate3d(0, 0, 0)'
                    }}
                >
                    <button
                        onClick={onClose}
                        className="neu-tile flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-all duration-150 hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="ml-4 font-semibold text-lg text-primary/80">
                        {circle.label}
                    </div>
                </motion.div>

                {/* Scrollable Content - Mobile-optimized animation */}
                <motion.div
                    initial={{ opacity: 0, y: isMobile ? 6 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: isMobile ? 0.08 : 0.12,
                        duration: isMobile ? 0.2 : 0.25,
                        ease: [0.4, 0.0, 0.2, 1]
                    }}
                    className="relative flex-1 overflow-y-auto z-10 custom-scrollbar overscroll-contain p-4 md:p-8"
                    style={{
                        willChange: 'opacity, transform',
                        WebkitTransform: 'translate3d(0, 0, 0)'
                    }}
                >
                    <CircleContent circle={circle} isMobile={isMobile} />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CirclePopup;
