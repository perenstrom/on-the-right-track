import { NextApiRequest, NextApiResponse } from 'next';
import { prismaContext } from 'lib/prisma';
import { createCompetition } from 'services/prisma';
import { CreateCompetitionSchema } from 'schemas/zod/schema';

const competitions = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    return new Promise((resolve) => {
      const parsedCompetition = CreateCompetitionSchema.safeParse(req.body);

      if (!parsedCompetition.success) {
        console.log(JSON.stringify(parsedCompetition.error, null, 2));
        res.status(400).end('Game data malformed');
        resolve('');
      } else {
        const { date, hosts, name } = parsedCompetition.data.competition;

        createCompetition(
          prismaContext,
          {
            date,
            hosts,
            name,
            currentLevel: null,
            currentStage: null,
            winnerTeamId: null
          },
          parsedCompetition.data.segments
        )
          .then((competition) => {
            res.status(200).json(competition);
            resolve('');
          })
          .catch((error) => {
            console.log(error);
            res.status(500).end('Unexpected internal server error');
            resolve('');
          });
      }
    });
  } else {
    res.status(404).end();
  }
};

export default competitions;
