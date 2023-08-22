import { z } from 'zod';

const SegmentType = z.enum(['TRIP', 'QUESTION', 'MUSIC', 'SPECIAL']);

const CreateSegmentSchema = z.object({
  order: z.number(),
  nearestTrip: z.number().nullable(),
  orderOfType: z.number(),
  type: SegmentType,
  numberOfOptions: z.number().nullable(),
  scorePublished: z.boolean()
});

export const CreateCompetitionSchema = z.object({
  competition: z.object({
    name: z.string(),
    hosts: z.string(),
    date: z.string()
  }),
  segments: z.array(CreateSegmentSchema)
});

export const CreateTeamSchema = z.object({
  name: z.string(),
  competitionId: z.string(),
  members: z.string()
});

export const PatchTeamSchema = z.object({
  competitionId: z.string(),
  id: z.string().optional(),
  name: z.string().optional(),
  members: z.string().optional()
});
export const PatchTeamQuerySchema = z.object({
  teamId: z.string()
});

export const SetStageQuerySchema = z.object({
  competitionId: z.string()
});

export const SetStageSchema = z.object({
  stage: z.number().nullable()
});

export const CompetitionIdSchema = z.object({
  competitionId: z.string()
});

export const SetLevelSchema = z.object({
  level: z.number().nullable()
});

export const SetWinnerSchema = z.object({
  winner: z.string().nullable()
});

export const SegmentIdSchema = z.object({
  segmentId: z.string()
});

export const PublishScoreSchema = z.object({
  scorePublished: z.boolean()
});

export const teamStateSchema = z.enum([
  'IDLE',
  'STOPPED',
  'STOPPED_ANSWERED',
  'ANSWERED',
  'ANSWERED_HANDLED',
  'STOPPED_HANDLED'
]);
export const PatchTeamSegmentStateSchema = z
  .object({
    competitionId: z.string(),
    id: z.string(),
    segmentId: z.string(),
    teamId: z.string(),
    state: teamStateSchema,
    stopLevel: z.number().nullable(),
    score: z.number().nullable()
  })
  .partial()
  .required({ competitionId: true });

export const PatchTeamSegmentQuerySchema = z.object({
  segmentTeamStateId: z.string()
});

export const PatchAnswerSchema = z.object({
  answer: z.string()
});

export const PatchAnswerQuerySchema = z.object({
  answerId: z.string()
});
