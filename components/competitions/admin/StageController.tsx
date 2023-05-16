import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-top: 2px solid hsl(0, 0%, 0%);
  border-bottom: 2px solid hsl(0, 0%, 0%);
  background: white;
  margin-bottom: 1rem;
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
    border: none;
    border-top: 1px solid hsl(0, 0%, 0%);
    background: transparent;
  }

  button:last-child {
    border-left: 1px solid hsl(0, 0%, 0%);
  }

  button:hover {
    background-color: #bfbfbf;
  }

  button:disabled:hover {
    background-color: transparent;
  }
`;

export const StageController: React.FC<{
  next: () => void;
  previous: () => void;
  currentStage: string;
  previousStage?: string;
  nextStage?: string;
  heading: string;
  connectionState: 'connected' | 'connecting' | 'disconnected';
}> = ({
  next,
  previous,
  currentStage,
  previousStage,
  nextStage,
  heading,
  connectionState
}) => {
  const prevContent =
    previousStage === 'start' ? (
      <FontAwesomeIcon icon={faPause} />
    ) : !previousStage ? (
      '< '
    ) : (
      `< ${previousStage}`
    );

  const nextContent =
    nextStage === 'end' ? (
      <FontAwesomeIcon icon={faPause} />
    ) : !nextStage ? (
      '> '
    ) : (
      `${nextStage} >`
    );

  return (
    <Wrapper>
      <h3>{heading}</h3>
      <span>{currentStage}</span>
      <ButtonWrapper>
        <button
          type="button"
          onClick={() => previous()}
          disabled={!previousStage || connectionState !== 'connected'}
        >
          {prevContent}
        </button>
        <button
          type="button"
          onClick={() => next()}
          disabled={!nextStage || connectionState !== 'connected'}
        >
          {nextContent}
        </button>
      </ButtonWrapper>
    </Wrapper>
  );
};
