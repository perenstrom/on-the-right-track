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

export const createTeam = async (ctx: Context, team: UncreatedTeam) => {
  const result = await ctx.prisma.team.create({
    data: team
  });

  return result;
};
