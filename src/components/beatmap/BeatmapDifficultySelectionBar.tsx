import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import type { Difficulty } from '../../adapters/bpy-api/beatmaps';
import { GameMode } from '../../GameModes';
import { CatchGameModeIcon } from '../images/gamemode-icons/CatchGamemodeIcon';
import { ManiaGameModeIcon } from '../images/gamemode-icons/ManiaGamemodeIcon';
import { StandardGameModeIcon } from '../images/gamemode-icons/StandardGamemodeIcon';
import { TaikoGameModeIcon } from '../images/gamemode-icons/TaikoGamemodeIcon';

const getDifficultyColor = (stars: number): string => {
  const domain = [0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9];
  const range = [
    '#4290FB',
    '#4FC0FF',
    '#4FFFD5',
    '#7CFF4F',
    '#F6F05C',
    '#FF8068',
    '#FF4E6F',
    '#C645B8',
    '#6563DE',
    '#18158E',
    '#000000',
  ];

  if (stars > 9) {
    return '#000000';
  }

  let index = 0;
  while (index < domain.length - 1 && stars >= domain[index]) {
    index++;
  }

  if (index === 0) {
    return range[0];
  } else if (index === domain.length) {
    return range[range.length - 1];
  } else {
    const prevValue = domain[index - 1];
    const nextValue = domain[index];
    const prevColor = range[index - 1];
    const nextColor = range[index];
    const proportion = (stars - prevValue) / (nextValue - prevValue);

    const prevRed = Number.parseInt(prevColor.substring(1, 3), 16);
    const prevGreen = Number.parseInt(prevColor.substring(3, 5), 16);
    const prevBlue = Number.parseInt(prevColor.substring(5, 7), 16);

    const nextRed = Number.parseInt(nextColor.substring(1, 3), 16);
    const nextGreen = Number.parseInt(nextColor.substring(3, 5), 16);
    const nextBlue = Number.parseInt(nextColor.substring(5, 7), 16);

    const red = Math.round(prevRed + (nextRed - prevRed) * proportion);
    const green = Math.round(prevGreen + (nextGreen - prevGreen) * proportion);
    const blue = Math.round(prevBlue + (nextBlue - prevBlue) * proportion);

    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  }
};

const DifficultySelector = ({
  difficulty,
  isSelected,
  onSelect,
  currentGameMode,
}: {
  difficulty: Difficulty;
  isSelected: boolean;
  onSelect: (difficulty: Difficulty) => void;
  currentGameMode: GameMode;
}) => {
  const { t } = useTranslation();

  const difficultyColor = getDifficultyColor(difficulty.stars);

  const isConverted =
    difficulty.gameMode === GameMode.Standard &&
    currentGameMode !== GameMode.Standard;

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2">
            {difficulty.name} {isConverted ? `(${t('beatmap.converted')})` : ''}
          </Typography>
          <Typography variant="body2">
            {difficulty.stars.toFixed(2)} ★
          </Typography>
          <Typography variant="body2">
            {difficulty.circleCount} {t('beatmap.circles')},{' '}
            {difficulty.sliderCount} {t('beatmap.sliders')},{' '}
            {difficulty.spinnerCount} {t('beatmap.spinners')}
          </Typography>
        </Box>
      }
    >
      <Box
        position="relative"
        height={25}
        width={25}
        onClick={() => onSelect(difficulty)}
        sx={{
          color: difficultyColor,
          opacity: isSelected ? 1 : 0.5,
          cursor: 'pointer',
          transition: 'transform 0.2s, opacity 0.2s, filter 0.2s',
          filter: isSelected
            ? 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))'
            : 'none',
          '&:hover': {
            transform: 'scale(1.2)',
            opacity: 0.8,
          },
        }}
      >
        {difficulty.gameMode === GameMode.Standard && <StandardGameModeIcon />}
        {difficulty.gameMode === GameMode.Taiko && <TaikoGameModeIcon />}
        {difficulty.gameMode === GameMode.Catch && <CatchGameModeIcon />}
        {difficulty.gameMode === GameMode.Mania && <ManiaGameModeIcon />}

        {}
        {isConverted && (
          <Box
            component="div"
            sx={{
              position: 'absolute',
              bottom: '-5px',
              right: '-5px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#FFBD3B',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              boxShadow: isSelected
                ? '0 0 4px rgba(255, 189, 59, 0.8)'
                : 'none',
              pointerEvents: 'none',
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};

export const BeatmapDifficultySelectionBar = ({
  difficulties = [],
  selectedDifficulty,
  onSelectDifficulty,
  currentGameMode,
}: {
  difficulties: Difficulty[];
  selectedDifficulty: Difficulty | null;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  currentGameMode: GameMode;
}) => {
  const sortedDifficulties = [...difficulties].sort(
    (a, b) => a.stars - b.stars,
  );

  return (
    <Stack
      spacing={1}
      py={2}
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'center' }}
    >
      <Stack
        direction="row"
        gap={2}
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
      >
        {sortedDifficulties.map((difficulty) => (
          <DifficultySelector
            key={difficulty.id}
            difficulty={difficulty}
            isSelected={selectedDifficulty?.id === difficulty.id}
            onSelect={onSelectDifficulty}
            currentGameMode={currentGameMode}
          />
        ))}
      </Stack>
    </Stack>
  );
};
