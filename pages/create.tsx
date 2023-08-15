import { NextPage } from 'next';
import { Wrapper } from 'components/Wrapper';
import styled from 'styled-components';
import { Button } from 'components/Button';
import { FormEventHandler, useState } from 'react';
import { SegmentType } from '@prisma/client';
import { Segment } from 'components/create/Segment';
import { UncreatedSegment } from 'types/types';
import { createCompetition } from 'services/local';
import { useRouter } from 'next/router';
import { Label, Input } from 'components/FormControls';

const SegmentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SubmitButton = styled(Button)`
  margin-bottom: 4rem;
  background-color: hsl(116, 46%, 55%);
  border: 1px solid hsl(116, 46%, 30%);

  &:hover {
    background-color: hsl(116, 46%, 50%);
  }
`;

const Divider = styled.hr`
  margin-bottom: 1rem;
  border: none;
  border-bottom: 1px solid #999999;
`;

const calculateSegmentNumbers = (
  segments: UncreatedSegment[]
): UncreatedSegment[] => {
  const orderOfType: Record<SegmentType, number> = {
    TRIP: 0,
    QUESTION: 0,
    MUSIC: 0,
    SPECIAL: 0
  };
  let nearestTrip = 0;

  return segments.map((segment) => {
    if (segment.type === 'TRIP') {
      nearestTrip += 1;
      orderOfType.TRIP += 1;
      orderOfType.QUESTION = 0;
    }

    if (segment.type === 'QUESTION') {
      orderOfType.QUESTION += 1;
    }

    if (segment.type === 'MUSIC') {
      orderOfType.MUSIC += 1;
    }

    if (segment.type === 'SPECIAL') {
      orderOfType.SPECIAL += 1;
    }

    return {
      ...segment,
      orderOfType: orderOfType[segment.type],
      nearestTrip
    };
  });
};

const CreatePage: NextPage<{}> = () => {
  const [name, setName] = useState('');
  const [hosts, setHosts] = useState('');
  const [date, setDate] = useState('');
  const [segments, setSegments] = useState<UncreatedSegment[]>([]);

  const addSegment = (type: SegmentType) => {
    const newSegment = {
      type,
      order: segments.length + 1,
      scorePublished: false,
      numberOfOptions: type === 'QUESTION' || type === 'MUSIC' ? 2 : null,
      orderOfType: 0,
      nearestTrip: 0
    };

    const newSegments = calculateSegmentNumbers([...segments, newSegment]);

    setSegments(newSegments);
  };

  const changeOptionsCount = (position: number, count: number) => {
    const newSegments = segments.map((segment) => {
      if (segment.order === position) {
        return {
          ...segment,
          numberOfOptions: count
        };
      }

      return { ...segment };
    });

    setSegments(newSegments);
  };

  const moveSegment = (direction: 'up' | 'down', currentPosition: number) => {
    if (
      (direction === 'up' && currentPosition === 1) ||
      (direction === 'down' && currentPosition === segments.length)
    ) {
      return;
    }

    const newSegments = segments
      .map((segment) => {
        if (segment.order === currentPosition) {
          return {
            ...segment,
            order:
              direction === 'up' ? currentPosition - 1 : currentPosition + 1
          };
        }

        if (segment.order === currentPosition + (direction === 'up' ? -1 : 1)) {
          return {
            ...segment,
            order: currentPosition
          };
        }

        return segment;
      })
      .sort((a, b) => a.order - b.order);

    setSegments(calculateSegmentNumbers(newSegments));
  };

  const deleteSegment = (position: number) => {
    const segmentToDelete = segments[position - 1];

    const newSegments = segments
      .filter((segment) => segment.order !== position)
      .map((segment) => {
        const newOrder =
          segment.order > segmentToDelete.order
            ? segment.order - 1
            : segment.order;

        return {
          ...segment,
          order: newOrder
        };
      })
      .sort((a, b) => a.order - b.order);

    setSegments(calculateSegmentNumbers(newSegments));
  };

  const router = useRouter();
  const submit: FormEventHandler = async (event) => {
    event.preventDefault();

    try {
      await createCompetition({
        competition: {
          name,
          hosts,
          date,
          currentLevel: null,
          currentStage: null,
          winnerTeamId: null
        },
        segments
      });

      router.push('/');
    } catch (error) {
      console.log('Soemthing went wrong');
    }
  };

  return (
    <Wrapper>
      <h1>Skapa tävling</h1>
      <form onSubmit={submit}>
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
                key={
                  segment.type === 'QUESTION'
                    ? `${segment.type}-${segment.nearestTrip}:${segment.orderOfType}`
                    : `${segment.type}-${segment.orderOfType}`
                }
                segment={segment}
                totalSegments={segments.length}
                moveUp={() => moveSegment('up', segment.order)}
                moveDown={() => moveSegment('down', segment.order)}
                deleteSegment={() => deleteSegment(segment.order)}
                changeOptionsCount={changeOptionsCount}
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

        <Divider />

        <SubmitButton>Spara</SubmitButton>
      </form>
    </Wrapper>
  );
};

export default CreatePage;
