import Ably from 'ably';

export const ablyEvents = {
  setLevel: 'setLevel'
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
