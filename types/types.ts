import {
  Competition as PrismaCompetition,
  Segment,
  Prisma,
  Team
} from '@prisma/client';

export type Competition = Omit<PrismaCompetition, 'date'> & {
  date: string;
};
export type FullCompetition = Omit<
  Prisma.CompetitionGetPayload<{
    include: { teams: true };
  }>,
  'date'
> & {
  date: string;
};

export type UncreatedCompetition = Omit<Competition, 'id'>;

export type UncreatedSegment = Omit<Segment, 'id' | 'competitionId'>;

export type UncreatedTeam = Omit<Team, 'id'>;
