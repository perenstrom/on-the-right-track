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
