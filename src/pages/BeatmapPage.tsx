import { Box, Container, Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  type BeatmapDetails,
  type Difficulty,
  getBeatmapLeaderboard,
  getBeatmapSet,
  type LeaderboardDetails,
} from '../adapters/bpy-api/beatmaps';
import { BeatmapHeader } from '../components/beatmap/BeatmapHeader';
import { BeatmapInfo } from '../components/beatmap/BeatmapInfo';
import { BeatmapLeaderboard } from '../components/beatmap/BeatmapLeaderboard';
import { BeatmapStat } from '../components/beatmap/BeatmapStat';
import { GamemodeSelectionBar } from '../components/GamemodeSelectionBar';
import { PageTitle } from '../components/PageTitle';
import {
  GameMode,
  gameModeType,
  getGameModeString,
  mapToBpyMode,
  RelaxMode,
} from '../GameModes';

export const BeatmapPage = () => {
  const navigate = useNavigate();
  const queryParams = useParams();
  const beatmapId = Number.parseInt(queryParams.beatmapId || '0', 10);
  const mode = queryParams.mode || 'osu';
  const type = queryParams.type || 'vanilla';

  const [beatmap, setBeatmap] = useState<BeatmapDetails | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [showAllScores, setShowAllScores] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardDetails[] | null>(
    null,
  );
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    switch (mode) {
      case 'taiko':
        return GameMode.Taiko;
      case 'catch':
        return GameMode.Catch;
      case 'mania':
        return GameMode.Mania;
      default:
        return GameMode.Standard;
    }
  });
  const [relaxMode, setRelaxMode] = useState<RelaxMode>(() => {
    switch (type) {
      case 'relax':
        return RelaxMode.Relax;
      case 'autopilot':
        return RelaxMode.Autopilot;
      default:
        return RelaxMode.Vanilla;
    }
  });
  const [filteredDifficulties, setFilteredDifficulties] = useState<
    Difficulty[]
  >([]);

  const filterDifficultiesByGameMode = useCallback(
    (difficulties: Difficulty[], mode: GameMode) => {
      if (mode === GameMode.Standard) {
        return difficulties.filter(
          (diff) => diff.gameMode === GameMode.Standard,
        );
      }

      const nativeDifficulties = difficulties.filter((diff) => {
        return diff.gameMode === mode;
      });

      const convertedDifficulties = difficulties.filter(
        (diff) => diff.gameMode === GameMode.Standard,
      );

      return [...nativeDifficulties, ...convertedDifficulties];
    },
    [],
  );

  useEffect(() => {
    const fetchBeatmap = async () => {
      try {
        const beatmapSet = await getBeatmapSet(beatmapId);

        const firstBeatmap = beatmapSet.beatmap[0];

        setBeatmap(firstBeatmap);

        const filtered = filterDifficultiesByGameMode(
          firstBeatmap.difficulties,
          gameMode,
        );
        setFilteredDifficulties(filtered);

        const targetDifficulty = filtered.find((d) => d.id === beatmapId);
        if (targetDifficulty) {
          setSelectedDifficulty(targetDifficulty);
        } else if (filtered.length > 0) {
          setSelectedDifficulty(filtered[0]);
        } else {
          setSelectedDifficulty(null);
        }
      } catch (error) {
        console.error('Error fetching beatmap:', error);
      }
    };

    fetchBeatmap();
  }, [beatmapId, gameMode, filterDifficultiesByGameMode]);

  useEffect(() => {
    if (beatmap) {
      const filtered = filterDifficultiesByGameMode(
        beatmap.difficulties,
        gameMode,
      );
      setFilteredDifficulties(filtered);

      if (filtered.length > 0) {
        if (!filtered.some((d) => d.id === selectedDifficulty?.id)) {
          setSelectedDifficulty(filtered[0]);
        }
      } else {
        setSelectedDifficulty(null);
      }
    }
  }, [gameMode, beatmap, selectedDifficulty?.id, filterDifficultiesByGameMode]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!selectedDifficulty) {
        setLeaderboard(null);
        return;
      }

      setIsLoadingLeaderboard(true);
      setLeaderboardError(null);

      try {
        let bpyMode: number;
        try {
          bpyMode = mapToBpyMode(gameMode, relaxMode);
        } catch (_e: any) {
          setLeaderboardError(
            'Invalid combination of game mode and relax mode',
          );
          setLeaderboard(null);
          setIsLoadingLeaderboard(false);
          return;
        }

        const response = await getBeatmapLeaderboard(
          selectedDifficulty.id,
          bpyMode,
        );

        if (response.status === 'success' && response.leaderboard) {
          setLeaderboard(response.leaderboard);
        } else {
          setLeaderboardError('Failed to load scores');
          setLeaderboard(null);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLeaderboardError('Failed to load scores');
        setLeaderboard(null);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };

    fetchLeaderboard();
  }, [selectedDifficulty, gameMode, relaxMode]);

  const toggleScoresView = () => {
    setShowAllScores(!showAllScores);
  };

  const handleGameModeChange = (newMode: GameMode) => {
    setGameMode(newMode);
    setLeaderboard(null);
    if (selectedDifficulty) {
      const modeString = getGameModeString(newMode);
      const typeString = gameModeType(newMode);
      navigate(`/b/${selectedDifficulty.id}/${modeString}/${typeString}`);
    }
  };

  const handleRelaxModeChange = (newMode: RelaxMode) => {
    setRelaxMode(newMode);
    setLeaderboard(null);
    if (selectedDifficulty) {
      const modeString = getGameModeString(gameMode);
      const typeString =
        newMode === RelaxMode.Relax
          ? 'relax'
          : newMode === RelaxMode.Autopilot
            ? 'autopilot'
            : 'vanilla';
      navigate(`/b/${selectedDifficulty.id}/${modeString}/${typeString}`);
    }
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    const modeString = getGameModeString(gameMode);
    const typeString = gameModeType(gameMode);
    navigate(`/b/${difficulty.id}/${modeString}/${typeString}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#151223' }}>
      <PageTitle
        title={`osu!Peru - ${beatmap?.artist} - ${beatmap?.title} - [${selectedDifficulty?.name}]`}
      />
      {/* Beatmap Header */}
      <BeatmapHeader
        beatmap={beatmap}
        filteredDifficulties={filteredDifficulties}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={handleDifficultySelect}
        gameMode={gameMode}
      />

      <Box bgcolor="#FFBD3B99" width="100%" height={2} />
      <Box
        width="100%"
        bgcolor="#211D35"
        color="#FFFFFF80"
        position="relative"
        zIndex={2}
      >
        <Container>
          <GamemodeSelectionBar
            gameMode={gameMode}
            setGameMode={handleGameModeChange}
            relaxMode={relaxMode}
            setRelaxMode={handleRelaxModeChange}
          />
        </Container>
      </Box>

      <Container
        disableGutters
        maxWidth={false}
        sx={{ px: { xs: 2, sm: 3, md: 4 }, maxWidth: '1200px', mx: 'auto' }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ width: '100%', mt: 3 }}
        >
          <Box sx={{ width: { xs: '100%', md: '66.67%' } }}>
            <BeatmapLeaderboard
              leaderboard={leaderboard}
              isLoadingLeaderboard={isLoadingLeaderboard}
              leaderboardError={leaderboardError}
              selectedDifficulty={selectedDifficulty}
              showAllScores={showAllScores}
              toggleScoresView={toggleScoresView}
            />
          </Box>

          <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
            <Stack spacing={3}>
              <BeatmapStat difficulty={selectedDifficulty} />
              <BeatmapInfo beatmap={beatmap} />
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};
