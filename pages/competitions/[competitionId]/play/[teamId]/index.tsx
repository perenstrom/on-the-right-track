import { Segment, SegmentTeamState, Team } from '@prisma/client';
import { Button } from 'components/Button';
import { Input, Label, TextArea } from 'components/FormControls';
import { getFullSegmentName } from 'helpers/copy';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import {
  getBaseCompetition,
  getSegment,
  getTeam,
  upsertSegmentTeamState
} from 'services/prisma';
import styled from 'styled-components';
import { Competition } from 'types/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SegmentHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  width: 100%;

  font-size: 2rem;
  font-weight: bold;
  height: 4rem;
  background-color: hsl(0, 0%, 90%);
`;

const BreakImage = styled.img`
  margin-top: -13rem;
`;

const TripHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  font-size: 5rem;
  line-height: 1;
  font-weight: bold;
  color: hsl(0, 0%, 100%);
  height: 7rem;
  background-color: hsl(18, 95%, 40%);
`;

const TripLevel = styled.div`
  flex: 1;

  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 13rem;
  font-weight: bold;
  line-height: 1;
`;

const WaitingForSegment = styled.div`
  margin: 10rem auto 0;
  font-size: 1.6rem;
`;

const AnswerWrapper = styled.div`
  width: 100%;
  padding: 1rem;
`;

const AnswerLabel = styled(Label)`
  font-size: 2rem;
`;

const AnswerInput = styled(TextArea)`
  font-size: 1.5rem;
  line-height: 1.2;
`;

const SubmitButton = styled(Button)`
  background-color: hsl(116, 46%, 55%);
  border: 1px solid hsl(116, 46%, 30%);
  width: 100%;
  font-size: 1.5rem;
`;

interface Props {
  competition: Competition;
  team: Team;
  segment: Segment | null;
  teamState: SegmentTeamState | null;
}

const CompetitionPlayPage: NextPage<Props> = ({
  competition,
  team,
  segment,
  teamState
}) => {
  return (
    <Wrapper>
      <SegmentHeading>
        {segment ? getFullSegmentName(segment) : '. . .'}
      </SegmentHeading>
      {!segment && <WaitingForSegment>Invänta nästa moment</WaitingForSegment>}
      {segment?.type === 'TRIP' && teamState?.state === 'IDLE' && (
        <>
          <BreakImage src="/break.svg" alt="Break" width="80%" />
          <TripLevel>{competition.currentLevel}</TripLevel>
        </>
      )}
      {segment?.type === 'TRIP' && teamState?.state === 'STOPPED' && (
        <>
          <TripHeading>{competition.currentLevel}</TripHeading>
          <AnswerWrapper>
            <AnswerLabel htmlFor="answer">Svar:</AnswerLabel>
            <AnswerInput id="answer" rows={7} />
            <SubmitButton type="button">Svara</SubmitButton>
          </AnswerWrapper>
        </>
      )}
      {/*       <pre>{JSON.stringify(competition, null, 2)}</pre>
      <pre>{JSON.stringify(team, null, 2)}</pre>
      <pre>{JSON.stringify(segment, null, 2)}</pre>
      <pre>{JSON.stringify(teamState, null, 2)}</pre> */}
    </Wrapper>
  );
};

interface Params extends ParsedUrlQuery {
  competitionId: string;
  teamId: string;
}
export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  if (!context?.params?.competitionId || !context?.params?.teamId) {
    throw new Error('No competition ID or team ID in params');
  }

  const [competition, team] = await Promise.all([
    getBaseCompetition(prismaContext, context?.params?.competitionId),
    getTeam(prismaContext, context?.params?.teamId)
  ]);

  const segment = competition.currentStage
    ? await getSegment(prismaContext, competition.id, competition.currentStage)
    : null;

  const teamState = segment
    ? await upsertSegmentTeamState(
        prismaContext,
        {
          segmentId: segment.id,
          teamId: team.id
        },
        {}
      )
    : null;

  return {
    props: {
      competition,
      team,
      segment,
      teamState
    }
  };
};

export default CompetitionPlayPage;
