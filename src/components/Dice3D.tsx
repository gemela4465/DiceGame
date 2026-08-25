import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  delay?: number;
}

export const Dice3D: React.FC<DiceProps> = ({
  value,
  isRolling,
  size = 'md',
  color = '#FF6B6B',
  delay = 0,
}) => {
  // displayValue stays at final `value` once rolling stops!
  const [displayValue, setDisplayValue] = useState(value);
  const [justLanded, setJustLanded] = useState(false);
  const prevRollingRef = useRef(isRolling);

  // During rolling, randomize faces at high frequency; when stopped, IMMEDIATELY set to exact result value
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRolling) {
      setJustLanded(false);
      // Fast tumbling face change
      interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 50);
    } else {
      // Stopped: firmly show the final calculated value
      setDisplayValue(value);
      if (prevRollingRef.current && !isRolling) {
        setJustLanded(true);
        const timer = setTimeout(() => setJustLanded(false), 550);
        return () => clearTimeout(timer);
      }
    }
    prevRollingRef.current = isRolling;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRolling, value]);

  // Synchronize displayValue whenever prop value updates while not rolling
  useEffect(() => {
    if (!isRolling) {
      setDisplayValue(value);
    }
  }, [value, isRolling]);

  const sizeDimensions = {
    sm: 'w-10 h-10 rounded-xl p-1.5 border-2 border-black text-xs',
    md: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-2 sm:p-2.5 border-3 border-black text-sm',
    lg: 'w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border-3 sm:border-4 border-black text-base',
    xl: 'w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-4 sm:p-5 border-4 border-black text-lg',
  }[size];

  const dotSize = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5 sm:w-3 sm:h-3',
    lg: 'w-3.5 h-3.5 sm:w-4.5 sm:h-4.5',
    xl: 'w-5 h-5 sm:w-6 sm:h-6',
  }[size];

  // Render authentic dice pip patterns with carved depth
  const renderPips = (val: number) => {
    const isOne = val === 1;
    // Pip index layout 0..8 (3x3 grid)
    const activeMap: Record<number, number[]> = {
      1: [4],
      2: [2, 6],
      3: [2, 4, 6],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    const activePips = activeMap[val] || [4];

    return (
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full pointer-events-none items-center justify-items-center">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
          const isActive = activePips.includes(idx);
          if (!isActive) return <div key={idx} className="w-full h-full" />;

          // If 1, prominent red bullseye carved pip
          if (isOne) {
            return (
              <div key={idx} className="flex items-center justify-center w-full h-full">
                <div
                  className={`rounded-full transition-all duration-75 ${
                    size === 'sm'
                      ? 'w-3.5 h-3.5'
                      : size === 'md'
                      ? 'w-5 h-5 sm:w-6 sm:h-6'
                      : size === 'lg'
                      ? 'w-7 h-7 sm:w-9 sm:h-9'
                      : 'w-10 h-10 sm:w-12 sm:h-12'
                  }`}
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #FF7676, #E53935 60%, #990000 100%)',
                    boxShadow:
                      'inset 0 1.5px 3px rgba(0,0,0,0.65), inset 0 -1px 2px rgba(255,255,255,0.45), 0 1px 1px rgba(255,255,255,0.85)',
                  }}
                />
              </div>
            );
          }

          // 2 to 6, carved deep black pips with specular top catch-light
          return (
            <div key={idx} className="flex items-center justify-center w-full h-full">
              <div
                className={`rounded-full transition-all duration-75 ${dotSize}`}
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #555555, #222222 65%, #050505 100%)',
                  boxShadow:
                    'inset 0 1.5px 2.5px rgba(0,0,0,0.8), inset 0 -1px 1px rgba(255,255,255,0.35), 0 1px 1px rgba(255,255,255,0.9)',
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  // Randomized staggered angle & trajectory per die
  const seed = (delay * 47) % 360;
  const rotFactor = (delay % 2 === 0 ? 1 : -1);

  return (
    <div className="relative inline-flex flex-col items-center justify-center p-1 sm:p-2">
      {/* 3D Floor Dynamic Shadow */}
      <motion.div
        animate={
          isRolling
            ? {
                scale: [1, 0.55, 1.25, 0.6, 1.1, 1],
                opacity: [0.65, 0.2, 0.8, 0.25, 0.7, 0.65],
                filter: ['blur(2px)', 'blur(6px)', 'blur(1.5px)', 'blur(5px)', 'blur(2px)'],
                y: [0, 6, -2, 5, 0],
              }
            : justLanded
            ? {
                scale: [0.6, 1.25, 0.95, 1],
                opacity: [0.25, 0.85, 0.65, 0.7],
                filter: 'blur(1.5px)',
                y: 0,
              }
            : {
                scale: 1,
                opacity: 0.7,
                filter: 'blur(1.5px)',
                y: 0,
              }
        }
        transition={
          isRolling
            ? { repeat: Infinity, duration: 0.5, ease: 'easeInOut' }
            : { duration: 0.55, ease: 'easeOut' }
        }
        className="absolute -bottom-1.5 sm:-bottom-2.5 w-[88%] h-3 sm:h-4 bg-black/45 rounded-full pointer-events-none -z-10"
      />

      {/* Realistic 3D Tumbling & Solid Result Landing Dice Body */}
      <motion.div
        initial={false}
        animate={
          isRolling
            ? {
                rotateX: [0, 180 * rotFactor, 360 * rotFactor, 540 * rotFactor, 720 * rotFactor],
                rotateY: [0, -180, -360 - seed, -540, -720],
                rotateZ: [0, 55 * rotFactor, -40 * rotFactor, 65 * rotFactor, 0],
                scale: [1, 1.15, 0.92, 1.1, 0.96, 1],
                y: [0, -28, 4, -18, 2, 0],
                x: [0, -6 * rotFactor, 7 * rotFactor, -4 * rotFactor, 0],
              }
            : justLanded
            ? {
                // Energetic landing bounce: hard impact -> slight tilt back -> settles flush at 0deg
                rotateX: [25 * rotFactor, -12 * rotFactor, 4 * rotFactor, 0],
                rotateY: [-20 * rotFactor, 10 * rotFactor, -3 * rotFactor, 0],
                rotateZ: [12 * rotFactor, -6 * rotFactor, 2 * rotFactor, 0],
                scale: [0.88, 1.12, 0.97, 1],
                y: [-16, 4, -1, 0],
                x: [2 * rotFactor, -1 * rotFactor, 0],
              }
            : {
                // Rock solid idle/result state: squarely facing user with 0 rotation
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                scale: 1,
                y: 0,
                x: 0,
              }
        }
        transition={
          isRolling
            ? {
                repeat: Infinity,
                duration: 0.5,
                ease: 'easeInOut',
                delay: (delay * 0.06) % 0.25,
              }
            : {
                type: 'spring',
                stiffness: 420,
                damping: 20,
                mass: 0.75,
              }
        }
        className={`relative select-none flex items-center justify-center bg-gradient-to-br from-[#FFFFFF] via-[#FAF9F5] to-[#E8E6DC] text-[#2D2D2D] ${sizeDimensions}`}
        style={{
          boxShadow: isRolling
            ? `0 16px 30px -4px ${color}55, 3px 3px 0px 0px rgba(0,0,0,1), inset 1.5px 1.5px 2px rgba(255,255,255,0.95), inset -2px -2px 4px rgba(0,0,0,0.12)`
            : '4px 4px 0px 0px rgba(0,0,0,1), inset 2px 2px 2px rgba(255,255,255,0.95), inset -2px -2px 4px rgba(0,0,0,0.1)',
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
      >
        {/* Specular curved reflection on die top */}
        <div className="absolute top-1 left-1 right-1 h-1/3 bg-gradient-to-b from-white/80 via-white/30 to-transparent rounded-t-xl pointer-events-none" />

        {renderPips(displayValue)}
      </motion.div>
    </div>
  );
};
