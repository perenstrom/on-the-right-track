import { generateRandomId } from 'helpers/utils';
import { Context } from 'lib/prisma';
import {
  Competition,
  UncreatedCompetition,
  UncreatedSegment
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
