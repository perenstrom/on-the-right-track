import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-top: 1px solid hsl(0, 0%, 0%);
  align-items: center;

  h3 {
    font-size: 1.5rem;
    margin: 0;
    padding-top: 0.5rem;
  }

  span {
    font-size: 4rem;
    font-weight: 500;
    line-height: 1;
    margin-bottom: 0.5rem;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  button {
    font-size: 1.5rem;
    flex: 1;
    border: 1px solid hsl(0, 0%, 0%);
    background: transparent;
  }

  button:hover {
    background-color: #bfbfbf;
  }
`;

export const StageController: React.FC<{
  next: () => void;
  previous: () => void;
  currentStage: string;
  previousStage?: string;
  nextStage?: string;
}> = ({ next, previous, currentStage, previousStage, nextStage }) => {
  return (
    <Wrapper>
      <h3>Moment</h3>
      <span>{currentStage}</span>
      <ButtonWrapper>
        <button type="button" onClick={() => previous()}>
          &lt; {previousStage}
        </button>
        <button type="button" onClick={() => next()}>
          {nextStage} &gt;
        </button>
      </ButtonWrapper>
    </Wrapper>
  );
};
