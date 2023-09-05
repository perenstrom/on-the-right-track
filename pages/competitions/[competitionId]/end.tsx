import { SegmentIcon } from 'components/SegmentIcon';
import { getShortSegmentName } from 'helpers/copy';
import { formatCompetitionEndTable } from 'helpers/formatData';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getCompetition } from 'services/prisma';
import styled from 'styled-components';
import { FullCompetition } from 'types/types';

const Wrapper = styled.div`
  width: 100%;
  padding: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
`;

const HeaderCell = styled.th`
  white-space: nowrap;
  min-width: 5rem;
`;

interface Props {
  competition: FullCompetition;
}
const AdminPage: NextPage<Props> = ({ competition }) => {
  const competitionHasEnded = competition.winnerTeamId !== null;

  const table = formatCompetitionEndTable(competition);

  return competitionHasEnded ? (
    <Wrapper>
      <Table>
        <thead>
          <tr>
            <th>Lag</th>
            {competition.segments.map((segment) => (
              <HeaderCell key={segment.id}>
                <SegmentIcon type={segment.type} />
                {getShortSegmentName(segment)}
              </HeaderCell>
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
      </Table>
    </Wrapper>
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
