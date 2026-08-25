import React, { useState, useEffect, useRef } from 'react';
import { Player, GameSettings } from '../types';
import { soundEffects } from '../utils/sound';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Plus, 
  Minus, 
  Trophy, 
  Sparkles, 
  PartyPopper, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Flame,
  Gamepad2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ToyPlayTimerProps {
  rankedPlayers: Player[];
  settings: GameSettings;
  onRematch: () => void;
  onBackToGame: () => void;
}

export const ToyPlayTimer: React.FC<ToyPlayTimerProps> = ({
  rankedPlayers,
  settings,
  onRematch,
  onBackToGame,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.timerDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPlayerIds, setCompletedPlayerIds] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentPlayer = rankedPlayers[currentIdx] || rankedPlayers[0];
  const isAllFinished = completedPlayerIds.length >= rankedPlayers.length;

  // Reset timer duration if settings change
  useEffect(() => {
    setTimeLeft(settings.timerDuration);
  }, [settings.timerDuration]);

  // Main countdown loop
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        // Ticking sound in last 5 seconds
        if (timeLeft <= 5 && timeLeft > 0) {
          soundEffects.playTimerTick();
        }
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Time is up!
      setIsRunning(false);
      soundEffects.playTimerFinish();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
      setShowCelebration(true);

      // Auto add current player to completed list
      if (currentPlayer && !completedPlayerIds.includes(currentPlayer.id)) {
        setCompletedPlayerIds((prev) => [...prev, currentPlayer.id]);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft, currentPlayer, completedPlayerIds]);

  const handleToggleTimer = () => {
    soundEffects.playClick();
    if (timeLeft === 0) {
      // restart timer for current player
      setTimeLeft(settings.timerDuration);
      setIsRunning(true);
      setShowCelebration(false);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleNextPlayer = () => {
    soundEffects.playClick();
    setShowCelebration(false);
    
    // Mark current player as played
    if (currentPlayer && !completedPlayerIds.includes(currentPlayer.id)) {
      setCompletedPlayerIds((prev) => [...prev, currentPlayer.id]);
    }

    if (currentIdx < rankedPlayers.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setTimeLeft(settings.timerDuration);
      setIsRunning(false);
    }
  };

  const handleSelectPlayer = (index: number) => {
    soundEffects.playClick();
    setCurrentIdx(index);
    setTimeLeft(settings.timerDuration);
    setIsRunning(false);
    setShowCelebration(false);
  };

  const handleAddSeconds = (amount: number) => {
    soundEffects.playClick();
    setTimeLeft((prev) => Math.max(1, prev + amount));
  };

  const handleResetCurrent = () => {
    soundEffects.playClick();
    setIsRunning(false);
    setTimeLeft(settings.timerDuration);
    setShowCelebration(false);
  };

  // Progress circle calculation
  const totalDuration = Math.max(settings.timerDuration, timeLeft);
  const progressPercent = (timeLeft / (totalDuration || 1)) * 100;
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#4ECDC4] p-6 rounded-3xl text-[#2D2D2D] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-3 bg-[#FFDE59] rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Clock className="w-8 h-8 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="bg-[#FFDE59] text-black text-xs font-black uppercase px-2.5 py-0.5 rounded-full border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                爭端解決計時器
              </span>
              <span className="text-xs text-[#2D2D2D]/80 font-bold">
                依排名順序輪流玩
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-1 text-[#2D2D2D]">
              玩具輪流玩時間 🧸
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToGame}
            className="px-4 py-2.5 bg-white hover:bg-[#FFF8D6] rounded-xl font-black text-xs sm:text-sm text-[#2D2D2D] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
          >
            <Gamepad2 className="w-4 h-4" />
            查看骰子結果
          </button>
          <button
            type="button"
            onClick={onRematch}
            className="px-5 py-2.5 bg-[#FF6B6B] text-white hover:bg-[#ff5252] rounded-xl font-black text-xs sm:text-sm border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            重新比賽
          </button>
        </div>
      </div>

      {/* Main Timer Display & Current Player Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Main Section: Active Player Timer (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col items-center justify-between text-center relative overflow-hidden">
          {/* Top colored strip */}
          <div 
            className="absolute top-0 inset-x-0 h-3 border-b-2 border-black"
            style={{ backgroundColor: currentPlayer?.color || '#FFDE59' }}
          />

          {/* Current Player Header */}
          <div className="w-full mb-4 pt-2">
            <div className="inline-flex items-center gap-2 bg-[#FFF8D6] px-4 py-1.5 rounded-full text-xs font-black text-[#2D2D2D] mb-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span>👑 目前輪到第 {currentPlayer?.rank} 名</span>
              {completedPlayerIds.includes(currentPlayer?.id) && (
                <span className="text-[#2D2D2D] font-black flex items-center gap-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 已完成遊玩
                </span>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl sm:text-5xl p-2.5 bg-[#FFF8D6] rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {currentPlayer?.avatar}
              </span>
              <div className="text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-[#2D2D2D]">
                  {currentPlayer?.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#2D2D2D]/70 font-bold">
                  骰子點數：{currentPlayer?.totalScore} 點
                </p>
              </div>
            </div>
          </div>

          {/* Circular Countdown Display */}
          <div className="relative my-4 flex items-center justify-center">
            <svg className="w-56 h-56 sm:w-64 sm:h-64 -rotate-90 transform">
              {/* Background circle track */}
              <circle
                cx="50%"
                cy="50%"
                r="70"
                className="text-[#2D2D2D]/10"
                strokeWidth="14"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated progress circle */}
              <circle
                cx="50%"
                cy="50%"
                r="70"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="14"
                stroke={timeLeft <= 5 ? '#FF6B6B' : '#4ECDC4'}
                fill="transparent"
                className="transition-all duration-300 ease-linear"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <span
                className={`text-4xl sm:text-5xl font-black tracking-tight font-mono transition-colors ${
                  timeLeft <= 5 ? 'text-[#FF6B6B] animate-pulse' : 'text-[#2D2D2D]'
                }`}
              >
                {formattedTime}
              </span>
              <span className="text-xs font-black text-[#2D2D2D]/60 mt-1 uppercase tracking-wider">
                {timeLeft === 0 ? '時間到！' : isRunning ? '計時遊玩中...' : '暫停中'}
              </span>
            </div>
          </div>

          {/* Quick Adjustment Pills */}
          <div className="flex items-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => handleAddSeconds(-10)}
              className="px-3 py-1.5 bg-white hover:bg-[#FFF8D6] text-[#2D2D2D] font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              <Minus className="w-3.5 h-3.5" /> 10秒
            </button>
            <button
              type="button"
              onClick={() => handleAddSeconds(10)}
              className="px-3 py-1.5 bg-white hover:bg-[#FFF8D6] text-[#2D2D2D] font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="w-3.5 h-3.5" /> 10秒
            </button>
            <button
              type="button"
              onClick={() => handleAddSeconds(30)}
              className="px-3 py-1.5 bg-white hover:bg-[#FFF8D6] text-[#2D2D2D] font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              <Plus className="w-3.5 h-3.5" /> 30秒
            </button>
            <button
              type="button"
              onClick={handleResetCurrent}
              title="重設目前計時"
              className="p-1.5 bg-white hover:bg-[#FFF8D6] text-[#2D2D2D] rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Main Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleToggleTimer}
              className={`flex-1 py-4 px-6 rounded-2xl font-black text-base sm:text-lg border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 ${
                isRunning
                  ? 'bg-[#FFDE59] text-black hover:bg-[#ebd052]'
                  : 'bg-[#4ECDC4] text-black hover:bg-[#3dbdb4]'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-6 h-6 fill-current" />
                  暫停計時
                </>
              ) : timeLeft === 0 ? (
                <>
                  <RotateCcw className="w-6 h-6" />
                  再玩一次 ({settings.timerDuration}秒)
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  開始計時
                </>
              )}
            </button>

            {currentIdx < rankedPlayers.length - 1 && (
              <button
                type="button"
                onClick={handleNextPlayer}
                className="py-4 px-6 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-black rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
              >
                <span>換下一位</span>
                <SkipForward className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Time-up modal / Alert banner */}
          {showCelebration && (
            <div className="absolute inset-0 bg-[#2D2D2D]/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center animate-in fade-in zoom-in-95 duration-200 z-20">
              <PartyPopper className="w-16 h-16 text-[#FFDE59] animate-bounce mb-3" />
              <h3 className="text-3xl font-black">時間到囉！⏰</h3>
              <p className="text-slate-200 font-bold text-sm mt-1 mb-6 max-w-xs">
                {currentPlayer?.name} 的玩具時間結束了，換下一位小朋友開心地玩玩具吧！
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                {currentIdx < rankedPlayers.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextPlayer}
                    className="w-full py-3.5 px-5 bg-[#FFDE59] hover:bg-[#ebd052] text-black font-black rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                  >
                    <span>換下一位：{rankedPlayers[currentIdx + 1]?.name}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCelebration(false)}
                    className="w-full py-3.5 px-5 bg-white text-[#2D2D2D] font-black rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    🎉 全員遊玩完成！
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Ordered Turn Roster & Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-black/10">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-black" />
                <h3 className="font-black text-[#2D2D2D] text-lg">輪流遊玩順序名單</h3>
              </div>
              <span className="text-xs font-black text-[#2D2D2D]/70 bg-[#FFF8D6] px-2 py-1 rounded-lg border border-black">
                {completedPlayerIds.length} / {rankedPlayers.length} 已玩過
              </span>
            </div>

            {/* Players ordered list */}
            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {rankedPlayers.map((p, idx) => {
                const isSelected = idx === currentIdx;
                const isCompleted = completedPlayerIds.includes(p.id);

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPlayer(idx)}
                    className={`w-full p-3.5 rounded-2xl border-3 border-black transition-all text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#FFDE59] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
                        : isCompleted
                        ? 'bg-slate-100 opacity-70 shadow-none'
                        : 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank badge */}
                      <div
                        className={`w-7 h-7 rounded-xl border-2 border-black flex items-center justify-center font-black text-xs shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                          p.rank === 1
                            ? 'bg-[#FFDE59] text-black'
                            : p.rank === 2
                            ? 'bg-[#4ECDC4] text-black'
                            : p.rank === 3
                            ? 'bg-[#FF6B6B] text-white'
                            : 'bg-white text-black'
                        }`}
                      >
                        {p.rank}
                      </div>

                      {/* Avatar */}
                      <span className="text-2xl p-1 bg-[#FFF8D6] rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {p.avatar}
                      </span>

                      <div>
                        <div className="font-black text-[#2D2D2D] text-sm flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {isSelected && (
                            <span className="text-[10px] bg-[#FF6B6B] text-white font-black px-2 py-0.5 rounded-full border border-black">
                              正在遊玩
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#2D2D2D]/60 font-bold">
                          點數：{p.totalScore} 點
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div>
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-xs font-black text-[#2D2D2D] bg-[#FFF8D6] border border-black px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          已玩過
                        </span>
                      ) : isSelected ? (
                        <span className="text-xs font-black text-black bg-[#4ECDC4] border border-black px-2.5 py-1 rounded-full animate-pulse">
                          ⏳ 計時中
                        </span>
                      ) : (
                        <span className="text-xs font-black text-[#2D2D2D]/40">
                          等待中
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Reminder for Fair Play */}
          <div className="mt-6 pt-4 border-t-2 border-black/10 bg-[#FFFCE8] p-4 rounded-2xl border-2 border-black">
            <div className="flex items-center gap-2 text-xs font-black text-[#2D2D2D] mb-1">
              <Sparkles className="w-4 h-4 text-black" />
              <span>公平分享小約定</span>
            </div>
            <p className="text-xs text-[#2D2D2D]/80 font-bold leading-relaxed">
              鈴聲響起時請主動將玩具遞給下一位小朋友，輪流分享玩具讓友情更加深厚！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
