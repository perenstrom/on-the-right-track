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

  span {
    padding: 0.5rem;
    display: block;
    flex-grow: 1;
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
}> = ({ segment, totalSegments, moveUp, moveDown, deleteSegment }) => (
  <Wrapper>
    <span>
      <SegmentIcon type={segment.type} />
      {getFullSegmentName(segment)}
    </span>
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
