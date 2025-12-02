import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { setCompetitionWinner } from 'services/prisma';
import { CompetitionIdSchema, SetWinnerSchema } from 'schemas/zod/schema';
import { publishNewWinner } from 'services/ably/client';

const setWinner = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const parsedBody = SetWinnerSchema.safeParse(req.body);
    const parsedQuery = CompetitionIdSchema.safeParse(req.query);

    if (!parsedBody.success || !parsedQuery.success) {
      console.log(parsedBody);
      console.log(parsedQuery);
      res.status(400).end('Action data malformed');
      return;
    } else {
      const { winner } = parsedBody.data;
      const { competitionId } = parsedQuery.data;

      try {
        const competition = await setCompetitionWinner(
          prismaContext,
          competitionId,
          winner
        );

        await publishNewWinner(competitionId, winner);
        res.status(200).json(competition);
        return;
      } catch (error) {
        console.log(error);
        res.status(500).end('Unexpected internal server error');
        return;
      }
    }
  } else {
    res.status(404).end();
  }
};

export default setWinner;
