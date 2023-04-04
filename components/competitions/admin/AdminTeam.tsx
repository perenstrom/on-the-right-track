import { Team } from '@prisma/client';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: hsl(0, 0%, 85%);
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1rem;
  min-width: 0;

  > h2,
  span {
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

export const AdminTeam: React.FC<{
  team: Team;
  score: number;
}> = ({ team, score }) => {
  return (
    <Wrapper>
      <h2>{team.name}</h2>
      <span>{team.members}</span>
      <Score>{score}</Score>
    </Wrapper>
  );
};
