import { memo } from "react";
import { motion } from "framer-motion";

/**
 * AtmosphericBackground
 * A high-performance, visually stunning background with moving mesh orbs.
 * Uses framer-motion for smooth, hardware-accelerated animations.
 * Optimized: Reduced orbs from 4 to 2, increased duration for smoother animations
 */
const AtmosphericBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#020617]">
            {/* Primary Atmospheric Base */}
            <div className="absolute inset-0 bg-[#020617]" />

            {/* Moving Mesh Orbs - Optimized to 2 orbs for better performance */}

            {/* Indigo Orb - Top Left to Center */}
            <motion.div
                animate={{
                    x: [-100, 200, -100],
                    y: [-100, 300, -100],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 30, // Increased from 20s for smoother animation
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{ willChange: "transform" }}
                className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px]"
            />

            {/* Fuchsia Orb - Top Right to Bottom Left */}
            <motion.div
                animate={{
                    x: [100, -300, 100],
                    y: [-100, 500, -100],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 35, // Increased from 25s for smoother animation
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{ willChange: "transform" }}
                className="absolute top-0 right-0 w-[700px] h-[700px] bg-fuchsia-600/15 rounded-full blur-[130px]"
            />

            {/* Subtle Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'url("https://grains.com/noise.png")' }}></div>
        </div>
    );
};

// Memoize to prevent unnecessary re-renders
export default memo(AtmosphericBackground);
