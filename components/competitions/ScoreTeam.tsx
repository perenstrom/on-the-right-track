import { Segment, SegmentType, TeamState } from '@prisma/client';
import {
  getScoreTeamStateColor,
  getScoreTeamStateTextColor
} from 'helpers/styling';
import styled from 'styled-components';
import { ScoreTeam as ScoreTeamType } from 'types/types';

interface WrapperProps {
  readonly state: TeamState;
  readonly scoresPublished: boolean;
  readonly score: number | null;
  readonly segmentType: SegmentType;
}
const Wrapper = styled.div<WrapperProps>`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: ${({ state, scoresPublished }) =>
    getScoreTeamStateTextColor({ state, scoresPublished })};
  background: ${({ state, scoresPublished, score, segmentType }) => {
    const options = scoresPublished
      ? { scoresPublished, score, segmentType }
      : {
          scoresPublished,
          state
        };
    return getScoreTeamStateColor(options);
  }};
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

const RelativeFlex = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

export const ScoreTeam: React.FC<{
  team: ScoreTeamType;
  score: number;
  currentSegment: Segment | null;
}> = ({ team, score, currentSegment }) => {
  const currentSegmentTeamState = team.segmentTeamStates.find(
    (segmentTeamState) => segmentTeamState.segmentId === currentSegment?.id
  );

  const currentState: TeamState = currentSegmentTeamState
    ? currentSegmentTeamState.state
    : 'IDLE';

  return (
    <Wrapper
      state={currentState}
      score={currentSegmentTeamState?.score || null}
      scoresPublished={currentSegment?.scorePublished || false}
      segmentType={currentSegment?.type || 'QUESTION'}
    >
      <h2>{team.name}</h2>
      <RelativeFlex>
        <span>{team.members}</span>
        <Score>
          <>{score}</>
        </Score>
      </RelativeFlex>
    </Wrapper>
  );
};
