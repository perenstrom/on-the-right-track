import { SegmentTeamState, Team } from '@prisma/client';
import { ablyEvents, makePublishMessage } from './ably';

const publishMessage = makePublishMessage('admin');

export const publishNewSegmentTeamState = async (
  competitionId: string,
  segmentTeamState: SegmentTeamState
) => {
  return publishMessage(
    ablyEvents.newSegmentTeamState,
    competitionId,
    segmentTeamState
  );
};

export const publishNewTeam = async (competitionId: string, team: Team) => {
  return publishMessage(ablyEvents.newSegmentTeamState, competitionId, team);
};
