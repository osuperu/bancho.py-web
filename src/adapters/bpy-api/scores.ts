import axios from 'axios';

const apiInstance = axios.create({
  baseURL: process.env.PUBLIC_APP_BPY_API_BASE_URL,
});

// TODO: add enum for SubmittionStatus
interface GetScoreRequest {
  id: number;
}

export interface GetScoreResponse {
  status: string;
  score: ScoreDetails;
}

export interface GetRecentScoresResponse {
  status: string;
  scores: ScoreDetails[];
}

export interface ScoreDetails {
  id: number;
  beatmapMd5: string;
  score: number;
  maxCombo: number;
  fullCombo: boolean;
  mods: number;
  count300: number;
  count100: number;
  count50: number;
  countGeki: number;
  countKatu: number;
  countMiss: number;
  time: Date;
  playMode: number;
  accuracy: number;
  pp: number;
  rank: 'XH' | 'X' | 'SH' | 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  completed: number;
  userId: number;
  user: {
    id: number;
    username: string;
    registeredOn: Date;
    privileges: number;
    latestActivity: Date;
    country: string;
  };
  beatmap: BeatmapDetails;
}

export interface BeatmapDetails {
  beatmapId: number;
  beatmapsetId: number;
  beatmapMd5: string;
  artist: string;
  title: string;
  version: string;
  ar: number;
  od: number;
  difficulty: number;
  maxCombo: number;
  hitLength: number;
  latestUpdate: Date;
}

interface ScoresRequest {
  page: number;
  limit: number;
}

export const getScore = async (
  request: GetScoreRequest,
): Promise<GetScoreResponse> => {
  const scoreResponse = await apiInstance.get(`/v2/scores/${request.id}`, {
    params: {
      id: request.id,
    },
  });
  const userResponse = await apiInstance.get(
    `/v2/players/${scoreResponse.data.data.userid}`,
  );
  const beatmapResponse = await apiInstance.get('/v1/get_map_info', {
    params: {
      md5: scoreResponse.data.data.map_md5,
    },
  });
  return {
    status: scoreResponse.data.status,
    score: {
      id: scoreResponse.data.data.id,
      beatmapMd5: scoreResponse.data.data.map_md5,
      score: scoreResponse.data.data.score,
      maxCombo: scoreResponse.data.data.max_combo,
      fullCombo: scoreResponse.data.data.perfect,
      mods: scoreResponse.data.data.mods,
      count300: scoreResponse.data.data.n300,
      count100: scoreResponse.data.data.n100,
      count50: scoreResponse.data.data.n50,
      countGeki: scoreResponse.data.data.ngeki,
      countKatu: scoreResponse.data.data.nkatu,
      countMiss: scoreResponse.data.data.nmiss,
      time: new Date(scoreResponse.data.data.play_time),
      playMode: scoreResponse.data.data.mode,
      accuracy: scoreResponse.data.data.acc,
      pp: scoreResponse.data.data.pp,
      rank: scoreResponse.data.data.grade,
      completed: scoreResponse.data.data.status >= 1 ? 1 : 0,
      userId: scoreResponse.data.data.userid,
      user: {
        id: userResponse.data.data.id,
        username: userResponse.data.data.name,
        registeredOn: new Date(userResponse.data.data.creation_time * 1000),
        privileges: userResponse.data.data.priv,
        latestActivity: new Date(userResponse.data.data.latest_activity * 1000),
        country: userResponse.data.data.country,
      },
      beatmap: {
        beatmapId: beatmapResponse.data.map.id,
        beatmapsetId: beatmapResponse.data.map.set_id,
        beatmapMd5: beatmapResponse.data.map.md5,
        artist: beatmapResponse.data.map.artist,
        title: beatmapResponse.data.map.title,
        version: beatmapResponse.data.map.version,
        ar: beatmapResponse.data.map.ar,
        od: beatmapResponse.data.map.od,
        difficulty: beatmapResponse.data.map.diff,
        maxCombo: beatmapResponse.data.map.max_combo,
        hitLength: beatmapResponse.data.map.total_length,
        latestUpdate: beatmapResponse.data.map.last_update,
      },
    },
  };
};

