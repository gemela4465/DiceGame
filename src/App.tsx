import React, { useState, useEffect, useRef } from 'react';
import { 
  Player, 
  GameSettings, 
  GamePhase, 
  CompareMode, 
  LayoutMode, 
  MatchFormat, 
  RollTriggerMode, 
  RollExecutionMode 
} from './types';
import { AVATAR_OPTIONS, DEFAULT_PLAYER_COLORS } from './data/presets';
import { soundEffects } from './utils/sound';
import { HorizontalLayout } from './components/HorizontalLayout';
import { OvalLayout } from './components/OvalLayout';
import { AvatarPickerModal } from './components/AvatarPicker';
import { SettingsModal } from './components/SettingsModal';
import { TieBreakerModal } from './components/TieBreakerModal';
import { ToyPlayTimer } from './components/ToyPlayTimer';
import { RankingBoard } from './components/RankingBoard';
import { 
  Dices, 
  Users, 
  Settings as SettingsIcon, 
  RotateCcw, 
  Sparkles, 
  Trophy, 
  Timer, 
  Plus, 
  Minus, 
  LayoutGrid, 
  CircleDot, 
  Play, 
  HelpCircle, 
  Zap, 
  Flame,
  Volume2,
  VolumeX,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';

const INITIAL_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: '寶貝1',
    avatar: '🦁',
    color: '#3b82f6',
    dice: [1],
    isRolling: false,
    hasRolled: false,
    totalScore: 0,
    rank: 1,
    roundWins: 0,
  },
  {
    id: 'p2',
    name: '寶貝2',
    avatar: '🐰',
    color: '#ec4899',
    dice: [1],
    isRolling: false,
    hasRolled: false,
    totalScore: 0,
    rank: 2,
    roundWins: 0,
  },
];

const DEFAULT_SETTINGS: GameSettings = {
  playerCount: 2,
  diceCount: 1,
  compareMode: 'highest',
  tieMode: 'allow_tie',
  layoutMode: 'horizontal',
  matchFormat: 'bo1',
  rollTriggerMode: 'click_toggle',
  rollExecutionMode: 'concurrent',
  timerDuration: 30,
};

