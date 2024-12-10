import { SegmentTeamState, Team } from '@prisma/client';
import { ablyEvents, makePublishMessage } from './ably';
import { z } from 'zod';
import { teamStateSchema } from 'schemas/zod/schema';

const publishMessage = makePublishMessage('client');

export const publishNewLevel = async (
  competitionId: string,
  level: number | null
) => {
  return publishMessage(ablyEvents.newLevel, competitionId, { level });
};

export const publishNewTeam = async (competitionId: string, team: Team) => {
  return publishMessage(ablyEvents.newTeam, competitionId, team);
};

export const PublishDeletedTeamSchema = z.object({
  teamId: z.string()
});
export const publishDeletedTeam = async (
  competitionId: string,
  teamId: string
) => {
  return publishMessage(ablyEvents.deletedTeam, competitionId, { teamId });
};

export const PublishNewStageSchema = z.object({
  stage: z.number().nullable()
});
export const publishNewStage = async (
  competitionId: string,
  stage: number | null
) => {
  return publishMessage(ablyEvents.newStage, competitionId, { stage });
};

export const publishNewScoresPublished = async (
  competitionId: string,
  published: boolean
) => {
  return publishMessage(ablyEvents.newScoresPublished, competitionId, {
    published
  });
};

export const publishNewWinner = async (
  competitionId: string,
  winner: string | null
) => {
  return publishMessage(ablyEvents.newWinner, competitionId, { winner });
};

export const PublishNewSegmentTeamStateSchema = z.object({
  id: z.string(),
  segmentId: z.string(),
  teamId: z.string(),
  state: teamStateSchema,
  stopLevel: z.number().nullable(),
  score: z.number().nullable()
});
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
