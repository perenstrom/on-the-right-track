import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Segment as SegmentType } from '@prisma/client';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 22rem;
  height: 3rem;
  border: 1px solid black;
  border-radius: 4px;
  background-color: #d9d9d9;
  font-weight: 500;

  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    padding: 0.5rem;
    display: block;
  }
`;

const OrderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 0;
  height: 100%;

  border-left: 1px solid black;

  button {
    border: 0;
    background-color: transparent;
    flex-grow: 1;
  }

  button:first-child {
    border-bottom: 1px solid black;
    border-top-right-radius: 3px;
  }

  button:last-child {
    border-bottom-right-radius: 3px;
  }

  button:hover {
    background-color: #bfbfbf;
  }

  button:disabled {
    color: #999999;
  }

  button:disabled:hover {
    background-color: transparent;
  }
`;

export const Segment: React.FC<{
  segment: Omit<SegmentType, 'id' | 'competitionId'>;
  totalSegments: number;
}> = ({ segment, totalSegments }) => {
  return (
    <Wrapper>
      <span>
        {segment.type} {segment.orderOfType}
      </span>
      <OrderWrapper>
        <button type="button" disabled={segment.order === 1}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button type="button" disabled={segment.order === totalSegments}>
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </OrderWrapper>
    </Wrapper>
  );
};
