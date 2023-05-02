import { SegmentTeamState } from '@prisma/client';
import { ablyEvents, makePublishMessage } from './ably';
import { z } from 'zod';
import { teamStateSchema } from 'schemas/zod/schema';

const publishMessage = makePublishMessage('client');

export const publishNewLevel = async (
  competitionId: string,
  level: number | null
) => {
  publishMessage(ablyEvents.newLevel, competitionId, { level });
};

export const publishNewStage = async (
  competitionId: string,
  stage: number | null
) => {
  publishMessage(ablyEvents.newStage, competitionId, { stage });
};

export const publishNewScoresPublished = async (
  competitionId: string,
  published: boolean
) => {
  publishMessage(ablyEvents.newScoresPublished, competitionId, { published });
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
  publishMessage(
    ablyEvents.newSegmentTeamState,
    competitionId,
    segmentTeamState
  );
};
