import React from 'react';
import { Player, GameSettings } from '../types';
import { Dice3D } from './Dice3D';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  MousePointerClick, 
  HandMetal, 
  Edit3, 
  Check, 
  Play, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface OvalLayoutProps {
  players: Player[];
  settings: GameSettings;
  activePlayerIndex: number;
  onStartRoll: (playerIndex: number) => void;
  onStopRoll: (playerIndex: number) => void;
  onSimultaneousRollAll: () => void;
  isSimultaneousRolling: boolean;
  onEditPlayer: (player: Player) => void;
  isAllRolled: boolean;
  onProceedToTimer: () => void;
  onRematch: () => void;
}

export const OvalLayout: React.FC<OvalLayoutProps> = ({
  players,
  settings,
  activePlayerIndex,
  onStartRoll,
  onStopRoll,
  onSimultaneousRollAll,
  isSimultaneousRolling,
  onEditPlayer,
  isAllRolled,
  onProceedToTimer,
  onRematch,
}) => {
  const count = players.length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Tablet / Oval Arena Container */}
      <div className="relative w-full max-w-5xl min-h-[620px] sm:min-h-[720px] rounded-[40px] bg-[#2D2D2D] p-4 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden flex items-center justify-center">
        
        {/* Tabletop felt circle pattern */}
        <div className="absolute inset-4 sm:inset-10 rounded-[32px] sm:rounded-[50px] border-4 border-[#FFDE59]/30 bg-[#3A3A3A] pointer-events-none" />

        {/* Center Arena / Hub */}
        <div className="z-10 w-full max-w-xs sm:max-w-sm bg-[#FFDE59] rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-center flex flex-col items-center text-[#2D2D2D]">
          <div className="inline-flex items-center gap-1.5 bg-[#4ECDC4] text-black text-[11px] font-black uppercase px-3 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            {settings.compareMode === 'highest' ? '👑 比大模式 (最多點勝)' : '🐭 比小模式 (最少點勝)'}
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#2D2D2D]">
            {isAllRolled ? '🎉 比賽結果已出爐！' : '🎲 圍桌投骰競技場'}
          </h3>

          <p className="text-xs text-[#2D2D2D]/80 font-bold mt-1 mb-4">
            {isAllRolled
              ? '名次已排出，請點擊下方開始倒數計時輪流玩！'
              : settings.rollExecutionMode === 'individual'
              ? `目前輪到 [${players[activePlayerIndex]?.name || '玩家'}] 投骰`
              : '統一投骰模式：點擊下方一鍵全體開骰'}
          </p>

          {/* Central Actions */}
          <div className="w-full space-y-2.5">
            {!isAllRolled ? (
              settings.rollExecutionMode === 'simultaneous' ? (
                <button
                  type="button"
                  onClick={onSimultaneousRollAll}
                  className="w-full py-3.5 px-4 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-black text-base rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  {isSimultaneousRolling ? '全員骰動中...' : '⚡ 全員一鍵投骰！'}
                </button>
              ) : (
                <div className="text-xs font-black text-black bg-white p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  請點擊各自座位前的投骰按鈕！
                </div>
              )
            ) : (
              <div className="space-y-2.5 w-full">
                <button
                  type="button"
                  onClick={onProceedToTimer}
                  className="w-full py-3.5 px-4 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black text-base rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  進入倒數計時輪流玩 🧸
                </button>
                <button
                  type="button"
                  onClick={onRematch}
                  className="w-full py-2.5 px-4 bg-white hover:bg-[#FFF8D6] text-[#2D2D2D] font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  重新再來一局
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Distributed Players around Oval */}
        {players.map((player, idx) => {
          // Calculate angle for player position around ellipse
          // Start from top-left or top
          const angle = (idx / count) * 2 * Math.PI - Math.PI / 2;
          
          // Responsive radius multiplier
          const rx = 42; // horizontal radius %
          const ry = 40; // vertical radius %

          const x = 50 + rx * Math.cos(angle);
          const y = 50 + ry * Math.sin(angle);

          const isCurrentActive =
            settings.rollExecutionMode === 'individual'
              ? idx === activePlayerIndex && !player.hasRolled
              : !player.hasRolled;

          return (
            <div
              key={player.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              <div
                className={`bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center w-36 sm:w-44 transition-all ${
                  isAllRolled && player.rank === 1
                    ? 'ring-4 ring-[#FFDE59] scale-105 bg-[#FFFDFA]'
                    : isCurrentActive
                    ? 'ring-4 ring-[#4ECDC4] scale-105 bg-[#F7FFFE]'
                    : ''
                }`}
              >
                {/* Header & Avatar */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <button
                    type="button"
                    onClick={() => onEditPlayer(player)}
                    className="text-2xl p-1 bg-[#FFF8D6] hover:bg-[#FFDE59] border-2 border-black rounded-xl shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-transform active:scale-90"
                  >
                    {player.avatar}
                  </button>
                  <div className="text-left">
                    <span className="text-xs sm:text-sm font-black text-[#2D2D2D] truncate block max-w-[80px]">
                      {player.name}
                    </span>
                    {player.hasRolled && (
                      <span className="text-[11px] font-black text-[#FF6B6B] block">
                        {player.totalScore} 點
                      </span>
                    )}
                  </div>
                </div>

                {/* Dice Mini Tray */}
                <div className="bg-[#FFFCE8] p-2 rounded-xl mb-2 flex flex-wrap items-center justify-center gap-1.5 min-h-[50px] w-full border-2 border-black shadow-inner">
                  {player.dice.map((dVal, dIdx) => (
                    <Dice3D
                      key={dIdx}
                      value={dVal}
                      isRolling={player.isRolling}
                      size="sm"
                      color={player.color}
                      delay={dIdx}
                    />
                  ))}
                </div>

                {/* Player Status / Rank / Button */}
                {isAllRolled ? (
                  <div
                    className={`w-full py-1 rounded-xl text-xs font-black border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1 ${
                      player.rank === 1
                        ? 'bg-[#FFDE59] text-black'
                        : player.rank === 2
                        ? 'bg-[#4ECDC4] text-black'
                        : 'bg-white text-[#2D2D2D]'
                    }`}
                  >
                    {player.rank === 1 && <Crown className="w-3 h-3" />}
                    第 {player.rank} 名
                  </div>
                ) : !player.hasRolled ? (
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
                      className={`w-full py-2 px-2 rounded-xl font-black text-xs text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none transition-all ${
                        settings.rollExecutionMode === 'individual' &&
                        idx !== activePlayerIndex
                          ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                          : player.isRolling
                          ? 'bg-[#FFDE59] text-black translate-x-[1px] translate-y-[1px]'
                          : 'bg-[#FF6B6B] hover:bg-[#ff5252] active:translate-x-[1px] active:translate-y-[1px]'
                      }`}
                    >
                      {player.isRolling ? '放手開骰' : '按住搖骰'}
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
                      className={`w-full py-2 px-2 rounded-xl font-black text-xs text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:scale-95 ${
                        settings.rollExecutionMode === 'individual' &&
                        idx !== activePlayerIndex
                          ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                          : player.isRolling
                          ? 'bg-[#FFDE59] text-black animate-pulse'
                          : 'bg-[#FF6B6B] hover:bg-[#ff5252]'
                      }`}
                    >
                      {player.isRolling ? '點擊停骰' : '點擊搖骰'}
                    </button>
                  )
                ) : (
                  <div className="text-[11px] font-black text-[#2D2D2D] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#2D2D2D] stroke-[3]" />
                    已投出 {player.totalScore} 點
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
