import axios from 'axios';

export const downloadReplay = async (
  replayId: number,
): Promise<ArrayBuffer> => {
  const response = await axios.get<ArrayBuffer>(
    `${process.env.PUBLIC_APP_BPY_API_BASE_URL}/v1/get_replay?id=${replayId}`,
    {
      responseType: 'arraybuffer',
    },
  );

  return response.data;
};
