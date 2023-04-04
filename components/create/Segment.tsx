import {
  faArrowDown,
  faArrowUp,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SegmentIcon } from 'components/SegmentIcon';
import { getFullSegmentName } from 'helpers/copy';
import { MouseEventHandler } from 'react';
import styled from 'styled-components';
import { UncreatedSegment } from 'types/types';

const Wrapper = styled.div`
  width: 22rem;
  height: 3rem;
  border: 1px solid black;
  border-radius: 4px;
  background-color: #d9d9d9;
  font-weight: 500;

  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const QuestionName = styled.span`
  padding: 0.5rem;
  display: block;
  flex-grow: 1;
`;

const OptionsWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;
  border-left: 1px solid black;
`;

const OptionsHeading = styled.div`
  line-height: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  flex: 0 0 50%;
`;

const OptionsControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 0;

  flex: 0 0 50%;

  button {
    height: 100%;
    border: 0;
    background-color: transparent;

    flex: 1;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex: 1;
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
    padding-left: 0.4rem;
    padding-right: 0.4rem;
  }

  button:first-child {
    border-bottom: 1px solid black;
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

const DeleteButton = styled.button`
  border: 0;
  background-color: transparent;
  height: 100%;
  padding-left: 0.4rem;
  padding-right: 0.4rem;

  border-left: 1px solid black;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;

  &:hover {
    background-color: #bfbfbf;
  }
`;

export const Segment: React.FC<{
  segment: UncreatedSegment;
  totalSegments: number;
  moveUp: MouseEventHandler;
  moveDown: MouseEventHandler;
  deleteSegment: MouseEventHandler;
  changeOptionsCount: (position: number, count: number) => void;
}> = ({
  segment,
  totalSegments,
  moveUp,
  moveDown,
  deleteSegment,
  changeOptionsCount
}) => {
  const handleOptionsChange = (number: number) => {
    changeOptionsCount(segment.order, number < 1 ? 1 : number);
  };

  return (
    <Wrapper>
      <QuestionName>
        <SegmentIcon type={segment.type} />
        {getFullSegmentName(segment)}
      </QuestionName>
      {segment.type === 'QUESTION' && (
        <OptionsWrapper>
          <OptionsHeading>Alternativ</OptionsHeading>
          <OptionsControls>
            <button
              type="button"
              onClick={() =>
                handleOptionsChange((segment.numberOfOptions ?? 0) - 1)
              }
            >
              -
            </button>
            <div>{segment.numberOfOptions}</div>
            <button
              type="button"
              onClick={() =>
                handleOptionsChange((segment.numberOfOptions ?? 0) + 1)
              }
            >
              +
            </button>
          </OptionsControls>
        </OptionsWrapper>
      )}
      <OrderWrapper>
        <button type="button" disabled={segment.order === 1} onClick={moveUp}>
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button
          type="button"
          disabled={segment.order === totalSegments}
          onClick={moveDown}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </OrderWrapper>
      <DeleteButton type="button" onClick={deleteSegment}>
        <FontAwesomeIcon icon={faTrashCan} />
      </DeleteButton>
    </Wrapper>
  );
};
