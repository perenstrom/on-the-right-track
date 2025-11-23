import {
  faArrowDown,
  faArrowUp,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SegmentIcon } from 'components/SegmentIcon';
import { getFullSegmentName } from 'helpers/copy';
import { MouseEventHandler } from 'react';
import { UncreatedSegment } from 'types/types';

const OptionsButtonClassNames = 'h-full border-none bg-transparent flex-1';

const OrderButtonClassNames =
  'border-none bg-transparent grow px-[0.4rem] first:border-b first:border-black disabled:text-[#999999] disabled:hover:bg-transparent hover:bg-[#bfbfbf]';

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
    <div className="flex h-12 w-88 content-start items-center rounded-sm border border-black bg-[#d9d9d9] font-medium">
      <span className="block grow p-2">
        <SegmentIcon type={segment.type} />
        {getFullSegmentName(segment)}
      </span>
      {(segment.type === 'QUESTION' || segment.type === 'MUSIC') && (
        <div className="flex h-full flex-col border-l border-black px-2 py-0">
          <div className="flex flex-[0_0_50%] content-center items-center leading-0">
            Delsvar
          </div>
          <div className="flex flex-[0_0_50%] content-between items-center leading-0">
            <button
              className={OptionsButtonClassNames}
              type="button"
              onClick={() =>
                handleOptionsChange((segment.numberOfOptions ?? 0) - 1)
              }
            >
              -
            </button>
            <div className="flex h-full flex-1 content-center items-center">
              {segment.numberOfOptions}
            </div>
            <button
              className={OptionsButtonClassNames}
              type="button"
              onClick={() =>
                handleOptionsChange((segment.numberOfOptions ?? 0) + 1)
              }
            >
              +
            </button>
          </div>
        </div>
      )}
      <div className="flex h-full flex-col content-center border-l border-l-black leading-0">
        <button
          className={OrderButtonClassNames}
          type="button"
          disabled={segment.order === 1}
          onClick={moveUp}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <button
          className={OrderButtonClassNames}
          type="button"
          disabled={segment.order === totalSegments}
          onClick={moveDown}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
      <button
        className="h-full rounded-r-[3px] border-l border-none border-l-black bg-transparent px-[0.4rem] hover:bg-[#bfbfbf]"
        type="button"
        onClick={deleteSegment}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  );
};
