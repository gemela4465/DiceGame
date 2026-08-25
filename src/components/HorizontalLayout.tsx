import React from 'react';
import { Player, GameSettings } from '../types';
import { Dice3D } from './Dice3D';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  Flame, 
  MousePointerClick, 
  HandMetal, 
  Edit3, 
  Check, 
  Clock 
} from 'lucide-react';

interface HorizontalLayoutProps {
  players: Player[];
  settings: GameSettings;
  activePlayerIndex: number;
  onStartRoll: (playerIndex: number) => void;
  onStopRoll: (playerIndex: number) => void;
  onEditPlayer: (player: Player) => void;
  isAllRolled: boolean;
  onProceedToTimer: () => void;
}

export const HorizontalLayout: React.FC<HorizontalLayoutProps> = ({
  players,
  settings,
  activePlayerIndex,
  onStartRoll,
  onStopRoll,
  onEditPlayer,
  isAllRolled,
  onProceedToTimer,
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Grid of Players */}
      <div
        className={`grid gap-4 sm:gap-6 ${
          players.length === 1
            ? 'grid-cols-1 max-w-md mx-auto'
            : players.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : players.length === 3
            ? 'grid-cols-1 sm:grid-cols-3'
            : players.length === 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {players.map((player, idx) => {
          const isCurrentActive =
            settings.rollExecutionMode === 'individual'
              ? idx === activePlayerIndex && !player.hasRolled
              : !player.hasRolled;

          const isWinner = isAllRolled && player.rank === 1;

          return (
            <div
              key={player.id}
              className={`relative bg-white rounded-3xl p-5 border-3 sm:border-4 border-black transition-all flex flex-col justify-between overflow-hidden ${
                isWinner
                  ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ring-4 ring-[#FFDE59] scale-[1.02] bg-[#FFFDFA]'
                  : isCurrentActive
                  ? 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ring-4 ring-[#4ECDC4] bg-[#F7FFFE]'
                  : player.hasRolled
                  ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              {/* Top Card Strip Color */}
              <div
                className="absolute top-0 inset-x-0 h-3 border-b-2 border-black"
                style={{ backgroundColor: player.color }}
              />

              {/* Player Info Header */}
              <div className="pt-2">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onEditPlayer(player)}
                      title="點擊自訂頭像與名稱"
                      className="text-3xl p-1.5 bg-[#FFF8D6] hover:bg-[#FFDE59] rounded-2xl border-2 border-black transition-transform active:scale-90 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center relative group"
                    >
                      {player.avatar}
                      <div className="absolute inset-0 bg-black/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Edit3 className="w-3.5 h-3.5 text-[#2D2D2D]" />
                      </div>
                    </button>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-[#2D2D2D] text-base truncate max-w-[120px]">
                          {player.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onEditPlayer(player)}
                          className="text-[#2D2D2D]/60 hover:text-black transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Tournament match wins */}
                      {settings.matchFormat !== 'bo1' && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] text-[#2D2D2D]/70 font-bold">
                            勝場：
                          </span>
                          <span className="text-xs font-black text-[#FF6B6B]">
                            {player.roundWins} 勝
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rank or Rolling status badge */}
                  {isAllRolled && (
                    <div
                      className={`px-3 py-1 rounded-full font-black text-xs border-2 border-black flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        player.rank === 1
                          ? 'bg-[#FFDE59] text-black'
                          : player.rank === 2
                          ? 'bg-[#4ECDC4] text-black'
                          : player.rank === 3
                          ? 'bg-[#FF6B6B] text-white'
                          : 'bg-white text-[#2D2D2D]'
                      }`}
                    >
                      {player.rank === 1 && <Crown className="w-3.5 h-3.5" />}
                      第 {player.rank} 名
                    </div>
                  )}
                </div>

                {/* Dice Display Area */}
                <div className="bg-[#FFFCE8] p-4 rounded-2xl border-2 sm:border-3 border-black shadow-inner min-h-[110px] flex items-center justify-center">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {player.dice.map((dVal, dIdx) => (
                      <Dice3D
                        key={dIdx}
                        value={dVal}
                        isRolling={player.isRolling}
                        size={settings.diceCount > 4 ? 'sm' : settings.diceCount > 2 ? 'md' : 'lg'}
                        color={player.color}
                        delay={dIdx}
                      />
                    ))}
                  </div>
                </div>

                {/* Score Summary */}
                <div className="mt-3 flex items-center justify-between px-1">
                  <span className="text-xs font-black text-[#2D2D2D]/70">
                    {settings.compareMode === 'highest' ? '總點數 (比大)' : '總點數 (比小)'}
                  </span>
                  <span
                    className={`font-black font-mono transition-all ${
                      player.hasRolled
                        ? 'text-xl text-[#2D2D2D]'
                        : 'text-sm text-[#2D2D2D]/40'
                    }`}
                  >
                    {player.hasRolled ? `${player.totalScore} 點` : '未擲骰'}
                  </span>
                </div>
              </div>

              {/* Action Buttons for this player */}
              <div className="mt-4 pt-3 border-t-2 border-black/10">
                {!player.hasRolled ? (
                  settings.rollTriggerMode === 'press_hold' ? (
                    <button
                      type="button"
                      onMouseDown={() => onStartRoll(idx)}
                      onMouseUp={() => onStopRoll(idx)}
                      onTouchStart={() => onStartRoll(idx)}
                      onTouchEnd={() => onStopRoll(idx)}
                      disabled={
                        settings.rollExecutionMode === 'individual' &&
                        idx !== activePlayerIndex
                      }
                      className={`w-full py-3 px-4 rounded-2xl font-black text-sm text-white border-3 border-black select-none flex items-center justify-center gap-1.5 transition-all ${
                        settings.rollExecutionMode === 'individual' &&
                        idx !== activePlayerIndex
                          ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                          : player.isRolling
                          ? 'bg-[#FFDE59] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                          : 'bg-[#FF6B6B] hover:bg-[#ff5252] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <HandMetal className="w-4 h-4" />
                      {player.isRolling ? '放開手指開骰！' : '按住持續搖骰'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (!player.isRolling) {
                          onStartRoll(idx);
                        } else {
                          onStopRoll(idx);
                        }
                      }}
                      disabled={
                        settings.rollExecutionMode === 'individual' &&
                        idx !== activePlayerIndex
                      }
                      className={`w-full py-3 px-4 rounded-2xl font-black text-sm text-white border-3 border-black flex items-center justify-center gap-1.5 transition-all ${
                        settings.rollExecutionMode === 'individual' &&
                        idx !== activePlayerIndex
                          ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                          : player.isRolling
                          ? 'bg-[#FFDE59] text-black animate-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-[#FF6B6B] hover:bg-[#ff5252] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <MousePointerClick className="w-4 h-4" />
                      {player.isRolling ? '點擊停骰開獎！' : '點擊開始搖骰'}
                    </button>
                  )
                ) : (
                  <div className="w-full py-2.5 bg-[#FFF8D6] border-2 border-black rounded-xl text-center text-xs font-black text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 text-[#2D2D2D] stroke-[3]" />
                    已完成投骰 ({player.totalScore} 點)
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
