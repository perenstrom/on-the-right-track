import { Segment } from '@prisma/client';
import { getFullSegmentName } from 'helpers/copy';
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

interface SegmentPartProps {
  readonly current: boolean;
  readonly scoresPublished: boolean;
}
const SegmentPart = styled.div<SegmentPartProps>`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;

  padding: 0 2rem 0 2.3rem;
  margin-left: calc((var(--arrow-size) - 3px) * -1);

  background: ${({ current, scoresPublished }) =>
    current
      ? 'hsl(216, 100%, 74%)'
      : scoresPublished
      ? 'hsl(87, 70%, 74%)'
      : 'hsl(0, 0%, 75%)'};
  font-size: 1.1rem;
  clip-path: polygon(
    var(--arrow-size) 50%,
    0% 0%,
    calc(100% - var(--arrow-size)) 0%,
    100% 50%,
    calc(100% - var(--arrow-size)) 100%,
    0% 100%
  );

  &:first-child {
    clip-path: polygon(
      0% 0%,
      calc(100% - var(--arrow-size)) 0%,
      100% 50%,
      calc(100% - var(--arrow-size)) 100%,
      0% 100%
    );
  }
`;

export const BreadCrumb: React.FC<{
  segments: Segment[];
  currentSegment: string;
}> = ({ segments, currentSegment }) => {
  return (
    <Wrapper>
      {segments.map((segment) => (
        <SegmentPartWrapper key={segment.id}>
          <SegmentPartSeparator />
          <SegmentPart
            current={currentSegment === segment.id}
            scoresPublished={segment.scorePublished}
          >
            {getFullSegmentName(segment)}
          </SegmentPart>
        </SegmentPartWrapper>
      ))}
    </Wrapper>
  );
};
