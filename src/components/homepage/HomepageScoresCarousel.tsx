'use client';

import { Avatar, Box, Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  fetchRecentScores,
  type GetRecentScoresResponse,
  type ScoreDetails,
} from '../../adapters/bpy-api/scores';
import { GameMode, gameModeType, getOriginalGameMode } from '../../GameModes';
import {
  getGradeColor,
  remapSSForDisplay as getGradeDisplayName,
} from '../../scores';
import { CatchGameModeIcon } from '../images/gamemode-icons/CatchGamemodeIcon';
import { ManiaGameModeIcon } from '../images/gamemode-icons/ManiaGamemodeIcon';
import { StandardGameModeIcon } from '../images/gamemode-icons/StandardGamemodeIcon';
import { TaikoGameModeIcon } from '../images/gamemode-icons/TaikoGamemodeIcon';
import { HomepageCarouselBackground } from '../images/HomepageCarouselBackground';

const ScoresCarouselItem = ({
  score,
  isFeatured = false,
}: {
  score: ScoreDetails;
  isFeatured?: boolean;
}) => {
  if (!score || !score.user || !score.beatmap) {
    return null;
  }

  return (
    <Box
      sx={{
        width: {
          xs: '280px',
          sm: isFeatured ? '400px' : '350px',
          md: isFeatured ? '450px' : '400px',
          lg: isFeatured ? '500px' : '450px',
          xl: isFeatured ? '528px' : '400px',
        },
        height: {
          xs: '180px',
          sm: isFeatured ? '220px' : '200px',
          md: isFeatured ? '240px' : '220px',
          lg: isFeatured ? '260px' : '240px',
          xl: isFeatured ? '274px' : '220px',
        },
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        transform: isFeatured
          ? {
              xs: 'scale(1.05)',
              sm: 'scale(1.08)',
              md: 'scale(1.1)',
            }
          : 'scale(1)',
        zIndex: isFeatured ? 2 : 1,
        opacity: isFeatured ? 1 : 0.8,
        boxShadow: isFeatured
          ? '0 8px 24px rgba(0,0,0,0.4)'
          : '0 4px 12px rgba(0,0,0,0.2)',
        '&:hover': {
          opacity: 0.9,
          transform: isFeatured
            ? {
                xs: 'scale(1.05)',
                sm: 'scale(1.08)',
                md: 'scale(1.1)',
              }
            : 'scale(1.02)',
          boxShadow: isFeatured
            ? '0 12px 28px rgba(0,0,0,0.5)'
            : '0 6px 16px rgba(0,0,0,0.3)',
        },
      }}
    >
      <HomepageCarouselBackground />
      <Box
        position="absolute"
        left={0}
        top={0}
        display="flex"
        justifyContent="center"
        width="100%"
        height="100%"
        padding={2}
        sx={{
          paddingTop: { xs: 3.5, sm: 2 },
        }}
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          width="100%"
        >
          {/* Top section with avatar and username */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            width="100%"
            justifyContent="center"
          >
            <Avatar
              src={`${process.env.PUBLIC_APP_BPY_AVATARS_BASE_URL}/${score.userId}`}
              alt={score.user.username}
              sx={{
                width: 40,
                height: 40,
                border: '2px solid #6b46c1',
              }}
            />
            <Box>
              <Typography
                variant="h6"
                color="white"
                fontWeight="bold"
                sx={{ fontSize: { xs: '0.9rem', sm: '1.25rem' } }}
              >
                {score.user.username}
              </Typography>
              <Typography
                variant="caption"
                color="gray"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                {moment(score.time).fromNow()}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '40px',
          left: 0,
          width: '100%',
          height: 'calc(100% - 40px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          zIndex: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Background banner */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${process.env.PUBLIC_APP_BPY_MAPS_BASE_URL}/cover/${score.beatmap.beatmapsetId})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginTop: 5,
            zIndex: -1,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(rgba(30, 27, 47, 0.85), rgba(30, 27, 47, 0.95))',
            },
          }}
        />

        {/* Beatmap information */}
        <Typography
          noWrap
          variant={isFeatured ? 'h5' : 'body1'}
          color="white"
          sx={{
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'center',
            marginTop: 5,
            fontSize: { xs: '0.75rem', sm: isFeatured ? '1.5rem' : '1rem' },
          }}
        >
          {score.beatmap.title}
        </Typography>

        <Typography
          noWrap
          variant={isFeatured ? 'h6' : 'body2'}
          color="white"
          sx={{
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            textAlign: 'center',
            fontSize: {
              xs: '0.65rem',
              sm: isFeatured ? '1.25rem' : '0.875rem',
            },
          }}
        >
          by {score.beatmap.artist} [{score.beatmap.version}]
        </Typography>

        {/* Grade */}
        <Box
          sx={{
            width: { xs: 28, sm: 36 },
            height: { xs: 28, sm: 36 },
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: getGradeColor(score.rank),
            color: 'white',
            fontWeight: 'bold',
            fontSize: { xs: '0.9rem', sm: '1.2rem' },
            mb: 1,
          }}
        >
          {getGradeDisplayName(score.rank)}
        </Box>

        {/* PP and gamemode */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              height: 25,
              width: 25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {getOriginalGameMode(score.playMode) === GameMode.Standard && (
              <StandardGameModeIcon />
            )}
            {getOriginalGameMode(score.playMode) === GameMode.Taiko && (
              <TaikoGameModeIcon />
            )}
            {getOriginalGameMode(score.playMode) === GameMode.Catch && (
              <CatchGameModeIcon />
            )}
            {getOriginalGameMode(score.playMode) === GameMode.Mania && (
              <ManiaGameModeIcon />
            )}
          </Box>
          <Typography
            variant="body2"
            color="white"
            fontWeight="bold"
            sx={{
              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
            }}
          >
            {score.pp}pp {gameModeType(score.playMode)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const HomepageScoresCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [recentScores, setRecentScores] =
    useState<GetRecentScoresResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recentScores?.scores?.length) {
      const middleIndex = Math.floor(recentScores.scores.length / 2);
      setActiveIndex(middleIndex);
    }
  }, [recentScores]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX);
    if (carouselRef.current) {
      setScrollStart(carouselRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollStart - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const centerActiveItem = useCallback(() => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const items = container.querySelectorAll('[data-score-item]');
    if (items.length === 0) return;

    const activeItem = items[activeIndex] as HTMLElement;
    if (!activeItem) return;

    const containerWidth = container.offsetWidth;
    const itemWidth = activeItem.offsetWidth;
    const scrollLeft =
      activeItem.offsetLeft - containerWidth / 2 + itemWidth / 2;

    container.scrollTo({
      left: scrollLeft,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  useEffect(() => {
    centerActiveItem();
  }, [centerActiveItem]);

  useEffect(() => {
    const handleResize = () => {
      centerActiveItem();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [centerActiveItem]);

  useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const containerWidth = container.offsetWidth;
      const scrollWidth = container.scrollWidth;
      container.scrollLeft = (scrollWidth - containerWidth) / 2;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchScores = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const scoresResponse = await fetchRecentScores();

        if (!mounted) return;

        if (!scoresResponse?.scores?.length) {
          setError('No scores available');
          return;
        }

        setRecentScores(scoresResponse);
      } catch (error) {
        console.error('Failed to fetch recent scores:', error);
        setError('Failed to load scores');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchScores();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#110E1B',
        }}
      >
        <Typography color="white">Loading scores...</Typography>
      </Box>
    );
  }

  if (error || !recentScores?.scores?.length) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          background: '#110E1B',
          paddingBottom: { xs: 2, sm: 4 },
          marginTop: -1,
          position: 'relative',
          zIndex: 0,
          width: '100%',
          maxWidth: '1920px',
          paddingX: { xs: 0, sm: 2 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            sx={{
              display: 'flex',
              gap: 0,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              padding: { xs: '20px 20px 30px', sm: '20px 60px 30px' },
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              maxWidth: '1920px',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                width: { xs: '20px', sm: '60px' },
                height: '100%',
                background: 'linear-gradient(to right, #110E1B, transparent)',
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                width: { xs: '20px', sm: '60px' },
                height: '100%',
                background: 'linear-gradient(to left, #110E1B, transparent)',
                pointerEvents: 'none',
              },
            }}
          >
            {recentScores?.scores.map((score, index) => (
              <Box
                key={score.id}
                data-score-item
                onClick={() => setActiveIndex(index)}
                sx={{
                  cursor: 'pointer',
                  minWidth: {
                    xs: '280px',
                    sm: '350px',
                    md: '400px',
                    lg: '450px',
                    xl: 'auto',
                  },
                  opacity: index === activeIndex ? 1 : 0.5,
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  marginLeft:
                    index === 0 ? 0 : { xs: '-20px', sm: '-35px', md: '-50px' },
                  position: 'relative',
                  zIndex: index === activeIndex ? 2 : 1,
                }}
              >
                <ScoresCarouselItem
                  score={score}
                  isFeatured={index === activeIndex}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
