import { Competition as PrismaCompetition } from '@prisma/client';

export type Competition = Omit<PrismaCompetition, 'date'> & {
  date: string;
};
