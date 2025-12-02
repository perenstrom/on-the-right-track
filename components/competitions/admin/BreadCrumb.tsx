import { faFlagCheckered, faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Segment } from '@prisma/client';
import { SegmentIcon } from 'components/SegmentIcon';
import { getShortSegmentName } from 'helpers/copy';
import { cn } from 'helpers/tailwindUtils';

const SegmentPartWrapper = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="relative h-full grow [--arrow-size:20px]" {...props} />
);

const SegmentPartSeparator = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className="clip-path-arrow-separator absolute top-0 -right-1 bottom-0 left-0 bg-black"
    {...props}
  />
);

const LastSegmentPartSeparator = (
  props: React.HTMLAttributes<HTMLDivElement>
) => (
  <div
    className="clip-path-arrow-separator-last absolute top-0 right-0 bottom-0 left-0 bg-black"
    {...props}
  />
);

const FirstSegmentPartSeparator = (
  props: React.HTMLAttributes<HTMLDivElement>
) => (
  <div
    className="clip-path-arrow-separator-first absolute top-0 -right-1 bottom-0 left-0 bg-black"
    {...props}
  />
);

const segmentPartClassNames =
  'relative h-full flex items-center justify-center py-0 pr-6 pl-[2.2rem] text-[0.9rem] clip-path-arrow-part ml-[calc((var(--arrow-size)_-_3px)_*_-1)]';
const segmentBackgroundClassNames = (
  current: boolean,
  scoresPublished: boolean
) => {
  if (current) return 'bg-[hsl(216,100%,74%)]';
  if (scoresPublished) return 'bg-[hsl(87,70%,74%)]';
  return 'bg-[hsl(0,0%,75%)]';
};

const SegmentPart = ({
  className,
  gameIsOver,
  current,
  scoresPublished,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  gameIsOver: boolean;
  current: boolean;
  scoresPublished: boolean;
}) => (
  <div
    className={cn(
      segmentPartClassNames,
      'cursor-pointer',
      segmentBackgroundClassNames(current, scoresPublished),
      className
    )}
    {...props}
  />
);

const LastSegmentPart = ({
  className,
  current,
  scoresPublished,
  gameIsOver,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  current: boolean;
  scoresPublished: boolean;
  gameIsOver: boolean;
}) => (
  <div
    className={cn(
      segmentPartClassNames,
      segmentBackgroundClassNames(current, scoresPublished),
      'clip-path-arrow-part-last py-0 pr-4 pl-[1.8rem]',
      className
    )}
    {...props}
  />
);

const FirstSegmentPart = ({
  className,
  current,
  scoresPublished,
  gameIsOver,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  current: boolean;
  scoresPublished: boolean;
  gameIsOver: boolean;
}) => (
  <div
    className={cn(
      segmentPartClassNames,
      segmentBackgroundClassNames(current, scoresPublished),
      'clip-path-arrow-part-first py-0 pr-[0.7rem] pl-4',
      className
    )}
    {...props}
  />
);

export const BreadCrumb: React.FC<{
  segments: Segment[];
  currentSegment: string;
  gameIsOver: boolean;
  goToSegment: (stage: number | null) => void;
}> = ({ segments, currentSegment, gameIsOver, goToSegment }) => {
  return (
    <div className="relative z-1 -ml-1 flex shrink-0 grow-0 basis-12 border-b border-[hsl(0,0%,0%)] bg-[hsl(0,0%,85%)]">
      <SegmentPartWrapper key={'start'}>
        <FirstSegmentPartSeparator />
        <FirstSegmentPart
          current={currentSegment === 'start'}
          scoresPublished={true}
          gameIsOver={gameIsOver}
          onClick={() => goToSegment(null)}
        >
          <FontAwesomeIcon icon={faPause} style={{ minWidth: '1.5rem' }} />
        </FirstSegmentPart>
      </SegmentPartWrapper>
      {segments.map((segment, stageIndex) => (
        <SegmentPartWrapper key={segment.id}>
          <SegmentPartSeparator />
          <SegmentPart
            current={currentSegment === segment.id}
            scoresPublished={segment.scorePublished}
            gameIsOver={gameIsOver}
            onClick={() => goToSegment(stageIndex + 1)}
          >
            <SegmentIcon type={segment.type} />
            {getShortSegmentName(segment)}
          </SegmentPart>
        </SegmentPartWrapper>
      ))}
      <SegmentPartWrapper key={'end'}>
        <LastSegmentPartSeparator />
        <LastSegmentPart
          current={currentSegment === 'end'}
          scoresPublished={false}
          gameIsOver={gameIsOver}
          onClick={() => goToSegment(segments.length + 1)}
        >
          <FontAwesomeIcon
            icon={faFlagCheckered}
            style={{ minWidth: '1.5rem' }}
          />
        </LastSegmentPart>
      </SegmentPartWrapper>
    </div>
  );
};