export const fetchRecentScores = async (): Promise<GetRecentScoresResponse> => {
  const submittedScoresResponse = await apiInstance.get('/v2/scores', {
    params: {
      status: 1,
      page_size: 5,
      order: 'desc',
    },
  });
  const bestScoresResponse = await apiInstance.get('/v2/scores', {
    params: {
      status: 2,
      page_size: 5,
      order: 'desc',
    },
  });

  const sortedByDate = [
    ...submittedScoresResponse.data.data,
    ...bestScoresResponse.data.data,
  ].sort(
    (a, b) => new Date(b.play_time).getTime() - new Date(a.play_time).getTime(),
  );

  if (!sortedByDate.length) {
    return {
      status: 'success',
      scores: [],
    };
  }

  const scoresResponse = new Array(sortedByDate.length).fill(null);
  const midPoint = Math.floor(sortedByDate.length / 2);

  scoresResponse[midPoint] = sortedByDate[0];

  let left = midPoint - 1;
  let right = midPoint + 1;
  let index = 1;

  while (index < sortedByDate.length) {
    if (left >= 0) {
      scoresResponse[left] = sortedByDate[index];
      left--;
      index++;
    }
    if (right < scoresResponse.length && index < sortedByDate.length) {
      scoresResponse[right] = sortedByDate[index];
      right++;
      index++;
    }
  }

  const validScores = scoresResponse.filter((score) => score !== null);

  const scores = await Promise.all(
    validScores.map(async (score) => {
      try {
        const userResponse = await apiInstance.get(
          `/v2/players/${score.userid}`,
        );
        const beatmapResponse = await apiInstance.get('/v1/get_map_info', {
          params: {
            md5: score.map_md5,
          },
        });

        return {
          id: score.id,
          beatmapMd5: score.map_md5,
          score: score.score,
          maxCombo: score.max_combo,
          fullCombo: score.perfect,
          mods: score.mods,
          count300: score.n300,
          count100: score.n100,
          count50: score.n50,
          countGeki: score.ngeki,
          countKatu: score.nkatu,
          countMiss: score.nmiss,
          time: new Date(score.play_time),
          playMode: score.mode,
          accuracy: score.acc,
          pp: score.pp,
          rank: score.grade,
          completed: score.status >= 1 ? 1 : 0,
          userId: score.userid,
          user: {
            id: userResponse.data.data.id,
            username: userResponse.data.data.name,
            registeredOn: new Date(userResponse.data.data.creation_time * 1000),
            privileges: userResponse.data.data.priv,
            latestActivity: new Date(
              userResponse.data.data.latest_activity * 1000,
            ),
            country: userResponse.data.data.country,
          },
          beatmap: {
            beatmapId: beatmapResponse.data.map.id,
            beatmapsetId: beatmapResponse.data.map.set_id,
            beatmapMd5: beatmapResponse.data.map.md5,
            artist: beatmapResponse.data.map.artist,
            title: beatmapResponse.data.map.title,
            version: beatmapResponse.data.map.version,
            ar: beatmapResponse.data.map.ar,
            od: beatmapResponse.data.map.od,
            difficulty: beatmapResponse.data.map.diff,
            maxCombo: beatmapResponse.data.map.max_combo,
            hitLength: beatmapResponse.data.map.total_length,
            latestUpdate: beatmapResponse.data.map.last_update,
          },
        };
      } catch (error) {
        console.error('Error fetching score details:', error);
        return null;
      }
    }),
  );

  const validFinalScores = scores.filter(
    (score): score is ScoreDetails => score !== null,
  );

  return {
    status: submittedScoresResponse.data.status,
    scores: validFinalScores,
  };
};

export const fetchAllScores = async (
  request: ScoresRequest,
): Promise<GetRecentScoresResponse> => {
  const response = await apiInstance.get('/v2/scores', {
    params: {
      page_size: request.limit,
      page: request.page,
      order: 'desc',
    },
  });

  const scores = await Promise.all(
    response.data.data.map(async (score: any) => {
      try {
        const userResponse = await apiInstance.get(
          `/v2/players/${score.userid}`,
        );
        const beatmapResponse = await apiInstance.get('/v1/get_map_info', {
          params: {
            md5: score.map_md5,
          },
        });

        return {
          id: score.id,
          beatmapMd5: score.map_md5,
          score: score.score,
          maxCombo: score.max_combo,
          fullCombo: score.perfect,
          mods: score.mods,
          count300: score.n300,
          count100: score.n100,
          count50: score.n50,
          countGeki: score.ngeki,
          countKatu: score.nkatu,
          countMiss: score.nmiss,
          time: new Date(score.play_time),
          playMode: score.mode,
          accuracy: score.acc,
          pp: score.pp,
          rank: score.grade,
          completed: score.status >= 1 ? 1 : 0,
          userId: score.userid,
          user: {
            id: userResponse.data.data.id,
            username: userResponse.data.data.name,
            registeredOn: new Date(userResponse.data.data.creation_time * 1000),
            privileges: userResponse.data.data.priv,
            latestActivity: new Date(
              userResponse.data.data.latest_activity * 1000,
            ),
            country: userResponse.data.data.country,
          },
          beatmap: {
            beatmapId: beatmapResponse.data.map.id,
            beatmapsetId: beatmapResponse.data.map.set_id,
            beatmapMd5: beatmapResponse.data.map.md5,
            artist: beatmapResponse.data.map.artist,
            title: beatmapResponse.data.map.title,
            version: beatmapResponse.data.map.version,
            ar: beatmapResponse.data.map.ar,
            od: beatmapResponse.data.map.od,
            difficulty: beatmapResponse.data.map.diff,
            maxCombo: beatmapResponse.data.map.max_combo,
            hitLength: beatmapResponse.data.map.total_length,
            latestUpdate: beatmapResponse.data.map.last_update,
          },
        };
      } catch (error) {
        console.error('Error fetching score details:', error);
        return null;
      }
    }),
  );

  const validScores = scores.filter(
    (score): score is ScoreDetails => score !== null,
  );

  return {
    status: response.data.status,
    scores: validScores,
  };
};

export const fetchTotalScoresSet = async (): Promise<number> => {
  const submittedScoresResponse = await apiInstance.get('/v2/scores', {
    params: {
      status: 1,
    },
  });
  const bestScoresResponse = await apiInstance.get('/v2/scores', {
    params: {
      status: 2,
    },
  });
  return (
    submittedScoresResponse.data.meta.total + bestScoresResponse.data.meta.total
  );
};

export const fetchTotalPPEarned = async (): Promise<number> => {
  const earnedSubmittedPPResponse = await apiInstance.get(
    '/v1/aggregate_pp_stats',
    {
      params: {
        status: 1,
      },
    },
  );
  const earnedBestPPResponse = await apiInstance.get('/v1/aggregate_pp_stats', {
    params: {
      status: 2,
    },
  });
  return (
    Math.trunc(earnedSubmittedPPResponse.data.stats) +
    Math.trunc(earnedBestPPResponse.data.stats)
  );
};
