import React, { useState, useEffect } from 'react';
import { Player, GameSettings } from '../types';
import { Dice3D } from './Dice3D';
import { soundEffects } from '../utils/sound';
import { Swords, Sparkles, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TieBreakerModalProps {
  tiedPlayers: Player[];
  settings: GameSettings;
  isOpen: boolean;
  onResolved: (rankedTiedPlayers: Player[]) => void;
}

export const TieBreakerModal: React.FC<TieBreakerModalProps> = ({
  tiedPlayers,
  settings,
  isOpen,
  onResolved,
}) => {
  const [pkPlayers, setPkPlayers] = useState<Player[]>([]);
  const [activePlayerIdx, setActivePlayerIdx] = useState(0);

  useEffect(() => {
    if (isOpen && tiedPlayers.length > 0) {
      setPkPlayers(
        tiedPlayers.map((p) => ({
          ...p,
          dice: Array(1).fill(1), // In tie breaker PK, 1 decisive die is used
          isRolling: false,
          hasRolled: false,
          totalScore: 0,
        }))
      );
      setActivePlayerIdx(0);
    }
  }, [isOpen, tiedPlayers]);

  if (!isOpen || pkPlayers.length === 0) return null;

  const currentPlayer = pkPlayers[activePlayerIdx];
  const allRolled = pkPlayers.every((p) => p.hasRolled);

  // Check if PK itself resulted in another tie
  const hasTieInPk = () => {
    if (!allRolled) return false;
    const scores = pkPlayers.map((p) => p.totalScore);
    return new Set(scores).size !== scores.length;
  };

  const handleStartRolling = (idx: number) => {
    soundEffects.playDiceShake();
    setPkPlayers((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, isRolling: true } : p))
    );
  };

  const handleStopRolling = (idx: number) => {
    const rolledVal = Math.floor(Math.random() * 6) + 1;
    soundEffects.playDiceLand();

    setPkPlayers((prev) => {
      const next = prev.map((p, i) =>
        i === idx
          ? {
              ...p,
              isRolling: false,
              hasRolled: true,
              dice: [rolledVal],
              totalScore: rolledVal,
            }
          : p
      );
      return next;
    });

    if (activePlayerIdx < pkPlayers.length - 1) {
      setActivePlayerIdx((prev) => prev + 1);
    }
  };

  const handleCompletePk = () => {
    // Rank players based on compareMode
    const sorted = [...pkPlayers].sort((a, b) => {
      if (settings.compareMode === 'highest') {
        return b.totalScore - a.totalScore;
      } else {
        return a.totalScore - b.totalScore;
      }
    });

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      soundEffects.playFanfare();
    } catch {
      // ignore
    }

    onResolved(sorted);
  };

  const handleRerollPk = () => {
    soundEffects.playClick();
    setPkPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        dice: [1],
        isRolling: false,
        hasRolled: false,
        totalScore: 0,
      }))
    );
    setActivePlayerIdx(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Banner */}
        <div className="bg-[#FF6B6B] p-5 text-white text-center border-b-4 border-black">
          <div className="inline-flex items-center justify-center p-2.5 bg-[#FFDE59] text-black rounded-2xl mb-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Swords className="w-7 h-7 text-black animate-bounce" />
          </div>
          <h2 className="text-2xl font-black tracking-wide text-white">⚔️ 排名賽 PK 決鬥！</h2>
          <p className="text-xs text-white/90 font-bold mt-1">
            同分出現！請進行 1 顆骰子決戰，決定先後遊玩順序！
          </p>
        </div>

        {/* Tied Players List */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {pkPlayers.map((player, idx) => {
              const isCurrent = idx === activePlayerIdx && !player.hasRolled;
              return (
                <div
                  key={player.id}
                  className={`p-4 rounded-2xl border-3 border-black transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-[#FFF8D6] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black scale-[1.02]'
                      : player.hasRolled
                      ? 'bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-1 bg-[#FFF8D6] rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {player.avatar}
                    </span>
                    <div>
                      <div className="font-black text-[#2D2D2D] flex items-center gap-1.5">
                        <span>{player.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-[#FF6B6B] text-white font-black px-2 py-0.5 rounded-full border border-black">
                            輪到你擲骰
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-[#2D2D2D]/70">
                        {player.hasRolled ? (
                          <span className="text-[#FF6B6B] font-black">
                            點數：{player.totalScore} 點
                          </span>
                        ) : (
                          '準備投骰中...'
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dice / Action */}
                  <div className="flex items-center gap-3">
                    <Dice3D
                      value={player.dice[0]}
                      isRolling={player.isRolling}
                      size="md"
                      color={player.color}
                    />

                    {!player.hasRolled && (
                      <div>
                        {settings.rollTriggerMode === 'press_hold' ? (
                          <button
                            type="button"
                            onMouseDown={() => handleStartRolling(idx)}
                            onMouseUp={() => handleStopRolling(idx)}
                            onTouchStart={() => handleStartRolling(idx)}
                            onTouchEnd={() => handleStopRolling(idx)}
                            className="px-4 py-2.5 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-black text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all select-none"
                          >
                            {player.isRolling ? '放開停骰！' : '按住搖骰'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (!player.isRolling) {
                                handleStartRolling(idx);
                              } else {
                                handleStopRolling(idx);
                              }
                            }}
                            className="px-4 py-2.5 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-black text-xs rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                          >
                            {player.isRolling ? '點擊停骰' : '點擊搖骰'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PK Result & Actions */}
          {allRolled && (
            <div className="mt-4 pt-4 border-t-2 border-black/10 text-center">
              {hasTieInPk() ? (
                <div className="space-y-2">
                  <p className="text-sm font-black text-[#FF6B6B]">
                    天啊！PK居然又同分了！請再戰一回合！
                  </p>
                  <button
                    type="button"
                    onClick={handleRerollPk}
                    className="px-6 py-2.5 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-black text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  >
                    🔄 再 PK 一次！
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleCompletePk}
                  className="w-full py-3.5 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black text-base rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  確認 PK 結果並排定名次
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
