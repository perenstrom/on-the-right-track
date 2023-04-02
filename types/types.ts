import { Competition as PrismaCompetition, Segment } from '@prisma/client';

export type Competition = Omit<PrismaCompetition, 'date'> & {
  date: string;
};
export type UncreatedCompetition = Omit<Competition, 'id'>;

export type UncreatedSegment = Omit<Segment, 'id' | 'competitionId'>;
