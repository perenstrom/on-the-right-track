import Ably from 'ably';

export const ablyEvents = {
  newLevel: 'newLevel',
  newStage: 'newStage',
  newScoresPublished: 'newScoresPublished',
  newSegmentTeamState: 'newSegmentTeamState',
  newTeam: 'newTeam',
} as const;

export const makePublishMessage =
  (area: 'client' | 'admin') =>
  async <T extends Record<string, any>>(
    eventName: keyof typeof ablyEvents,
    competitionId: string,
    data: T
  ) => {
    console.log(`${area}: Publishing ${eventName} for competition ${competitionId}`);
    const ably = new Ably.Realtime.Promise(process.env.ABLY_PUBLISH_API_KEY);
    const testChannel = await ably.channels.get(`${area}-${competitionId}`);
    console.log(`${area}: Got channel ${area}-${competitionId}`);
    await testChannel.publish(eventName, data);
    console.log(`${area}: Published ${eventName} for competition ${competitionId}`);
    ably.close();
  };
