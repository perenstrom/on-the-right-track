import { SegmentIcon } from 'components/SegmentIcon';
import { getFullSegmentName } from 'helpers/copy';
import { ArrowDown, ArrowUp, Minus, Plus, Trash2 } from 'lucide-react';
import { MouseEventHandler } from 'react';
import { UncreatedSegment } from 'types/types';
import { Button } from '../ui/button';
import { ButtonGroup, ButtonGroupText } from '../ui/button-group';
import { Item, ItemActions, ItemContent, ItemMedia } from '../ui/item';

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
    <Item variant="outline">
      <ItemMedia>
        <SegmentIcon type={segment.type} />
      </ItemMedia>
      <ItemContent className="text-md">
        {getFullSegmentName(segment)}
      </ItemContent>
      <ItemActions className="flex-wrap">
        {(segment.type === 'QUESTION' || segment.type === 'MUSIC') && (
          <>
            <ButtonGroup>
              <ButtonGroupText>
                {segment.numberOfOptions} delfrågor
              </ButtonGroupText>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  handleOptionsChange((segment.numberOfOptions ?? 0) - 1)
                }
                disabled={segment.numberOfOptions === 1}
              >
                <Minus />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  handleOptionsChange((segment.numberOfOptions ?? 0) + 1)
                }
              >
                <Plus />
              </Button>
            </ButtonGroup>
          </>
        )}
        <ButtonGroup>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={moveUp}
            disabled={segment.order === 1}
          >
            <ArrowUp />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={moveDown}
            disabled={segment.order === totalSegments}
          >
            <ArrowDown />
          </Button>
        </ButtonGroup>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={deleteSegment}
        >
          <Trash2 />
        </Button>
      </ItemActions>
    </Item>
  );
};
