import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CircleData } from "@/data/circleData";
import CircleContent from "./CircleContent";

interface CirclePopupProps {
    circle: CircleData;
    onClose: () => void;
}

const CirclePopup = ({ circle, onClose }: CirclePopupProps) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* 1. Independent Backdrop Layer - Fades in/out only */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-background/60 backdrop-blur-md pointer-events-auto"
                onClick={onClose}
            />

            {/* 2. Hardware Accelerated Expanding Card */}
            <motion.div
                layoutId={`circle-container-${circle.id}`}
                className="relative w-full max-w-4xl h-[85vh] md:h-[90vh] bg-card rounded-3xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto border border-white/10"
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                }}
            >
                {/* Background decorative elements */}
                <div className="absolute inset-0 neu-circle opacity-100 pointer-events-none" />

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                    className="relative z-50 flex items-center p-4 md:p-6 shrink-0 border-b border-white/5 bg-card/50 backdrop-blur-sm"
                >
                    <button
                        onClick={onClose}
                        className="neu-tile flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <div className="ml-4 font-semibold text-lg text-primary/80">
                        {circle.label}
                    </div>
                </motion.div>

                {/* Scrollable Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.15, duration: 0.2 }}
                    className="relative flex-1 overflow-y-auto z-10 custom-scrollbar overscroll-contain p-4 md:p-8"
                >
                    <CircleContent circle={circle} />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CirclePopup;
