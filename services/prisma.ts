import { SegmentTeamState, Team } from '@prisma/client';
import { generateRandomId } from 'helpers/utils';
import { Context } from 'lib/prisma';
import {
  Competition,
  FullCompetition,
  UncreatedCompetition,
  UncreatedSegment,
  UncreatedTeam
} from 'types/types';

export const getCompetitions = async (ctx: Context): Promise<Competition[]> => {
  const result = await ctx.prisma.competition.findMany({
    orderBy: [
      {
        date: 'desc'
      }
    ]
  });

  return result.map((competition) => ({
    ...competition,
    date: competition.date.toISOString()
  }));
};

export const getCompetition = async (
  ctx: Context,
  id: string
): Promise<FullCompetition> => {
  const result = await ctx.prisma.competition.findUnique({
    where: {
      id
    },
    include: {
      segments: true,
      teams: {
        include: {
          segmentTeamStates: true
        }
      }
    }
  });

  if (!result) {
    throw new Error('Competition not found');
  }

  return {
    ...result,
    date: result.date.toISOString()
  };
};

export const getBaseCompetition = async (
  ctx: Context,
  id: string
): Promise<Competition> => {
  const result = await ctx.prisma.competition.findUnique({
    where: {
      id
    }
  });

  if (!result) {
    throw new Error('Competition not found');
  }

  return {
    ...result,
    date: result.date.toISOString()
  };
};

export const setCurrentStage = async (
  ctx: Context,
  competitionId: string,
  stage: number | null
) => {
  const result = await ctx.prisma.competition.update({
    where: {
      id: competitionId
    },
    data: {
      currentStage: stage,
      currentLevel: null
    }
  });

  return result;
};

export const setCurrentLevel = async (
  ctx: Context,
  competitionId: string,
  level: number | null
) => {
  const result = await ctx.prisma.competition.update({
    where: {
      id: competitionId
    },
    data: {
      currentLevel: level
    }
  });

  return result;
};

export const createCompetition = async (
  ctx: Context,
  competition: UncreatedCompetition,
  segments: UncreatedSegment[]
) => {
  const id = generateRandomId();

  const result = await ctx.prisma.competition.create({
    data: {
      id,
      ...competition,
      date: new Date(competition.date),
      segments: {
        create: segments
      }
    }
  });

  return result;
};

export const getTeam = async (ctx: Context, id: string) => {
  const result = await ctx.prisma.team.findUnique({
    where: {
      id
    }
  });

  if (!result) {
    throw new Error('Team not found');
  }

  return result;
};

export const updateTeam = async (
  ctx: Context,
  teamId: string,
  team: Partial<Team>
) => {
  const result = await ctx.prisma.team.update({
    where: {
      id: teamId
    },
    data: team
  });

  return result;
};

export const createTeam = async (ctx: Context, team: UncreatedTeam) => {
  const result = await ctx.prisma.team.create({
    data: team
  });

  return result;
};

export const getSegment = async (
  ctx: Context,
  competitionId: string,
  stage: number
) => {
  const result = await ctx.prisma.segment.findUnique({
    where: {
      competitionId_order: {
        competitionId,
        order: stage
      }
    }
  });

  if (!result) {
    throw new Error('Segment not found');
  }

  return result;
};

export const upsertSegmentTeamState = async (
  ctx: Context,
  { segmentId, teamId }: { segmentId: string; teamId: string },
  data: Partial<SegmentTeamState>
) => {
  const result = await ctx.prisma.segmentTeamState.upsert({
    where: {
      segmentId_teamId: {
        segmentId,
        teamId
      }
    },
    update: data,
    create: {
      segmentId,
      teamId,
      ...data
    }
  });

  return result;
};
