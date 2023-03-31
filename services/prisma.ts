import { Context } from 'lib/prisma';
import { Competition } from 'types/types';

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
