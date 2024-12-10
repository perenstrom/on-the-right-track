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
  return publishMessage(ablyEvents.newTeam, competitionId, team);
};

export const publishDeletedTeam = async (
  competitionId: string,
  teamId: string
) => {
  return publishMessage(ablyEvents.deletedTeam, competitionId, { teamId });
};

export const publishNewStage = async (
  competitionId: string,
  stage: number | null
) => {
  return publishMessage(ablyEvents.newStage, competitionId, { stage });
};

export const publishNewLevel = async (
  competitionId: string,
  level: number | null
) => {
  return publishMessage(ablyEvents.newLevel, competitionId, { level });
};
