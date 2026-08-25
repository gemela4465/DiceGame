import React, { useState } from 'react';
import { AVATAR_OPTIONS, DEFAULT_PLAYER_COLORS } from '../data/presets';
import { Check, Edit2, Sparkles, X } from 'lucide-react';
import { Player } from '../types';

interface AvatarPickerProps {
  player: Player;
  onUpdate: (updated: Partial<Player>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerProps> = ({
  player,
  onUpdate,
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState(player.name);
  const [selectedAvatar, setSelectedAvatar] = useState(player.avatar);
  const [selectedColor, setSelectedColor] = useState(player.color);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate({
      name: name.trim() || player.name,
      avatar: selectedAvatar,
      color: selectedColor,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div 
          className="p-5 text-black border-b-4 border-black flex items-center justify-between"
          style={{ backgroundColor: selectedColor }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl bg-white p-2 rounded-2xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {selectedAvatar}
            </span>
            <div>
              <h3 className="font-black text-lg text-black drop-shadow-xs">設定玩家角色</h3>
              <p className="text-xs text-black/80 font-bold">挑選喜歡的頭標與專屬顏色</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-[#FFF8D6] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Player Name Input */}
          <div>
            <label className="block text-xs font-black text-[#2D2D2D] uppercase tracking-wider mb-2">
              玩家暱稱 / 名字
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={name}
                maxLength={10}
                onChange={(e) => setName(e.target.value)}
                placeholder="輸入玩家名字 (例如：小寶、阿妹)"
                className="w-full px-4 py-3 bg-[#FFFCE8] border-3 border-black rounded-2xl text-[#2D2D2D] font-black focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all text-base"
              />
              <span className="absolute right-3 text-xs text-[#2D2D2D]/60 font-black">
                {name.length}/10
              </span>
            </div>
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-black text-[#2D2D2D] uppercase tracking-wider mb-2">
              選擇動物/英雄頭標
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = selectedAvatar === opt.emoji;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(opt.emoji);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-3 border-black transition-all transform active:scale-95 ${
                      isSelected
                        ? 'bg-[#FFDE59] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-105 ring-2 ring-black'
                        : 'bg-white hover:bg-[#FFFCE8] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    }`}
                  >
                    <span className="text-3xl mb-1">{opt.emoji}</span>
                    <span className="text-[11px] font-black text-[#2D2D2D] truncate w-full text-center">
                      {opt.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-xs font-black text-[#2D2D2D] uppercase tracking-wider mb-2">
              選擇玩家代表色
            </label>
            <div className="flex flex-wrap gap-2.5">
              {DEFAULT_PLAYER_COLORS.map((col) => {
                const isSelected = selectedColor === col;
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center transition-all ${
                      isSelected ? 'scale-110 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ring-3 ring-black' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: col }}
                  >
                    {isSelected && <Check className="w-5 h-5 text-black stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFFDFA] border-t-4 border-black flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border-3 border-black bg-white text-[#2D2D2D] font-black hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl text-black font-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:brightness-105 active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
            style={{ backgroundColor: selectedColor }}
          >
            <Sparkles className="w-4 h-4 text-black" />
            確認設定
          </button>
        </div>
      </div>
    </div>
  );
};
