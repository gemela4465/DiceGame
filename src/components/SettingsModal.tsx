import React from 'react';
import { 
  GameSettings, 
  CompareMode, 
  TieMode, 
  LayoutMode, 
  MatchFormat, 
  RollTriggerMode, 
  RollExecutionMode 
} from '../types';
import { 
  Settings, 
  Dice1, 
  Trophy, 
  Timer, 
  Users, 
  Sparkles, 
  X, 
  LayoutGrid, 
  CircleDot, 
  MousePointerClick, 
  HandMetal, 
  Layers, 
  UserCheck,
  Flame,
  Scale
} from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  isOpen: boolean;
  onClose: () => void;
  onResetMatch?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  isOpen,
  onClose,
  onResetMatch,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#FFDE59] p-5 text-[#2D2D2D] border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Settings className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#2D2D2D]">遊戲與比賽規則設定</h2>
              <p className="text-xs text-[#2D2D2D]/80 font-bold">客製化人數、骰子數、賽制、投骰方式與計時器</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-[#FFF8D6] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* 1. 骰子數量 (1~6顆) */}
          <div className="bg-[#FFFCE8] p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-black text-[#2D2D2D]">
                <Dice1 className="w-5 h-5 text-black" />
                <span>骰子數量</span>
              </div>
              <span className="text-sm font-black bg-[#4ECDC4] text-black px-3 py-0.5 rounded-full border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {settings.diceCount} 顆骰子
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onUpdateSettings({ diceCount: num })}
                  className={`py-2.5 rounded-xl font-black text-sm border-2 border-black transition-all ${
                    settings.diceCount === num
                      ? 'bg-[#FFDE59] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-[#2D2D2D] hover:bg-[#FFF8D6]'
                  }`}
                >
                  {num} 顆
                </button>
              ))}
            </div>
          </div>

          {/* 2. 比大或比小 */}
          <div className="bg-[#FFFCE8] p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 font-black text-[#2D2D2D] mb-3">
              <Scale className="w-5 h-5 text-black" />
              <span>勝負判定規則 (比大 / 比小)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateSettings({ compareMode: 'highest' })}
                className={`p-3.5 rounded-xl font-black text-sm flex flex-col items-center gap-1 border-3 border-black transition-all ${
                  settings.compareMode === 'highest'
                    ? 'bg-[#FFDE59] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
                    : 'bg-white text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                }`}
              >
                <span className="text-base font-black">👑 比大 (點數最多勝出)</span>
                <span className="text-xs font-bold text-[#2D2D2D]/70">總點數最高者優先獲得玩具</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ compareMode: 'lowest' })}
                className={`p-3.5 rounded-xl font-black text-sm flex flex-col items-center gap-1 border-3 border-black transition-all ${
                  settings.compareMode === 'lowest'
                    ? 'bg-[#FFDE59] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
                    : 'bg-white text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                }`}
              >
                <span className="text-base font-black">🐭 比小 (點數最少勝出)</span>
                <span className="text-xs font-bold text-[#2D2D2D]/70">總點數最低者優先獲得玩具</span>
              </button>
            </div>
          </div>

          {/* 3. 同分規則 (允許同分 / 排名賽 PK) */}
          <div className="bg-[#FFFCE8] p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 font-black text-[#2D2D2D] mb-3">
              <Trophy className="w-5 h-5 text-black" />
              <span>同分處理模式</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateSettings({ tieMode: 'allow_tie' })}
                className={`p-3.5 rounded-xl font-black text-sm flex flex-col items-center gap-1 border-3 border-black transition-all ${
                  settings.tieMode === 'allow_tie'
                    ? 'bg-[#4ECDC4] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
                    : 'bg-white text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                }`}
              >
                <span className="text-base font-black">🤝 允許同分 (並列排名)</span>
                <span className="text-xs font-bold text-[#2D2D2D]/70">相同點數共享同一名次</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ tieMode: 'tie_breaker' })}
                className={`p-3.5 rounded-xl font-black text-sm flex flex-col items-center gap-1 border-3 border-black transition-all ${
                  settings.tieMode === 'tie_breaker'
                    ? 'bg-[#FF6B6B] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
                    : 'bg-white text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                }`}
              >
                <span className="text-base font-black">⚔️ 嚴格排名賽 (同分PK決戰)</span>
                <span className="text-xs font-bold text-[#2D2D2D]/70">同分時進入PK加賽分出先後</span>
              </button>
            </div>
          </div>

          {/* 4. 排列佈局 (水平比賽 / 橢圓排列比賽) */}
          <div className="bg-[#FFFCE8] p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 font-black text-[#2D2D2D] mb-3">
              <LayoutGrid className="w-5 h-5 text-black" />
              <span>介面排列佈局</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateSettings({ layoutMode: 'horizontal' })}
                className={`p-3.5 rounded-xl font-black text-sm flex flex-col items-center gap-1 border-3 border-black transition-all ${
                  settings.layoutMode === 'horizontal'
                    ? 'bg-[#FFDE59] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
                    : 'bg-white text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                }`}
              >
                <span className="text-base font-black flex items-center gap-1.5">
                  <LayoutGrid className="w-4 h-4" /> 水平排列 (一般卡片)
                </span>
                <span className="text-xs font-bold text-[#2D2D2D]/70">手機與電腦螢幕舒適瀏覽</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ layoutMode: 'oval' })}
                className={`p-3.5 rounded-xl font-black text-sm flex flex-col items-center gap-1 border-3 border-black transition-all ${
                  settings.layoutMode === 'oval'
                    ? 'bg-[#FFDE59] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
                    : 'bg-white text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                }`}
              >
                <span className="text-base font-black flex items-center gap-1.5">
                  <CircleDot className="w-4 h-4" /> 橢圓環形排列 (平板適用)
                </span>
                <span className="text-xs font-bold text-[#2D2D2D]/70">平板放桌中小朋友圍坐同樂</span>
              </button>
            </div>
          </div>

          {/* 5. 賽制 (單場 / 三戰兩勝 / 五戰三勝) */}
          <div className="bg-[#FFFCE8] p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 font-black text-[#2D2D2D] mb-3">
              <Flame className="w-5 h-5 text-[#FF6B6B]" />
              <span>比賽賽制</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'bo1', title: '單場一局定勝負', sub: '一局快速決定' },
                { id: 'bo3', title: '三戰兩勝 (BO3)', sub: '先贏 2 局者勝' },
                { id: 'bo5', title: '五戰三勝 (BO5)', sub: '先贏 3 局者勝' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => onUpdateSettings({ matchFormat: fmt.id as MatchFormat })}
                  className={`p-3 rounded-xl font-black text-center border-3 border-black transition-all ${
                    settings.matchFormat === fmt.id
                      ? 'bg-[#FF6B6B] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                  }`}
                >
                  <div className="text-xs sm:text-sm">{fmt.title}</div>
                  <div className="text-[10px] font-bold opacity-80 mt-0.5">{fmt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 6. 投骰手感模式 (點擊切換 vs 按住放開) */}
          <div className="bg-[#FFFCE8] p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 font-black text-[#2D2D2D] mb-3">
              <MousePointerClick className="w-5 h-5 text-black" />
              <span>投骰操作手感方式</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateSettings({ rollTriggerMode: 'click_toggle' })}
                className={`p-3.5 rounded-xl font-black text-sm flex flex-col items-center gap-1 border-3 border-black transition-all ${
                  settings.rollTriggerMode === 'click_toggle'
                    ? 'bg-[#FFDE59] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
                    : 'bg-white text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                }`}
              >
                <span className="text-sm sm:text-base font-black flex items-center gap-1.5">
                  <MousePointerClick className="w-4 h-4" /> 點壓投骰 (點開/點停)
                </span>
                <span className="text-xs font-bold text-[#2D2D2D]/70">點一下開始搖，再按一下停骰</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ rollTriggerMode: 'press_hold' })}
                className={`p-3.5 rounded-xl font-black text-sm flex flex-col items-center gap-1 border-3 border-black transition-all ${
                  settings.rollTriggerMode === 'press_hold'
                    ? 'bg-[#FFDE59] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
                    : 'bg-white text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                }`}
              >
                <span className="text-sm sm:text-base font-black flex items-center gap-1.5">
                  <HandMetal className="w-4 h-4" /> 按住投骰 (長按/放開)
                </span>
                <span className="text-xs font-bold text-[#2D2D2D]/70">按住持續搖動，放開手指即停</span>
              </button>
            </div>
          </div>

          {/* 7. 投骰順序 (個人骰 vs 統一骰) */}
          <div className="bg-[#FFFCE8] p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-2 font-black text-[#2D2D2D] mb-3">
              <UserCheck className="w-5 h-5 text-black" />
              <span>擲骰模式 (只能有一種模式)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onUpdateSettings({ rollExecutionMode: 'individual' })}
                className={`p-3.5 rounded-xl font-black text-sm flex flex-col items-center gap-1 border-3 border-black transition-all ${
                  settings.rollExecutionMode === 'individual'
                    ? 'bg-[#4ECDC4] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
                    : 'bg-white text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                }`}
              >
                <span className="text-base font-black">👤 個人骰模式</span>
                <span className="text-xs font-bold text-[#2D2D2D]/70">每位小朋友依序親自擲骰子</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ rollExecutionMode: 'simultaneous' })}
                className={`p-3.5 rounded-xl font-black text-sm flex flex-col items-center gap-1 border-3 border-black transition-all ${
                  settings.rollExecutionMode === 'simultaneous'
                    ? 'bg-[#4ECDC4] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black'
                    : 'bg-white text-[#2D2D2D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFF8D6]'
                }`}
              >
                <span className="text-base font-black">⚡ 統一骰模式</span>
                <span className="text-xs font-bold text-[#2D2D2D]/70">大家同時骰動或一鍵全部開骰</span>
              </button>
            </div>
          </div>

          {/* 8. 玩具遊玩計時器 (預設 30秒，可自由修改) */}
          <div className="bg-[#FFFCE8] p-4 rounded-2xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-black text-[#2D2D2D]">
                <Timer className="w-5 h-5 text-black" />
                <span>玩具每人遊玩倒數計時器 (秒)</span>
              </div>
              <span className="text-sm font-black bg-[#FFDE59] text-black px-3 py-0.5 rounded-full border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {settings.timerDuration} 秒 ({Math.floor(settings.timerDuration / 60)}分 {settings.timerDuration % 60}秒)
              </span>
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[15, 30, 45, 60, 120, 180, 300].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onUpdateSettings({ timerDuration: sec })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-black transition-all ${
                    settings.timerDuration === sec
                      ? 'bg-[#FFDE59] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-[#2D2D2D] hover:bg-[#FFF8D6]'
                  }`}
                >
                  {sec < 60 ? `${sec} 秒` : `${sec / 60} 分鐘`}
                </button>
              ))}
            </div>

            {/* Custom slider & manual input */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <input
                type="range"
                min="5"
                max="600"
                step="5"
                value={settings.timerDuration}
                onChange={(e) => onUpdateSettings({ timerDuration: Number(e.target.value) })}
                className="flex-1 accent-[#FF6B6B] h-3 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max="3600"
                  value={settings.timerDuration}
                  onChange={(e) => {
                    const val = Math.max(1, Number(e.target.value) || 1);
                    onUpdateSettings({ timerDuration: val });
                  }}
                  className="w-20 px-2 py-1 bg-[#FFFCE8] border-2 border-black rounded-lg font-black text-center text-[#2D2D2D] text-sm focus:outline-none focus:bg-white"
                />
                <span className="text-xs text-[#2D2D2D] font-black">秒</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFFDFA] border-t-4 border-black flex items-center justify-between gap-3">
          {onResetMatch ? (
            <button
              type="button"
              onClick={() => {
                onResetMatch();
                onClose();
              }}
              className="px-4 py-2.5 text-xs font-black text-[#FF6B6B] hover:bg-rose-50 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            >
              重置比賽勝場紀錄
            </button>
          ) : <div />}
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            完成設定
          </button>
        </div>
      </div>
    </div>
  );
};
