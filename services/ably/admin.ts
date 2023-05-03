import { SegmentTeamState, Team } from '@prisma/client';
import { ablyEvents, makePublishMessage } from './ably';

const publishMessage = makePublishMessage('admin');

export const publishNewSegmentTeamState = async (
  competitionId: string,
  segmentTeamState: SegmentTeamState
) => {
  publishMessage(
    ablyEvents.newSegmentTeamState,
    competitionId,
    segmentTeamState
  );
};

export const publishNewTeam = async (competitionId: string, team: Team) => {
  publishMessage(ablyEvents.newSegmentTeamState, competitionId, team);
};