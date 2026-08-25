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
  Zap,
  Play,
  RotateCcw,
  ListOrdered,
  Timer,
  Users,
  Lock,
  Clock
} from 'lucide-react';

interface HorizontalLayoutProps {
  players: Player[];
  settings: GameSettings;
  activePlayerIndex: number;
  onStartRoll: (playerIndex: number) => void;
  onStopRoll: (playerIndex: number) => void;
  onStartSimultaneousRoll?: () => void;
  onStopSimultaneousRoll?: () => void;
  onSimultaneousRollAll?: () => void;
  isSimultaneousRolling?: boolean;
  onEditPlayer: (player: Player) => void;
  isAllRolled: boolean;
  onProceedToTimer: () => void;
  onProceedToRanking?: () => void;
  onRematch?: () => void;
}

export const HorizontalLayout: React.FC<HorizontalLayoutProps> = ({
  players,
  settings,
  activePlayerIndex,
  onStartRoll,
  onStopRoll,
  onStartSimultaneousRoll,
  onStopSimultaneousRoll,
  onSimultaneousRollAll,
  isSimultaneousRolling = false,
  onEditPlayer,
  isAllRolled,
  onProceedToTimer,
  onProceedToRanking,
  onRematch,
}) => {
  const isSequentialMode = settings.rollExecutionMode === 'sequential';
  const isSimultaneousOnly = settings.rollExecutionMode === 'simultaneous';
  const isConcurrentMode = settings.rollExecutionMode === 'concurrent' || (!isSequentialMode && !isSimultaneousOnly);
  const isPressHold = settings.rollTriggerMode === 'press_hold';

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Top Banner: Master Roll Controller */}
      {!isAllRolled && (
        <div className="bg-[#FFDE59] p-4 sm:p-5 rounded-3xl border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FF6B6B] text-white rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {isConcurrentMode ? (
                <Users className="w-6 h-6 stroke-[2.5]" />
              ) : isSimultaneousOnly ? (
                <Zap className="w-6 h-6 fill-current animate-pulse" />
              ) : (
                <Clock className="w-6 h-6 stroke-[2.5]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h3 className="text-base sm:text-lg font-black text-[#2D2D2D]">
                  {isConcurrentMode
                    ? '👥 多人自由同時投'
                    : isSimultaneousOnly
                    ? '⚡ 全員一鍵統一骰'
                    : '🚶 依序輪流投骰'}
                </h3>
                <span className="text-[11px] px-2 py-0.5 bg-white border border-black rounded-lg font-black text-[#2D2D2D]">
                  {isPressHold ? '🖐️ 按住投骰模式' : '👆 點壓投骰模式'}
                </span>
              </div>
              <p className="text-xs text-[#2D2D2D]/80 font-bold mt-0.5">
                {isConcurrentMode
                  ? isPressHold
                    ? '每位小朋友按住自己的按鈕搖骰、放開開骰（支援多點觸控同時按），或按右方一鍵全員搖骰！'
                    : '每位小朋友點擊自己的按鈕開始搖骰、再點一次停骰，或點右方一鍵全員搖骰！'
                  : isSimultaneousOnly
                  ? isPressHold
                    ? '已鎖定個人按鈕避免誤觸！請由下方/右方按鈕【按住搖骰，放開開骰】。'
                    : '已鎖定個人按鈕避免誤觸！請點擊下方/右方按鈕【點擊開始搖骰，再點擊停骰】。'
                  : `目前輪到 [${players[activePlayerIndex]?.name || '第 1 位玩家'}] 擲骰`}
              </p>
            </div>
          </div>

          {/* Master Action Button */}
          {isPressHold ? (
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
              className={`w-full sm:w-auto px-6 py-3.5 font-black text-sm sm:text-base rounded-2xl border-3 border-black select-none transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
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
              className={`w-full sm:w-auto px-6 py-3.5 font-black text-sm sm:text-base rounded-2xl border-3 border-black select-none transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                isSimultaneousRolling
                  ? 'bg-[#FFDE59] text-black animate-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-[#FF6B6B] hover:bg-[#ff5252] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
              }`}
            >
              <MousePointerClick className="w-5 h-5" />
              {isSimultaneousRolling ? '點擊停骰全員開獎！' : '⚡ 點擊全員開始搖骰'}
            </button>
          )}
        </div>
      )}

      {/* Completion Banner with Action Buttons */}
      {isAllRolled && (
        <div className="bg-[#FFDE59] p-4 sm:p-5 rounded-3xl border-3 sm:border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="p-2.5 bg-[#4ECDC4] text-black rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Crown className="w-6 h-6 fill-current text-black animate-bounce" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#2D2D2D]">
                🎉 全員投骰完畢！已停在最終骰子點數結果
              </h3>
              <p className="text-xs text-[#2D2D2D]/80 font-bold">
                大家可以查看各自的點數，確認無誤後點擊下方按鈕進行下一步：
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 w-full md:w-auto">
            {onProceedToRanking && (
              <button
                type="button"
                onClick={onProceedToRanking}
                className="px-4 py-3 bg-white hover:bg-[#FFF8D6] text-[#2D2D2D] font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
              >
                <ListOrdered className="w-4 h-4" />
                查看順序排定表
              </button>
            )}

            <button
              type="button"
              onClick={onProceedToTimer}
              className="px-5 py-3 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
            >
              <Timer className="w-4 h-4" />
              開始輪流玩倒數計時 🧸
            </button>

            {onRematch && (
              <button
                type="button"
                onClick={onRematch}
                className="px-3.5 py-3 bg-white hover:bg-slate-100 text-[#2D2D2D] font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                重賽
              </button>
            )}
          </div>
        </div>
      )}

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
          const isPlayerDisabled = isSequentialMode
            ? idx !== activePlayerIndex || player.hasRolled
            : player.hasRolled;

          const isCurrentActive = isSequentialMode
            ? idx === activePlayerIndex && !player.hasRolled
            : !player.hasRolled;

          const isWinner = isAllRolled && player.rank === 1;

          return (
            <div
              key={player.id}
              className={`relative bg-white rounded-3xl p-5 border-3 sm:border-4 border-black transition-all flex flex-col justify-between overflow-hidden ${
                isWinner
                  ? 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ring-4 ring-[#FFDE59] scale-[1.02] bg-[#FFFDFA]'
                  : isCurrentActive && !player.hasRolled && !isSimultaneousOnly
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

              {/* Action Area */}
              <div className="mt-4 pt-3 border-t-2 border-black/10">
                {player.hasRolled ? (
                  <div className="w-full py-2.5 bg-[#FFF8D6] border-2 border-black rounded-xl text-center text-xs font-black text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 text-[#2D2D2D] stroke-[3]" />
                    已完成投骰 ({player.totalScore} 點)
                  </div>
                ) : isSimultaneousOnly ? (
                  /* 全員一鍵統一骰模式：鎖住個人按鈕，防誤觸 */
                  <div
                    className={`w-full py-3 px-3 rounded-2xl font-black text-xs border-2 select-none flex items-center justify-center gap-1.5 transition-all ${
                      player.isRolling
                        ? 'bg-[#FFDE59] text-black border-black animate-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-[#F5F4F0] text-[#2D2D2D]/60 border-black/20 border-dashed cursor-not-allowed'
                    }`}
                  >
                    {player.isRolling ? (
                      <>
                        <Zap className="w-4 h-4 fill-current text-black animate-bounce" />
                        <span>全員統一搖骰中...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#2D2D2D]/50" />
                        <span>統一投骰中（請由上方主按鈕開骰）</span>
                      </>
                    )}
                  </div>
                ) : isSequentialMode && isPlayerDisabled ? (
                  /* 依序輪流投骰：非當前玩家鎖定 */
                  <div className="w-full py-3 px-3 rounded-2xl font-black text-xs bg-slate-100 text-slate-400 border-2 border-slate-300 border-dashed flex items-center justify-center gap-1.5 select-none cursor-not-allowed">
                    <Clock className="w-4 h-4" />
                    <span>等待輪到自己投骰...</span>
                  </div>
                ) : isPressHold ? (
                  /* 按住投骰模式 (多人自由同時投 或 依序輪流輪到當前玩家) */
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
                    className={`w-full py-3 px-4 rounded-2xl font-black text-sm border-3 border-black select-none flex items-center justify-center gap-1.5 transition-all ${
                      player.isRolling
                        ? 'bg-[#FFDE59] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
                        : 'bg-[#FF6B6B] hover:bg-[#ff5252] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <HandMetal className="w-4 h-4" />
                    {player.isRolling ? '放開手指開骰！' : '按住持續搖骰'}
                  </button>
                ) : (
                  /* 點壓投骰模式 (點一下開始，再點一下停骰) */
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
                    className={`w-full py-3 px-4 rounded-2xl font-black text-sm border-3 border-black select-none flex items-center justify-center gap-1.5 transition-all ${
                      player.isRolling
                        ? 'bg-[#FFDE59] text-black animate-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-[#FF6B6B] hover:bg-[#ff5252] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <MousePointerClick className="w-4 h-4" />
                    {player.isRolling ? '點擊停骰開獎！' : '點擊開始搖骰'}
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
