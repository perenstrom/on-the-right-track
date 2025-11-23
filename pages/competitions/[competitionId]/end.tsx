import { SegmentIcon } from 'components/SegmentIcon';
import { getShortSegmentName } from 'helpers/copy';
import { formatCompetitionEndTable } from 'helpers/formatData';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getCompetition } from 'services/prisma';
import { FullCompetition } from 'types/types';

interface Props {
  competition: FullCompetition;
}
const AdminPage: NextPage<Props> = ({ competition }) => {
  const competitionHasEnded = competition.winnerTeamId !== null;

  const table = formatCompetitionEndTable(competition);

  return competitionHasEnded ? (
    <div className="w-full p-4">
      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            <th>Lag</th>
            {competition.segments.map((segment) => (
              <th className="min-w-20 whitespace-nowrap" key={segment.id}>
                <SegmentIcon type={segment.type} />
                {getShortSegmentName(segment)}
              </th>
            ))}
            <th>Totalt</th>
          </tr>
        </thead>
        {table.map((row) => (
          <tr key={row.team.id}>
            <td>{row.team.name}</td>
            {row.segmentResults.map((segmentResult) => (
              <td key={segmentResult.segmentId}>{segmentResult.score}</td>
            ))}
            <td>{row.totalScore}</td>
          </tr>
        ))}
      </table>
    </div>
  ) : (
    <p>Spelet pågår ännu</p>
  );
};

interface Params extends ParsedUrlQuery {
  competitionId: string;
}
export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  if (!context?.params?.competitionId) {
    throw new Error('No competition ID in params');
  }

  const competition = await getCompetition(
    prismaContext,
    context?.params?.competitionId
  );

  return {
    props: {
      competition
    }
  };
};

export default AdminPage;
