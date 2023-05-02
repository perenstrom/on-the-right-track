import { Segment, TeamState } from '@prisma/client';
import { getTeamStateColor, getTeamStateTextColor } from 'helpers/styling';
import styled from 'styled-components';
import { FullTeam } from 'types/types';
import { ScoreButton } from './ScoreButton';
import { patchTeamSegmentState } from 'services/local';
import { useRouter } from 'next/router';

interface WrapperProps {
  readonly state: TeamState;
}
const Wrapper = styled.div<WrapperProps>`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: ${({ state }) => getTeamStateTextColor(state)};
  background: ${({ state }) => getTeamStateColor(state)};
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1rem 1rem;
  min-width: 0;

  > h2,
  > div > span {
    line-height: normal;
    display: block;
    margin: 0;
    text-align: center;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > h2 {
    font-size: 1.5rem;
  }
`;

const Score = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 6rem;
  line-height: 0;
  font-weight: 500;
`;

const ScoreChange = styled.span`
  font-size: 3rem;
  color: hsl(116, 46%, 40%);
  font-weight: 500;
  margin-left: 1rem;
`;

const RelativeFlex = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const StopLevelWrapper = styled.div`
  position: absolute;
  bottom: -4.5rem;
  right: -4.5rem;
  width: 10rem;
  height: 10rem;
  border: 2px solid hsl(0, 0%, 15%);
  border-radius: 50%;
  background-color: hsl(0, 0%, 100%);

  display: flex;
  align-items: center;
  justify-content: center;
`;

const StopLevel = styled.div`
  position: absolute;
  bottom: 0rem;
  right: 0rem;
  width: 5rem;
  text-align: center;
  color: hsl(18, 95%, 40%);
  font-size: 3rem;
  font-weight: 500;
  line-height: 1;
  padding: 0.5rem;
`;

const StoppedAnsweredWrapper = styled.div`
  background-color: hsla(0, 0%, 100%, 0.8);
  color: hsl(0, 0%, 15%);
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  padding: 0 0.5rem 0.5rem;
  display: flex;
  flex-direction: column;
`;

const AnswerHeading = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
`;

const AnswersList = styled.ol`
  padding-left: 0;
  list-style: decimal inside;
  flex: 1;
`;

const AnswerItem = styled.li`
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
`;

const HandleAnswerButtons = styled.div`
  width: 100%;
  display: flex;
  gap: 0.5rem;
`;

export const AdminTeam: React.FC<{
  team: FullTeam;
  score: number;
  currentSegment: Segment | null;
}> = ({ team, score, currentSegment }) => {
  const currentSegmentTeamState = team.segmentTeamStates.find(
    (segmentTeamState) => segmentTeamState.segmentId === currentSegment?.id
  );

  const currentState: TeamState = currentSegmentTeamState
    ? currentSegmentTeamState.state
    : 'IDLE';

  const router = useRouter();
  const handleScoring = async (score: number) => {
    if (!currentSegmentTeamState || !currentSegment) return;

    const newState: TeamState =
      currentSegment.type === 'TRIP' ? 'STOPPED_HANDLED' : 'ANSWERED_HANDLED';
    await patchTeamSegmentState(
      currentSegment.competitionId,
      currentSegmentTeamState.id,
      {
        score,
        state: newState
      }
    );

    router.replace(router.asPath);
  };

  return (
    <Wrapper state={currentState}>
      <h2>{team.name}</h2>
      <RelativeFlex>
        <span>{team.members}</span>
        <Score>
          <>{score}</>
          {!currentSegment?.scorePublished &&
            (currentState === 'STOPPED_HANDLED' ||
              currentState === 'ANSWERED_HANDLED') && (
              <ScoreChange>+{currentSegmentTeamState?.score}</ScoreChange>
            )}
        </Score>
        {currentState === 'STOPPED' && (
          <>
            <StopLevelWrapper></StopLevelWrapper>
            <StopLevel>{currentSegmentTeamState?.stopLevel}</StopLevel>
          </>
        )}
        {(currentState === 'STOPPED_ANSWERED' ||
          currentState === 'ANSWERED') && (
          <StoppedAnsweredWrapper>
            <AnswerHeading>Svar:</AnswerHeading>
            {currentSegment?.type === 'SPECIAL' &&
              'Specialfråga. Laget har svarat på annat sätt.'}
            <AnswersList>
              {currentSegmentTeamState?.answers.map((answer) => (
                <AnswerItem key={answer.id}>{answer.answer || ''}</AnswerItem>
              ))}
            </AnswersList>
            <HandleAnswerButtons>
              {currentSegment?.type === 'TRIP' && (
                <>
                  <ScoreButton variant="wrong" onClick={() => handleScoring(0)}>
                    Fel 0p
                  </ScoreButton>
                  <ScoreButton
                    variant="correct"
                    onClick={() =>
                      handleScoring(currentSegmentTeamState?.stopLevel || 0)
                    }
                  >
                    {`Rätt ${currentSegmentTeamState?.stopLevel}p`}
                  </ScoreButton>
                </>
              )}
              {(currentSegment?.type === 'MUSIC' ||
                currentSegment?.type === 'QUESTION' ||
                currentSegment?.type === 'SPECIAL') && (
                <>
                  <ScoreButton variant="wrong" onClick={() => handleScoring(0)}>
                    0p
                  </ScoreButton>
                  <ScoreButton
                    variant="correct"
                    onClick={() => handleScoring(1)}
                  >
                    1p
                  </ScoreButton>
                  <ScoreButton
                    variant="correct"
                    onClick={() => handleScoring(2)}
                  >
                    2p
                  </ScoreButton>
                  <ScoreButton
                    variant="correct"
                    onClick={() => handleScoring(3)}
                  >
                    3p
                  </ScoreButton>
                </>
              )}
            </HandleAnswerButtons>
          </StoppedAnsweredWrapper>
        )}
      </RelativeFlex>
    </Wrapper>
  );
};
