import Ably from 'ably';

export const ablyEvents = {
  setLevel: 'setLevel',
  setStage: 'setStage'
} as const;

export const publishNewLevel = async (
  competitionId: string,
  level: number | null
) => {
  const ably = new Ably.Realtime.Promise(process.env.ABLY_PUBLISH_API_KEY);
  const testChannel = await ably.channels.get(`client-${competitionId}`);
  await testChannel.publish(ablyEvents.setLevel, { level });
  ably.close();
};

export const publishNewStage = async (
  competitionId: string,
  stage: number | null
) => {
  const ably = new Ably.Realtime.Promise(process.env.ABLY_PUBLISH_API_KEY);
  const testChannel = await ably.channels.get(`client-${competitionId}`);
  await testChannel.publish(ablyEvents.setLevel, { stage });
  ably.close();
};
