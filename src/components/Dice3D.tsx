import React, { useEffect, useState } from 'react';
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
  color = '#4f46e5',
  delay = 0,
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  // During roll animation, randomly scramble display number
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRolling) {
      interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 75);
    } else {
      setDisplayValue(value);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRolling, value]);

  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl p-1.5 border-2 border-black text-xs',
    md: 'w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-2 sm:p-2.5 border-3 border-black text-sm',
    lg: 'w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-3 sm:p-3.5 border-4 border-black text-base',
    xl: 'w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-4 sm:p-5 border-4 border-black text-lg',
  }[size];

  const dotSize = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5 sm:w-3 sm:h-3',
    lg: 'w-4 h-4 sm:w-4.5 sm:h-4.5',
    xl: 'w-5 h-5 sm:w-6 sm:h-6',
  }[size];

  // Render standard dice pip patterns in a 3x3 grid
  const renderPips = (val: number) => {
    const isOne = val === 1;
    // Pip positions: 0 to 8 (top-left, top-mid, top-right, mid-left, center, mid-right, btm-left, btm-mid, btm-right)
    const activeMap: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    };
    const activePips = activeMap[val] || [4];

    return (
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full pointer-events-none">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => {
          const isActive = activePips.includes(idx);
          return (
            <div key={idx} className="flex items-center justify-center">
              {isActive && (
                <div
                  className={`rounded-full transition-all duration-100 ${dotSize}`}
                  style={{
                    backgroundColor: isOne ? '#FF6B6B' : '#2D2D2D',
                    boxShadow: isOne 
                      ? 'inset 0 1px 2px rgba(0,0,0,0.4)' 
                      : 'inset 0 1px 2px rgba(0,0,0,0.6)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={
        isRolling
          ? {
              rotateX: [0, 180, 360, 540, 720],
              rotateY: [0, -180, -360, -540, -720],
              rotateZ: [0, 45, -45, 90, 0],
              scale: [1, 1.15, 0.9, 1.1, 1],
              y: [0, -16, 4, -8, 0],
            }
          : {
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              scale: 1,
              y: 0,
            }
      }
      transition={
        isRolling
          ? {
              repeat: Infinity,
              duration: 0.5,
              ease: 'easeInOut',
              delay: delay * 0.05,
            }
          : {
              type: 'spring',
              stiffness: 400,
              damping: 20,
            }
      }
      className={`relative select-none flex items-center justify-center bg-white text-[#2D2D2D] ${sizeClasses}`}
      style={{
        boxShadow: isRolling
          ? `0 10px 25px -5px ${color}66, 4px 4px 0px 0px rgba(0,0,0,1)`
          : '3px 3px 0px 0px rgba(0,0,0,1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {renderPips(displayValue)}
    </motion.div>
  );
};
