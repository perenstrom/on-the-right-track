import { faFlagCheckered, faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Segment } from '@prisma/client';
import { SegmentIcon } from 'components/SegmentIcon';
import { getShortSegmentName } from 'helpers/copy';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  z-index: 1;
  background-color: hsl(0, 0%, 85%);
  flex: 0 0 3rem;
  border-bottom: 1px solid hsl(0, 0%, 0%);
  margin-left: -4px;

  display: flex;
  align-items: center;
`;

const SegmentPartWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  height: 100%;
  --arrow-size: 20px;
`;

const SegmentPartSeparator = styled.div`
  position: absolute;
  top: 0;
  right: -4px;
  bottom: 0;
  left: 0;

  background: black;

  clip-path: polygon(
    var(--arrow-size) 50%,
    0% 0%,
    calc(100% - var(--arrow-size)) 0%,
    100% 50%,
    calc(100% - var(--arrow-size)) 100%,
    0% 100%
  );
`;

const LastSegmentPartSeparator = styled(SegmentPartSeparator)`
  clip-path: polygon(var(--arrow-size) 50%, 0% 0%, 100% 0%, 100% 100%, 0% 100%);
  right: 0;
`;

const FirstSegmentPartSeparator = styled(SegmentPartSeparator)`
  clip-path: polygon(
    0% 0%,
    calc(100% - var(--arrow-size)) 0%,
    100% 50%,
    calc(100% - var(--arrow-size)) 100%,
    0% 100%
  );
`;

interface SegmentPartProps {
  readonly current: boolean;
  readonly scoresPublished: boolean;
}
const SegmentPart = styled.div<SegmentPartProps>`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  padding: 0 1.5rem 0 2.2rem;
  margin-left: calc((var(--arrow-size) - 3px) * -1);

  background: ${({ current, scoresPublished }) =>
    current
      ? 'hsl(216, 100%, 74%)'
      : scoresPublished
      ? 'hsl(87, 70%, 74%)'
      : 'hsl(0, 0%, 75%)'};
  font-size: 0.9rem;
  clip-path: polygon(
    var(--arrow-size) 50%,
    0% 0%,
    calc(100% - var(--arrow-size)) 0%,
    100% 50%,
    calc(100% - var(--arrow-size)) 100%,
    0% 100%
  );
`;

const LastSegmentPart = styled(SegmentPart)`
  padding: 0 1rem 0 1.8rem;
  clip-path: polygon(var(--arrow-size) 50%, 0% 0%, 100% 0%, 100% 100%, 0% 100%);
`;

const FirstSegmentPart = styled(SegmentPart)`
  padding: 0 0.7rem 0 1rem;
  clip-path: polygon(
    0% 0%,
    calc(100% - var(--arrow-size)) 0%,
    100% 50%,
    calc(100% - var(--arrow-size)) 100%,
    0% 100%
  );
`;

export const BreadCrumb: React.FC<{
  segments: Segment[];
  currentSegment: string;
  goToSegment: (stage: number | null) => void;
}> = ({ segments, currentSegment, goToSegment }) => {
  return (
    <Wrapper>
      <SegmentPartWrapper key={'start'}>
        <FirstSegmentPartSeparator />
        <FirstSegmentPart
          current={currentSegment === 'start'}
          scoresPublished={true}
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
          onClick={() => goToSegment(segments.length + 1)}
        >
          <FontAwesomeIcon
            icon={faFlagCheckered}
            style={{ minWidth: '1.5rem' }}
          />
        </LastSegmentPart>
      </SegmentPartWrapper>
    </Wrapper>
  );
};
