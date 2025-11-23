import { NextPage } from 'next';
import { Wrapper } from 'components/Wrapper';
import { FormEventHandler, useState } from 'react';
import { SegmentType } from '@prisma/client';
import { Segment } from 'components/create/Segment';
import { UncreatedSegment } from 'types/types';
import { createCompetition } from 'services/local';
import { useRouter } from 'next/router';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { ItemGroup } from '@/components/ui/item';

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
        <FieldSet>
          <Field>
            <FieldLabel htmlFor="name">Namn</FieldLabel>
            <Input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="hosts">Värdar</FieldLabel>
            <Input
              type="text"
              id="hosts"
              name="hosts"
              value={hosts}
              onChange={(event) => setHosts(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="date">Datum</FieldLabel>
            <Input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </Field>
        </FieldSet>
        <h2>Moment</h2>
        {segments.length > 0 ? (
          <ItemGroup className="mb-4 gap-4">
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
          </ItemGroup>
        ) : (
          <p>
            <i>Inga moment har lagts till</i>
          </p>
        )}
        <div className="mb-4 flex gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => addSegment('TRIP')}
          >
            + Resa
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => addSegment('QUESTION')}
          >
            + Fråga
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => addSegment('MUSIC')}
          >
            + Musikfråga
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => addSegment('SPECIAL')}
          >
            + Specialfråga
          </Button>
        </div>
        <hr className="mb-4 border-b border-none border-b-[#999999]" />
        <Button className="mb-16 border border-[hsl(116,46%,30%)] bg-[hsl(116,46%,55%)] hover:bg-[hsl(116,46%,50%)]">
          Spara
        </Button>
      </form>
    </Wrapper>
  );
};

export default CreatePage;
