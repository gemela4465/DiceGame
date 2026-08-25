export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  accentColor: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'lion', name: '小獅子', emoji: '🦁', bgColor: 'bg-amber-100 text-amber-900 border-amber-300', accentColor: '#f59e0b' },
  { id: 'dino', name: '小暴龍', emoji: '🦖', bgColor: 'bg-emerald-100 text-emerald-900 border-emerald-300', accentColor: '#10b981' },
  { id: 'rabbit', name: '波波兔', emoji: '🐰', bgColor: 'bg-pink-100 text-pink-900 border-pink-300', accentColor: '#ec4899' },
  { id: 'bear', name: '熊寶貝', emoji: '🐻', bgColor: 'bg-orange-100 text-orange-900 border-orange-300', accentColor: '#f97316' },
  { id: 'cat', name: '喵星人', emoji: '🐱', bgColor: 'bg-purple-100 text-purple-900 border-purple-300', accentColor: '#a855f7' },
  { id: 'dog', name: '柴柴狗', emoji: '🐶', bgColor: 'bg-yellow-100 text-yellow-900 border-yellow-300', accentColor: '#eab308' },
  { id: 'panda', name: '圓圓熊貓', emoji: '🐼', bgColor: 'bg-slate-200 text-slate-900 border-slate-400', accentColor: '#475569' },
  { id: 'fox', name: '奇奇狐狸', emoji: '🦊', bgColor: 'bg-red-100 text-red-900 border-red-300', accentColor: '#ef4444' },
  { id: 'unicorn', name: '彩虹獨角獸', emoji: '🦄', bgColor: 'bg-indigo-100 text-indigo-900 border-indigo-300', accentColor: '#6366f1' },
  { id: 'monkey', name: '皮皮猴', emoji: '🐵', bgColor: 'bg-amber-100 text-amber-900 border-amber-400', accentColor: '#d97706' },
  { id: 'penguin', name: '企鵝仔', emoji: '🐧', bgColor: 'bg-sky-100 text-sky-900 border-sky-300', accentColor: '#0ea5e9' },
  { id: 'robot', name: '發光機器人', emoji: '🤖', bgColor: 'bg-cyan-100 text-cyan-900 border-cyan-300', accentColor: '#06b6d4' },
  { id: 'dragon', name: '噴火龍', emoji: '🐲', bgColor: 'bg-lime-100 text-lime-900 border-lime-300', accentColor: '#84cc16' },
  { id: 'chick', name: '黃金小雞', emoji: '🐥', bgColor: 'bg-yellow-100 text-yellow-900 border-yellow-300', accentColor: '#facc15' },
];

export const DEFAULT_PLAYER_COLORS = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];
