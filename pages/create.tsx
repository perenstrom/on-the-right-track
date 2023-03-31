import { NextPage } from 'next';
import { Wrapper } from 'components/Wrapper';
import styled from 'styled-components';
import { Button } from 'components/Button';
import { useState } from 'react';
import { Segment as PrismaSegment, SegmentType } from '@prisma/client';
import { Segment } from 'components/create/Segment';

const Label = styled.label`
  display: block;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  max-width: 25rem;
  margin-bottom: 1rem;
`;

const SegmentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 4rem;
`;

const CreatePage: NextPage<{}> = () => {
  const [name, setName] = useState('');
  const [hosts, setHosts] = useState('');
  const [date, setDate] = useState('');
  const [segments, setSegments] = useState<
    Omit<PrismaSegment, 'id' | 'competitionId'>[]
  >([]);

  const addSegment = (type: SegmentType) => {
    const orderOfType = segments.filter(
      (segment) => segment.type === type
    ).length;

    setSegments([
      ...segments,
      {
        type,
        order: segments.length + 1,
        scorePublished: false,
        numberOfOptions: null,
        orderOfType: orderOfType + 1
      }
    ]);
  };

  const moveSegment = (direction: 'up' | 'down', currentPosition: number) => {
    if (
      (direction === 'up' && currentPosition === 1) ||
      (direction === 'down' && currentPosition === segments.length)
    ) {
      return;
    }

    const segmentToMove = segments[currentPosition - 1];
    const segmentToSwitchWith =
      segments[currentPosition + (direction === 'up' ? -1 : 1) - 1];
    const sameType = segmentToMove.type === segmentToSwitchWith.type;

    const newSegments = segments
      .map((segment) => {
        if (segment.order === currentPosition) {
          return {
            ...segment,
            order:
              direction === 'up' ? currentPosition - 1 : currentPosition + 1,
            orderOfType: sameType
              ? segmentToMove.orderOfType + (direction === 'up' ? -1 : 1)
              : segmentToMove.orderOfType
          };
        }

        if (segment.order === currentPosition + (direction === 'up' ? -1 : 1)) {
          return {
            ...segment,
            order: currentPosition,
            orderOfType: sameType
              ? segmentToSwitchWith.orderOfType + (direction === 'up' ? 1 : -1)
              : segmentToSwitchWith.orderOfType
          };
        }

        return segment;
      })
      .sort((a, b) => a.order - b.order);

    setSegments(newSegments);
  };

  return (
    <Wrapper>
      <h1>Skapa tävling</h1>
      <form>
        <Label htmlFor="name">Namn</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Label htmlFor="hosts">Värdar</Label>
        <Input
          type="text"
          id="hosts"
          name="hosts"
          value={hosts}
          onChange={(event) => setHosts(event.target.value)}
        />
        <Label htmlFor="date">Datum</Label>
        <Input
          type="date"
          id="date"
          name="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <h2>Moment</h2>
        {segments.length > 0 ? (
          <SegmentWrapper>
            {segments.map((segment) => (
              <Segment
                key={`${segment.type}-${segment.orderOfType}`}
                segment={segment}
                totalSegments={segments.length}
                moveUp={() => moveSegment('up', segment.order)}
                moveDown={() => moveSegment('down', segment.order)}
              />
            ))}
          </SegmentWrapper>
        ) : (
          <p>
            <i>Inga moment har lagts till</i>
          </p>
        )}
        <ButtonWrapper>
          <Button type="button" onClick={() => addSegment('TRIP')}>
            + Resa
          </Button>
          <Button type="button" onClick={() => addSegment('QUESTION')}>
            + Fråga
          </Button>
          <Button type="button" onClick={() => addSegment('MUSIC')}>
            + Musikfråga
          </Button>
          <Button type="button" onClick={() => addSegment('SPECIAL')}>
            + Specialfråga
          </Button>
        </ButtonWrapper>
      </form>
    </Wrapper>
  );
};

export default CreatePage;
