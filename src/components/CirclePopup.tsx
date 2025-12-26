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
        <motion.div
            layoutId={`circle-container-${circle.id}`}
            className="fixed inset-0 top-[50px] z-[100] flex flex-col bg-background/50 backdrop-blur-sm"
            initial={{ borderTopLeftRadius: "50%", borderTopRightRadius: "50%" }}
            animate={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
            exit={{ borderTopLeftRadius: "50%", borderTopRightRadius: "50%" }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
        >
            {/* Container for the constrained "Card" visual */}
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-4xl h-full max-h-full bg-card/90 rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden relative">

                    {/* Background of the expanding circle (inside the card now for containment) */}
                    <div className="absolute inset-0 neu-circle opacity-100 pointer-events-none" />

                    {/* Fixed Header with Back Button */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="relative z-50 flex items-center p-4 md:p-6 shrink-0 border-b border-white/5 bg-card/50 backdrop-blur-sm"
                    >
                        <button
                            onClick={onClose}
                            className="neu-tile flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-all hover:scale-105 active:scale-95"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    </motion.div>

                    {/* Scrollable Content Area */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative flex-1 overflow-y-auto z-10 custom-scrollbar overscroll-contain"
                    >
                        <div className="w-full flex flex-col pb-8">
                            <CircleContent circle={circle} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default CirclePopup;
