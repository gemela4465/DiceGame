import React from 'react';
import { Player, GameSettings } from '../types';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Flame, 
  Medal, 
  ArrowRight,
  Timer
} from 'lucide-react';

interface RankingBoardProps {
  players: Player[];
  settings: GameSettings;
  onProceedToTimer: () => void;
  onRematch: () => void;
  onNextRound: () => void;
  tournamentWinner: Player | null;
  onBackToDice?: () => void;
}

export const RankingBoard: React.FC<RankingBoardProps> = ({
  players,
  settings,
  onProceedToTimer,
  onRematch,
  onNextRound,
  tournamentWinner,
  onBackToDice,
}) => {
  // Sort players by rank
  const sortedPlayers = [...players].sort((a, b) => a.rank - b.rank);

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black space-y-6">
      {/* Header Banner */}
      <div className="text-center space-y-2 relative">
        {onBackToDice && (
          <button
            type="button"
            onClick={onBackToDice}
            className="absolute left-0 top-0 px-3 py-1.5 bg-white hover:bg-[#FFF8D6] text-[#2D2D2D] font-black text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
          >
            ← 返回看骰子
          </button>
        )}
        <div className="inline-flex items-center gap-2 bg-[#FFDE59] text-black px-4 py-1.5 rounded-full text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Trophy className="w-4 h-4 text-black" />
          <span>本局投骰排名榜</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#2D2D2D]">
          {tournamentWinner ? `🏆 恭喜 ${tournamentWinner.name} 奪得總冠軍！` : '🎉 玩家順序排定完成！'}
        </h2>
        <p className="text-xs sm:text-sm text-[#2D2D2D]/70 font-bold max-w-md mx-auto">
          {settings.compareMode === 'highest' ? '總點數最高者優先' : '總點數最低者優先'}，
          {settings.tieMode === 'allow_tie' ? '同分共享相同名次' : '已透過PK分出嚴格順序'}
        </p>
      </div>

      {/* Podium for top 3 if > 1 player */}
      {sortedPlayers.length >= 2 && (
        <div className="flex items-end justify-center gap-2 sm:gap-4 pt-4 pb-2">
          {/* 2nd Place */}
          {sortedPlayers[1] && (
            <div className="flex flex-col items-center flex-1 max-w-[110px] sm:max-w-[140px]">
              <span className="text-3xl sm:text-4xl mb-1">{sortedPlayers[1].avatar}</span>
              <span className="text-xs sm:text-sm font-black text-[#2D2D2D] truncate w-full text-center">
                {sortedPlayers[1].name}
              </span>
              <span className="text-[10px] font-black text-[#2D2D2D]/60 mb-1">
                {sortedPlayers[1].totalScore} 點
              </span>
              <div className="w-full h-20 sm:h-24 bg-[#4ECDC4] rounded-t-2xl flex items-center justify-center font-black text-black text-lg sm:text-xl shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] border-3 border-black border-b-0">
                🥈 2
              </div>
            </div>
          )}

          {/* 1st Place */}
          {sortedPlayers[0] && (
            <div className="flex flex-col items-center flex-1 max-w-[120px] sm:max-w-[160px] relative">
              <Crown className="w-7 h-7 text-[#FF6B6B] animate-bounce absolute -top-8 stroke-[2.5]" />
              <span className="text-4xl sm:text-5xl mb-1">{sortedPlayers[0].avatar}</span>
              <span className="text-sm sm:text-base font-black text-[#2D2D2D] truncate w-full text-center">
                {sortedPlayers[0].name}
              </span>
              <span className="text-xs font-black text-[#FF6B6B] mb-1">
                {sortedPlayers[0].totalScore} 點
              </span>
              <div className="w-full h-28 sm:h-32 bg-[#FFDE59] rounded-t-2xl flex items-center justify-center font-black text-black text-2xl sm:text-3xl shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] border-4 border-black border-b-0">
                🥇 1
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {sortedPlayers[2] && (
            <div className="flex flex-col items-center flex-1 max-w-[110px] sm:max-w-[140px]">
              <span className="text-3xl sm:text-4xl mb-1">{sortedPlayers[2].avatar}</span>
              <span className="text-xs sm:text-sm font-black text-[#2D2D2D] truncate w-full text-center">
                {sortedPlayers[2].name}
              </span>
              <span className="text-[10px] font-black text-[#2D2D2D]/60 mb-1">
                {sortedPlayers[2].totalScore} 點
              </span>
              <div className="w-full h-16 sm:h-20 bg-[#FF6B6B] rounded-t-2xl flex items-center justify-center font-black text-white text-lg sm:text-xl shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] border-3 border-black border-b-0">
                🥉 3
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complete List Table */}
      <div className="space-y-3 max-w-xl mx-auto">
        {sortedPlayers.map((player) => (
          <div
            key={player.id}
            className={`p-3.5 sm:p-4 rounded-2xl border-3 border-black flex items-center justify-between transition-all ${
              player.rank === 1
                ? 'bg-[#FFF8D6] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl border-2 border-black flex items-center justify-center font-black text-sm shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                  player.rank === 1
                    ? 'bg-[#FFDE59] text-black'
                    : player.rank === 2
                    ? 'bg-[#4ECDC4] text-black'
                    : player.rank === 3
                    ? 'bg-[#FF6B6B] text-white'
                    : 'bg-white text-black'
                }`}
              >
                {player.rank}
              </div>
              <span className="text-3xl p-1 bg-[#FFF8D6] rounded-xl border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {player.avatar}
              </span>
              <div>
                <div className="font-black text-[#2D2D2D] text-sm sm:text-base">
                  {player.name}
                </div>
                <div className="text-xs text-[#2D2D2D]/70 font-bold flex items-center gap-2">
                  <span>骰子：[{player.dice.join(', ')}]</span>
                  <span>•</span>
                  <span className="font-black text-[#FF6B6B]">
                    總點數：{player.totalScore} 點
                  </span>
                </div>
              </div>
            </div>

            {settings.matchFormat !== 'bo1' && (
              <div className="text-right">
                <span className="text-[10px] text-[#2D2D2D]/60 block font-bold">總勝場</span>
                <span className="text-xs font-black text-[#FF6B6B]">
                  {player.roundWins} 勝
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-black/10 max-w-xl mx-auto">
        <button
          type="button"
          onClick={onProceedToTimer}
          className="flex-1 py-4 px-6 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black text-base sm:text-lg rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
        >
          <Timer className="w-6 h-6" />
          依此排名開始計時輪流玩！
          <ArrowRight className="w-5 h-5" />
        </button>

        {settings.matchFormat !== 'bo1' && !tournamentWinner && (
          <button
            type="button"
            onClick={onNextRound}
            className="py-4 px-5 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-black text-sm sm:text-base rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5"
          >
            <Flame className="w-5 h-5" />
            進入下一小局
          </button>
        )}

        <button
          type="button"
          onClick={onRematch}
          className="py-4 px-5 bg-white hover:bg-[#FFF8D6] text-[#2D2D2D] font-black text-sm sm:text-base rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          重新比賽
        </button>
      </div>
    </div>
  );
};
