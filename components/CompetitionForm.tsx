import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ItemGroup } from '@/components/ui/item';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SegmentType } from '@prisma/client';
import { Segment } from 'components/create/Segment';
import { FormEventHandler, useState, useEffect } from 'react';
import { canEditStages as canEditStagesApi } from 'services/local';
import { UncreatedSegment, FullCompetition } from 'types/types';
import { AlertTriangle } from 'lucide-react';

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

interface CompetitionFormProps {
  mode: 'create' | 'edit';
  initialCompetition?: FullCompetition | null;
  competitionId?: string;
  onSubmit: (data: {
    name: string;
    hosts: string;
    date: string;
    segments: UncreatedSegment[];
    canEditSegments: boolean;
  }) => Promise<void>;
  onCancel?: () => void;
}

export const CompetitionForm: React.FC<CompetitionFormProps> = ({
  mode,
  initialCompetition,
  competitionId,
  onSubmit,
  onCancel
}) => {
  const [name, setName] = useState(initialCompetition?.name || '');
  const [hosts, setHosts] = useState(initialCompetition?.hosts || '');
  const [date, setDate] = useState(
    initialCompetition?.date
      ? new Date(initialCompetition.date).toISOString().split('T')[0]
      : ''
  );
  const [segments, setSegments] = useState<UncreatedSegment[]>(
    initialCompetition?.segments || []
  );

  const [canEditStagesState, setCanEditStagesState] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if stages can be edited (only in edit mode)
  useEffect(() => {
    if (mode === 'edit' && competitionId) {
      canEditStagesApi(competitionId).then(setCanEditStagesState);
    }
  }, [mode, competitionId]);

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

  const isEditMode = mode === 'edit';
  const canEditSegments = !isEditMode || canEditStagesState;

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ name, hosts, date, segments, canEditSegments });
    } catch (error) {
      console.log('Something went wrong', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1>{isEditMode ? 'Redigera tävling' : 'Skapa tävling'}</h1>

      <form onSubmit={handleSubmit}>
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
        {isEditMode && !canEditStagesState && (
          <Alert className="mb-4 border-yellow-500 bg-yellow-50 text-yellow-900">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Moment kan inte redigeras</AlertTitle>
            <AlertDescription>
              Moment kan inte ändras eftersom lag redan har börjat tävla. Du kan
              fortfarande redigera namn, datum och värdar.
            </AlertDescription>
          </Alert>
        )}
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
                disabled={!canEditSegments}
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
            disabled={!canEditSegments}
          >
            + Resa
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => addSegment('QUESTION')}
            disabled={!canEditSegments}
          >
            + Fråga
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => addSegment('MUSIC')}
            disabled={!canEditSegments}
          >
            + Musikfråga
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => addSegment('SPECIAL')}
            disabled={!canEditSegments}
          >
            + Specialfråga
          </Button>
        </div>
        <hr className="mb-4 border-b border-none border-b-[#999999]" />
        <div className="mb-16 flex gap-4">
          <Button
            className="border border-[hsl(116,46%,30%)] bg-[hsl(116,46%,55%)] hover:bg-[hsl(116,46%,50%)]"
            disabled={isSubmitting}
          >
            Spara
          </Button>
          {isEditMode && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Avbryt
            </Button>
          )}
        </div>
      </form>
    </>
  );
};
