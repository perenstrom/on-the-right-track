import Ably from 'ably';

export const ablyEvents = {
  newLevel: 'newLevel',
  newStage: 'newStage',
  newScoresPublished: 'newScoresPublished'
} as const;

export const makePublishMessage =
  (area: 'client' | 'admin') =>
  async <T extends Record<string, any>>(
    eventName: keyof typeof ablyEvents,
    competitionId: string,
    data: T
  ) => {
    const ably = new Ably.Realtime.Promise(process.env.ABLY_PUBLISH_API_KEY);
    const testChannel = await ably.channels.get(`${area}-${competitionId}`);
    await testChannel.publish(eventName, data);
    ably.close();
  };
