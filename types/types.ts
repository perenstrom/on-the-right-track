import {
  Competition as PrismaCompetition,
  Segment,
  Prisma,
  Team
} from '@prisma/client';

export type Competition = Omit<PrismaCompetition, 'date'> & {
  date: string;
};
export type CompetitionWithSegmentCount = Omit<PrismaCompetition, 'date'> & {
  date: string;
  segmentCount: number;
};
export type ScoreCompetition = Omit<
  Prisma.CompetitionGetPayload<{
    include: {
      teams: {
        include: {
          segmentTeamStates: true;
        };
      };
      segments: true;
    };
  }>,
  'date'
> & {
  date: string;
};
export type FullCompetition = Omit<
  Prisma.CompetitionGetPayload<{
    include: {
      teams: {
        include: {
          segmentTeamStates: {
            include: { answers: true };
          };
        };
      };
      segments: true;
    };
  }>,
  'date'
> & {
  date: string;
};

export type UncreatedCompetition = Omit<Competition, 'id'>;

export type UncreatedSegment = Omit<Segment, 'id' | 'competitionId'>;

export type FullTeam = Prisma.TeamGetPayload<{
  include: {
    segmentTeamStates: {
      include: { answers: true };
    };
  };
}>;
export type ScoreTeam = Prisma.TeamGetPayload<{
  include: {
    segmentTeamStates: true;
  };
}>;
export type UncreatedTeam = Omit<Team, 'id'>;