export default function App() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [gamePhase, setGamePhase] = useState<GamePhase>('rolling');
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [tournamentWinner, setTournamentWinner] = useState<Player | null>(null);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [tiedPlayersForPk, setTiedPlayersForPk] = useState<Player[]>([]);
  const [isTieBreakerOpen, setIsTieBreakerOpen] = useState(false);

  // Simultaneous rolling state
  const [isSimultaneousRolling, setIsSimultaneousRolling] = useState(false);
  const simultaneousTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Guard to ensure round completion calculation and confetti fire strictly ONCE per round
  const roundEvaluatedRef = useRef(false);

  // Sound rolling interval
  const rollAudioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize player dice arrays whenever diceCount changes
  useEffect(() => {
    roundEvaluatedRef.current = false;
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        dice: Array(settings.diceCount).fill(1),
        totalScore: p.hasRolled ? p.totalScore : 0,
      }))
    );
  }, [settings.diceCount]);

  // Adjust player count
  const handleUpdatePlayerCount = (newCount: number) => {
    const clampedCount = Math.max(1, Math.min(8, newCount));
    soundEffects.playClick();
    roundEvaluatedRef.current = false;

    setSettings((prev) => ({ ...prev, playerCount: clampedCount }));

    setPlayers((prev) => {
      if (clampedCount > prev.length) {
        // Add new players
        const added: Player[] = [];
        for (let i = prev.length; i < clampedCount; i++) {
          const avatarOpt = AVATAR_OPTIONS[i % AVATAR_OPTIONS.length];
          const color = DEFAULT_PLAYER_COLORS[i % DEFAULT_PLAYER_COLORS.length];
          added.push({
            id: `p${Date.now()}_${i + 1}`,
            name: `寶貝${i + 1}`,
            avatar: avatarOpt.emoji,
            color: color,
            dice: Array(settings.diceCount).fill(1),
            isRolling: false,
            hasRolled: false,
            totalScore: 0,
            rank: i + 1,
            roundWins: 0,
          });
        }
        return [...prev, ...added];
      } else {
        // Truncate players
        return prev.slice(0, clampedCount);
      }
    });

    // Reset active player index if out of bounds
    if (activePlayerIndex >= clampedCount) {
      setActivePlayerIndex(0);
    }
  };

  // Start continuous audio while any dice are rolling
  useEffect(() => {
    const anyRolling = players.some((p) => p.isRolling) || isSimultaneousRolling;
    if (anyRolling) {
      if (!rollAudioIntervalRef.current) {
        rollAudioIntervalRef.current = setInterval(() => {
          soundEffects.playDiceShake();
        }, 120);
      }
    } else {
      if (rollAudioIntervalRef.current) {
        clearInterval(rollAudioIntervalRef.current);
        rollAudioIntervalRef.current = null;
      }
    }
    return () => {
      if (rollAudioIntervalRef.current) {
        clearInterval(rollAudioIntervalRef.current);
      }
    };
  }, [players, isSimultaneousRolling]);

  // Lightweight, smooth confetti celebration trigger (runs smoothly without freezing)
  const triggerCelebrationConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        ticks: 160,
        gravity: 1.1,
        scalar: 0.95,
        colors: ['#FF6B6B', '#4ECDC4', '#FFDE59', '#3B82F6', '#EC4899', '#A78BFA'],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore if unsupported
    }
  };

  // Check when all players finished rolling to compute rankings ONCE
  useEffect(() => {
    if (gamePhase === 'rolling') {
      const allRolled = players.length > 0 && players.every((p) => p.hasRolled && !p.isRolling);
      if (allRolled && !roundEvaluatedRef.current) {
        roundEvaluatedRef.current = true;
        evaluateRoundRanks(players);
      }
    }
  }, [players, gamePhase]);

  // Compute rankings
  const evaluateRoundRanks = (currentPlayers: Player[]) => {
    // 1. Sort based on compareMode
    const sorted = [...currentPlayers].sort((a, b) => {
      if (settings.compareMode === 'highest') {
        return b.totalScore - a.totalScore;
      } else {
        return a.totalScore - b.totalScore;
      }
    });

    if (settings.tieMode === 'allow_tie') {
      // Allow ties: assign standard fractional/competition rank
      const rankedList: Player[] = [];

      for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i].totalScore === sorted[i - 1].totalScore) {
          // Same score as previous player -> same rank
          rankedList.push({
            ...sorted[i],
            rank: rankedList[i - 1].rank,
          });
        } else {
          rankedList.push({
            ...sorted[i],
            rank: i + 1,
          });
        }
      }

      handleRoundCompleted(rankedList);
    } else {
      // Strict tie-breaker mode: check if any players have tied scores
      const scoreGroups: Record<number, Player[]> = {};
      sorted.forEach((p) => {
        scoreGroups[p.totalScore] = scoreGroups[p.totalScore] || [];
        scoreGroups[p.totalScore].push(p);
      });

      const hasTies = Object.values(scoreGroups).some((grp) => grp.length > 1);

      if (hasTies && currentPlayers.length > 1) {
        // Trigger Tie Breaker PK Modal for tied players
        const tied = Object.values(scoreGroups).find((grp) => grp.length > 1) || [];
        setTiedPlayersForPk(tied);
        setIsTieBreakerOpen(true);
      } else {
        // No ties, ranks are 1 to N
        const rankedList = sorted.map((p, idx) => ({ ...p, rank: idx + 1 }));
        handleRoundCompleted(rankedList);
      }
    }
  };

  // Called after PK tie-breaker resolved
  const handlePkResolved = (resolvedTiedPlayers: Player[]) => {
    setIsTieBreakerOpen(false);

    // Merge PK order into full player list
    const currentList = [...players];
    // Sort primarily by totalScore, secondarily by PK order
    const sorted = currentList.sort((a, b) => {
      if (a.totalScore !== b.totalScore) {
        return settings.compareMode === 'highest'
          ? b.totalScore - a.totalScore
          : a.totalScore - b.totalScore;
      }
      const pkIndexA = resolvedTiedPlayers.findIndex((p) => p.id === a.id);
      const pkIndexB = resolvedTiedPlayers.findIndex((p) => p.id === b.id);
      if (pkIndexA !== -1 && pkIndexB !== -1) {
        return pkIndexA - pkIndexB;
      }
      return 0;
    });

    const rankedList = sorted.map((p, idx) => ({ ...p, rank: idx + 1 }));
    handleRoundCompleted(rankedList);
  };

  // Round completed processing (play fanfare + confetti ONCE, compute points)
  const handleRoundCompleted = (rankedList: Player[]) => {
    soundEffects.playFanfare();
    triggerCelebrationConfetti();

    // Single unified state update with rank and tournament match wins
    setPlayers((prev) => {
      const updated = prev.map((p) => {
        const match = rankedList.find((r) => r.id === p.id);
        const isWinner = match?.rank === 1;
        return {
          ...p,
          rank: match?.rank || p.rank,
          roundWins: isWinner ? p.roundWins + 1 : p.roundWins,
        };
      });

      const neededWins = settings.matchFormat === 'bo3' ? 2 : settings.matchFormat === 'bo5' ? 3 : 1;
      const champion = updated.find((p) => p.roundWins >= neededWins);
      if (champion && settings.matchFormat !== 'bo1') {
        setTournamentWinner(champion);
      }

      return updated;
    });
  };

  // Single player rolling handlers
  const handleStartRoll = (playerIndex: number) => {
    soundEffects.playDiceShake();
    roundEvaluatedRef.current = false;
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === playerIndex ? { ...p, isRolling: true } : p))
    );
  };

  const handleStopRoll = (playerIndex: number) => {
    const rolledDice = Array.from({ length: settings.diceCount }, () =>
      Math.floor(Math.random() * 6) + 1
    );
    const sum = rolledDice.reduce((acc, val) => acc + val, 0);

    soundEffects.playDiceLand();

    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === playerIndex
          ? {
              ...p,
              isRolling: false,
              hasRolled: true,
              dice: rolledDice,
              totalScore: sum,
            }
          : p
      )
    );

    // Advance active player in sequential mode
    if (settings.rollExecutionMode === 'sequential') {
      if (playerIndex < players.length - 1) {
        setActivePlayerIndex(playerIndex + 1);
      }
    }
  };

  // Simultaneous / Master roll triggers (supports both press_hold and click_toggle)
  const handleStartSimultaneousRoll = () => {
    if (isSimultaneousRolling) return;
    setIsSimultaneousRolling(true);
    roundEvaluatedRef.current = false;
    soundEffects.playDiceShake();

    // Start shaking all unrolled players
    setPlayers((prev) =>
      prev.map((p) => (p.hasRolled ? p : { ...p, isRolling: true }))
    );
  };

  const handleStopSimultaneousRoll = () => {
    if (!isSimultaneousRolling) return;
    soundEffects.playDiceLand();

    setPlayers((prev) =>
      prev.map((p) => {
        if (p.hasRolled) return p;
        const rolledDice = Array.from({ length: settings.diceCount }, () =>
          Math.floor(Math.random() * 6) + 1
        );
        const sum = rolledDice.reduce((acc, val) => acc + val, 0);
        return {
          ...p,
          isRolling: false,
          hasRolled: true,
          dice: rolledDice,
          totalScore: sum,
        };
      })
    );
    setIsSimultaneousRolling(false);
  };

  // Fallback single-trigger auto simultaneous roll
  const handleSimultaneousRollAll = () => {
    if (isSimultaneousRolling) return;
    handleStartSimultaneousRoll();
    simultaneousTimerRef.current = setTimeout(() => {
      handleStopSimultaneousRoll();
    }, 1200);
  };

  // Next round in BO3/BO5
  const handleNextRound = () => {
    soundEffects.playClick();
    roundEvaluatedRef.current = false;
    setCurrentRound((prev) => prev + 1);
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        dice: Array(settings.diceCount).fill(1),
        isRolling: false,
        hasRolled: false,
        totalScore: 0,
      }))
    );
    setActivePlayerIndex(0);
    setGamePhase('rolling');
  };

  // Full rematch reset (requirement 12: 重賽後該排名就清除)
  const handleRematch = () => {
    soundEffects.playClick();
    roundEvaluatedRef.current = false;
    setCurrentRound(1);
    setTournamentWinner(null);
    setPlayers((prev) =>
      prev.map((p, idx) => ({
        ...p,
        dice: Array(settings.diceCount).fill(1),
        isRolling: false,
        hasRolled: false,
        totalScore: 0,
        rank: idx + 1,
        roundWins: 0,
      }))
    );
    setActivePlayerIndex(0);
    setGamePhase('rolling');
  };

  const isAllRolled = players.every((p) => p.hasRolled);

  return (
    <div className="min-h-screen bg-[#FFDE59] text-[#2D2D2D] flex flex-col justify-between font-sans selection:bg-[#FF6B6B] selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 px-3 sm:px-6 pt-3 pb-1">
        <div className="max-w-7xl mx-auto bg-white border-3 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="bg-[#FF6B6B] p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white">
              <Dices className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-black text-base sm:text-xl text-[#2D2D2D] tracking-tight">
                  玩具輪玩
                </h1>
                <span className="bg-[#4ECDC4] text-black text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-lg border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  投骰子比賽
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#2D2D2D]/80 font-bold hidden md:block">
                投骰比大小排名 • 倒計時器輪流玩玩具
              </p>
            </div>
          </div>

          {/* Quick Controls on Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Player Count Modifier */}
            <div className="flex items-center bg-[#FFF8D6] p-1 rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <button
                type="button"
                onClick={() => handleUpdatePlayerCount(settings.playerCount - 1)}
                disabled={settings.playerCount <= 1}
                title="減少玩家"
                className="p-1 sm:p-1.5 bg-white hover:bg-[#FF6B6B] hover:text-white rounded-lg sm:rounded-xl text-[#2D2D2D] border border-black disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-[#2D2D2D] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1 px-1.5 sm:px-2 text-xs sm:text-sm font-black text-[#2D2D2D]">
                <Users className="w-3.5 h-3.5 text-[#2D2D2D]" />
                <span>{settings.playerCount} 人</span>
              </div>
              <button
                type="button"
                onClick={() => handleUpdatePlayerCount(settings.playerCount + 1)}
                disabled={settings.playerCount >= 8}
                title="增加玩家"
                className="p-1 sm:p-1.5 bg-white hover:bg-[#4ECDC4] hover:text-black rounded-lg sm:rounded-xl text-[#2D2D2D] border border-black disabled:opacity-30 disabled:hover:bg-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Compare Mode Toggle (比大 / 比小) */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setSettings((prev) => ({
                  ...prev,
                  compareMode: prev.compareMode === 'highest' ? 'lowest' : 'highest',
                }));
              }}
              title="切換比大或比小"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#FFDE59] text-[#2D2D2D] rounded-xl font-black text-xs border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <Scale className="w-3.5 h-3.5 text-[#2D2D2D]" />
              <span>{settings.compareMode === 'highest' ? '👑 比大' : '🐭 比小'}</span>
            </button>

            {/* Layout Toggle (水平 / 橢圓) */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setSettings((prev) => ({
                  ...prev,
                  layoutMode: prev.layoutMode === 'horizontal' ? 'oval' : 'horizontal',
                }));
              }}
              title="切換顯示佈局"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl font-black text-xs border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all ${
                settings.layoutMode === 'oval'
                  ? 'bg-[#4ECDC4] text-black'
                  : 'bg-white hover:bg-slate-100 text-[#2D2D2D]'
              }`}
            >
              {settings.layoutMode === 'oval' ? (
                <>
                  <CircleDot className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">橢圓排列</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">水平排列</span>
                </>
              )}
            </button>

            {/* Direct Link to Timer Mode if all rolled */}
            {isAllRolled && gamePhase !== 'play_timer' && (
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setGamePhase('play_timer');
                }}
                className="px-3 sm:px-3.5 py-2 bg-[#4ECDC4] hover:bg-[#3dbdb4] text-black font-black text-xs rounded-xl border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5 animate-bounce"
              >
                <Timer className="w-3.5 h-3.5" />
                <span>開始計時</span>
              </button>
            )}

            {/* Settings Modal Button */}
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setIsSettingsOpen(true);
              }}
              title="遊戲規則與計時器設定"
              className="p-2 sm:p-2.5 bg-white hover:bg-[#FFDE59] text-[#2D2D2D] rounded-xl sm:rounded-2xl border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 md:p-8 flex flex-col justify-center">
        {gamePhase === 'play_timer' ? (
          /* Mode: Toy Turn Countdown Timer */
          <ToyPlayTimer
            rankedPlayers={players.slice().sort((a, b) => a.rank - b.rank)}
            settings={settings}
            onRematch={handleRematch}
            onBackToGame={() => setGamePhase('round_result')}
          />
        ) : gamePhase === 'round_result' || gamePhase === 'match_result' ? (
          /* Mode: Round / Tournament Ranking Board */
          <RankingBoard
            players={players}
            settings={settings}
            onProceedToTimer={() => {
              soundEffects.playClick();
              setGamePhase('play_timer');
            }}
            onRematch={handleRematch}
            onNextRound={handleNextRound}
            tournamentWinner={tournamentWinner}
            onBackToDice={() => setGamePhase('rolling')}
          />
        ) : (
          /* Mode: Active Dice Rolling Phase */
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FF6B6B] rounded-xl border-2 border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black text-[#2D2D2D]">
                      {settings.matchFormat === 'bo1'
                        ? '單場一局定勝負'
                        : settings.matchFormat === 'bo3'
                        ? `三戰兩勝 (第 ${currentRound} 局)`
                        : `五戰三勝 (第 ${currentRound} 局)`}
                    </span>
                    <span className="text-xs bg-[#FFDE59] text-black font-black px-2.5 py-0.5 rounded-lg border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {settings.diceCount} 顆骰子
                    </span>
                    <span className="text-xs bg-[#4ECDC4] text-black font-black px-2.5 py-0.5 rounded-lg border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      {settings.compareMode === 'highest' ? '👑 比大勝' : '🐭 比小勝'}
                    </span>
                  </div>
                  <p className="text-xs text-[#2D2D2D]/70 font-bold mt-0.5">
                    {settings.rollExecutionMode === 'individual'
                      ? `每人依序投骰 (${settings.rollTriggerMode === 'press_hold' ? '按住搖骰' : '點擊開/停'})`
                      : '統一投骰模式 (可一鍵全員開骰)'}
                  </p>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="flex items-center gap-2">
                {settings.rollExecutionMode === 'simultaneous' && !isAllRolled && (
                  <button
                    type="button"
                    onClick={handleSimultaneousRollAll}
                    className="px-4 py-2.5 bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-black text-xs sm:text-sm rounded-xl border-2 sm:border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    {isSimultaneousRolling ? '全員骰動中...' : '全員一鍵投骰！'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRematch}
                  title="重新洗牌開局"
                  className="px-3.5 py-2.5 bg-white hover:bg-[#FFF8D6] text-[#2D2D2D] font-black text-xs rounded-xl border-2 sm:border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  重開本局
                </button>
              </div>
            </div>

            {/* Layout selector display */}
            {settings.layoutMode === 'oval' ? (
              <OvalLayout
                players={players}
                settings={settings}
                activePlayerIndex={activePlayerIndex}
                onStartRoll={handleStartRoll}
                onStopRoll={handleStopRoll}
                onStartSimultaneousRoll={handleStartSimultaneousRoll}
                onStopSimultaneousRoll={handleStopSimultaneousRoll}
                onSimultaneousRollAll={handleSimultaneousRollAll}
                isSimultaneousRolling={isSimultaneousRolling}
                onEditPlayer={(p) => setEditingPlayer(p)}
                isAllRolled={isAllRolled}
                onProceedToTimer={() => setGamePhase('play_timer')}
                onProceedToRanking={() => setGamePhase('round_result')}
                onRematch={handleRematch}
              />
            ) : (
              <HorizontalLayout
                players={players}
                settings={settings}
                activePlayerIndex={activePlayerIndex}
                onStartRoll={handleStartRoll}
                onStopRoll={handleStopRoll}
                onStartSimultaneousRoll={handleStartSimultaneousRoll}
                onStopSimultaneousRoll={handleStopSimultaneousRoll}
                onSimultaneousRollAll={handleSimultaneousRollAll}
                isSimultaneousRolling={isSimultaneousRolling}
                onEditPlayer={(p) => setEditingPlayer(p)}
                isAllRolled={isAllRolled}
                onProceedToTimer={() => setGamePhase('play_timer')}
                onProceedToRanking={() => setGamePhase('round_result')}
                onRematch={handleRematch}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer Instructions / Fair Play Reminder */}
      <footer className="px-3 sm:px-6 pb-4 pt-2">
        <div className="max-w-7xl mx-auto bg-white border-3 sm:border-4 border-black rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-[#2D2D2D]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF6B6B]" />
            <span className="font-black text-[#2D2D2D]">小提醒：</span>
            <span>骰子決定先後順序，遵守規則輪流玩，大家都是好朋友！</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[#FFF8D6] px-2 py-0.5 rounded-lg border border-black">
              倒數計時預設：{settings.timerDuration}秒
            </span>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="text-[#2D2D2D] underline font-black hover:text-[#FF6B6B] transition-colors"
            >
              調整設定
            </button>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetMatch={handleRematch}
      />

      {/* Avatar & Player Profile Picker */}
      {editingPlayer && (
        <AvatarPickerModal
          player={editingPlayer}
          isOpen={!!editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onUpdate={(updated) => {
            setPlayers((prev) =>
              prev.map((p) => (p.id === editingPlayer.id ? { ...p, ...updated } : p))
            );
          }}
        />
      )}

      {/* Tie Breaker Modal (when in strict ranking mode and ties occur) */}
      <TieBreakerModal
        tiedPlayers={tiedPlayersForPk}
        settings={settings}
        isOpen={isTieBreakerOpen}
        onResolved={handlePkResolved}
      />
    </div>
  );
}
