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
  Zap,
  ListOrdered,
  Timer,
  Users,
  Lock,
  Clock
} from 'lucide-react';

interface OvalLayoutProps {
  players: Player[];
  settings: GameSettings;
  activePlayerIndex: number;
  onStartRoll: (playerIndex: number) => void;
  onStopRoll: (playerIndex: number) => void;
  onStartSimultaneousRoll?: () => void;
  onStopSimultaneousRoll?: () => void;
  onSimultaneousRollAll?: () => void;
  isSimultaneousRolling: boolean;
  onEditPlayer: (player: Player) => void;
  isAllRolled: boolean;
  onProceedToTimer: () => void;
  onProceedToRanking?: () => void;
  onRematch: () => void;
}

export const OvalLayout: React.FC<OvalLayoutProps> = ({
  players,
  settings,
  activePlayerIndex,
  onStartRoll,
  onStopRoll,
  onStartSimultaneousRoll,
  onStopSimultaneousRoll,
  onSimultaneousRollAll,
  isSimultaneousRolling,
  onEditPlayer,
  isAllRolled,
  onProceedToTimer,
  onProceedToRanking,
  onRematch,
}) => {
  const count = players.length;
  const isSequentialMode = settings.rollExecutionMode === 'sequential';
  const isSimultaneousOnly = settings.rollExecutionMode === 'simultaneous';
  const isConcurrentMode = settings.rollExecutionMode === 'concurrent' || (!isSequentialMode && !isSimultaneousOnly);
  const isPressHold = settings.rollTriggerMode === 'press_hold';

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
            {isAllRolled ? '🎉 投骰結果出爐！' : '🎲 圍桌投骰競技場'}
          </h3>

          <div className="flex items-center gap-1.5 my-1">
            <span className="text-[11px] px-2.5 py-0.5 bg-white border-2 border-black rounded-lg font-black text-[#2D2D2D]">
              {isPressHold ? '🖐️ 按住投骰模式' : '👆 點壓投骰模式'}
            </span>
          </div>

          <p className="text-xs text-[#2D2D2D]/80 font-bold mt-1 mb-4">
            {isAllRolled
              ? '大家點數已全部投定，請點擊按鈕查看排名或直接開始計時！'
              : isConcurrentMode
              ? isPressHold
                ? '👥 多人自由同時投：每位小朋友可按住自己按鈕搖骰（支援多點觸控），或由中央全員一鍵搖骰！'
                : '👥 多人自由同時投：每位小朋友可點擊自己按鈕開始/停骰，或由中央全員一鍵開骰！'
              : isSimultaneousOnly
              ? isPressHold
                ? '⚡ 全員一鍵統一骰：個人按鈕已鎖定防誤觸，請按住中央按鈕搖骰、放開開骰！'
                : '⚡ 全員一鍵統一骰：個人按鈕已鎖定防誤觸，請點擊中央按鈕開始/停骰！'
              : `目前輪到 [${players[activePlayerIndex]?.name || '玩家'}] 投骰`}
          </p>

          {/* Central Actions */}
          <div className="w-full space-y-2.5">
            {!isAllRolled ? (
              isPressHold ? (
                <button
                  type="button"
                  onMouseDown={() => onStartSimultaneousRoll?.()}
                  onMouseUp={() => onStopSimultaneousRoll?.()}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    onStartSimultaneousRoll?.();
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    onStopSimultaneousRoll?.();
                  }}
                  style={{ touchAction: 'manipulation' }}
                  className={`w-full py-3.5 px-4 font-black text-base rounded-2xl border-3 border-black select-none transition-all flex items-center justify-center gap-2 ${
                    isSimultaneousRolling
                      ? 'bg-[#FFDE59] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                      : 'bg-[#FF6B6B] hover:bg-[#ff5252] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  <HandMetal className="w-5 h-5" />
                  {isSimultaneousRolling ? '放開手指全員開骰！' : '⚡ 按住全員持續搖骰'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!isSimultaneousRolling) {
                      onStartSimultaneousRoll?.();
                    } else {
                      onStopSimultaneousRoll?.();
                    }
                  }}
                  style={{ touchAction: 'manipulation' }}
                  className={`w-full py-3.5 px-4 font-black text-base rounded-2xl border-3 border-black select-none transition-all flex items-center justify-center gap-2 ${
                    isSimultaneousRolling
                      ? 'bg-[#FFDE59] text-black animate-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-[#FF6B6B] hover:bg-[#ff5252] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  <MousePointerClick className="w-5 h-5" />
                  {isSimultaneousRolling ? '點擊停骰全員開獎！' : '⚡ 點擊全員開始搖骰'}
                </button>
              )
            ) : (
              <div className="space-y-2.5 w-full">
                {onProceedToRanking && (
                  <button
                    type="button"
                    onClick={onProceedToRanking}
                    className="w-full py-3 px-4 bg-white hover:bg-[#FFF8D6] text-[#2D2D2D] font-black text-sm rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                  >
                    <ListOrdered className="w-4 h-4" />
                    查看順序排定榜
                  </button>
                )}
                <button
                  type="button"
                  onClick={onProceedToTimer}
                  className="w-full py-3.5 px-4 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black text-base rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                >
                  <Timer className="w-5 h-5" />
                  進入倒數計時輪流玩 🧸
                </button>
                <button
                  type="button"
                  onClick={onRematch}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-[#2D2D2D] font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5"
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
          const angle = (idx / count) * 2 * Math.PI - Math.PI / 2;
          const rx = 42;
          const ry = 40;
          const x = 50 + rx * Math.cos(angle);
          const y = 50 + ry * Math.sin(angle);

          const isPlayerDisabled = isSequentialMode
            ? idx !== activePlayerIndex || player.hasRolled
            : player.hasRolled;

          const isCurrentActive = isSequentialMode
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
                    : isCurrentActive && !player.hasRolled && !isSimultaneousOnly
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
                ) : player.hasRolled ? (
                  <div className="text-[11px] font-black text-[#2D2D2D] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-[#2D2D2D] stroke-[3]" />
                    已投出 {player.totalScore} 點
                  </div>
                ) : isSimultaneousOnly ? (
                  /* 全員一鍵統一骰模式：個人按鈕鎖定防誤觸 */
                  <div
                    className={`w-full py-1.5 px-2 rounded-xl text-[10px] sm:text-xs font-black border-2 select-none flex items-center justify-center gap-1 transition-all ${
                      player.isRolling
                        ? 'bg-[#FFDE59] text-black border-black animate-pulse'
                        : 'bg-[#F5F4F0] text-[#2D2D2D]/50 border-black/20 border-dashed cursor-not-allowed'
                    }`}
                  >
                    {player.isRolling ? (
                      <>
                        <Zap className="w-3 h-3 fill-current text-black animate-spin" />
                        <span>搖骰中...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-[#2D2D2D]/40" />
                        <span>統一開骰鎖定</span>
                      </>
                    )}
                  </div>
                ) : isSequentialMode && isPlayerDisabled ? (
                  /* 依序輪流模式：非當前玩家鎖定 */
                  <div className="w-full py-1.5 px-2 rounded-xl text-[10px] font-black bg-slate-100 text-slate-400 border-2 border-slate-300 border-dashed flex items-center justify-center gap-1 select-none cursor-not-allowed">
                    <Clock className="w-3 h-3" />
                    <span>等待輪次</span>
                  </div>
                ) : isPressHold ? (
                  /* 按住投骰模式 (多人同時自由投 或 當前玩家) */
                  <button
                    type="button"
                    onMouseDown={() => onStartRoll(idx)}
                    onMouseUp={() => onStopRoll(idx)}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      onStartRoll(idx);
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      onStopRoll(idx);
                    }}
                    style={{ touchAction: 'manipulation' }}
                    className={`w-full py-2 px-2 rounded-xl font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none transition-all ${
                      player.isRolling
                        ? 'bg-[#FFDE59] text-black translate-x-[1px] translate-y-[1px]'
                        : 'bg-[#FF6B6B] hover:bg-[#ff5252] text-white active:translate-x-[1px] active:translate-y-[1px]'
                    }`}
                  >
                    {player.isRolling ? '放手開骰' : '按住搖骰'}
                  </button>
                ) : (
                  /* 點壓投骰模式 */
                  <button
                    type="button"
                    onClick={() => {
                      if (!player.isRolling) {
                        onStartRoll(idx);
                      } else {
                        onStopRoll(idx);
                      }
                    }}
                    style={{ touchAction: 'manipulation' }}
                    className={`w-full py-2 px-2 rounded-xl font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:scale-95 select-none ${
                      player.isRolling
                        ? 'bg-[#FFDE59] text-black animate-pulse'
                        : 'bg-[#FF6B6B] hover:bg-[#ff5252] text-white'
                    }`}
                  >
                    {player.isRolling ? '點擊停骰' : '點擊搖骰'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
