import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Answer, Segment, SegmentTeamState, TeamState } from '@prisma/client';
import { Button } from 'components/Button';
import { getFullSegmentName } from 'helpers/copy';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { FormEvent, useCallback, useState } from 'react';
import { patchAnswer, patchTeamSegmentState } from 'services/local';
import {
  getBaseCompetition,
  getSegment,
  getTeam,
  upsertAnswer,
  upsertSegmentTeamState
} from 'services/prisma';
import { CompetitionWithSegmentCount } from 'types/types';
import { useAblyClientChannel } from 'hooks/useAblyClientChannel';
import { ablyEvents } from 'services/ably/ably';
import {
  PublishDeletedTeamSchema,
  PublishNewSegmentTeamStateSchema,
  PublishNewStageSchema
} from 'services/ably/client';
import { ConnectionStatus } from 'components/ConnectionStatus';
import { pullTheBreak as pullTheBreakService } from 'services/local';
import { cn } from 'helpers/tailwindUtils';
import { Field, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

interface TripHeadingProps {
  variant: 'stopped' | 'answered';
}
const TripHeading = ({
  variant,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & TripHeadingProps) => (
  <div
    className={cn(
      'flex h-28 w-full items-center justify-center text-[5rem] leading-none font-bold text-white',
      variant === 'stopped' ? 'bg-[hsl(18,95%,40%)]' : 'bg-[hsl(11,74%,77%)]',
      className
    )}
    {...props}
  />
);

const WaitingForSegment = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mx-auto mt-10 mb-0 text-[1.6rem]', className)}
    {...props}
  />
);

const AnswerForm = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) => (
  <form className={cn('flex h-full w-full flex-col', className)} {...props} />
);

interface Props {
  competition: CompetitionWithSegmentCount;
  segment: Segment | null;
  teamState: SegmentTeamState | null;
  answers: Answer[];
}

const CompetitionPlayPage: NextPage<Props> = ({
  competition,
  segment,
  teamState,
  answers: initialAnswers
}) => {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

  // Reset answers when segment changes
  const [prevAnswers, setPrevAnswers] = useState(initialAnswers);
  if (initialAnswers !== prevAnswers) {
    setPrevAnswers(initialAnswers);
    setAnswers(initialAnswers);
  }

  const { connectionState } = useAblyClientChannel(
    competition.id,
    useCallback(
      (message) => {
        // Ignore team state events for other teams
        if (message.name === ablyEvents.newSegmentTeamState) {
          const parsedMessage = PublishNewSegmentTeamStateSchema.safeParse(
            message.data
          );

          if (
            parsedMessage.success &&
            parsedMessage.data.teamId !== teamState?.teamId
          ) {
            return;
          }
        }

        // Ignore stage events for same stage
        if (message.name === ablyEvents.newStage) {
          const parsedMessage = PublishNewStageSchema.safeParse(message.data);

          if (
            parsedMessage.success &&
            parsedMessage.data.stage === competition.currentStage
          ) {
            return;
          }
        }

        // Ignore team events for other teams, redirect to home if current team deleted
        if (message.name === ablyEvents.deletedTeam) {
          const parsedMessage = PublishDeletedTeamSchema.safeParse(
            message.data
          );
          if (
            parsedMessage.success &&
            parsedMessage.data.teamId !== teamState?.teamId
          ) {
            return;
          } else if (parsedMessage.success) {
            router.replace('/');
            return;
          }
        }

        router.replace(router.asPath);
        return;
      },
      [competition.currentStage, router, teamState?.teamId]
    )
  );

  const [ablyHasDisconnected, setAblyHasDisconnected] = useState(false);
  // If Ably connection fails, mark as disconnected
  if (connectionState === 'suspended' && !ablyHasDisconnected) {
    setAblyHasDisconnected(true);
  }
  // Fetch new data if connection is restored
  if (connectionState === 'connected' && ablyHasDisconnected) {
    router.replace(router.asPath);
  }

  const [ablyHasFailed, setAblyHasFailed] = useState(false);
  // If Ably connection fails, mark as failed
  if (connectionState === 'failed' && !ablyHasFailed) {
    setAblyHasFailed(true);
  }

  const pullTheBreak = async () => {
    if (teamState) {
      await pullTheBreakService(competition.id, teamState.id);
      router.replace(router.asPath);
    }
  };

  const handleAnswersChange = (
    e: FormEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = e.currentTarget;

    const newAnswer = { ...answers[index], answer: value };
    const newAnswers = [...answers];
    newAnswers[index] = newAnswer;

    setAnswers(newAnswers);
  };

  const handleSubmitAnswers = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const numberOfOptions = segment
      ? segment.type === 'TRIP'
        ? 1
        : segment.numberOfOptions || 0
      : 0;

    if (segment && teamState) {
      const numberArray = new Array(numberOfOptions).fill(0);
      const promises = numberArray.map((_, i) =>
        patchAnswer(answers[i]?.id, answers[i]?.answer)
      );
      await Promise.all(promises);

      const newState: TeamState =
        segment.type === 'TRIP' ? 'STOPPED_ANSWERED' : 'ANSWERED';
      await patchTeamSegmentState(competition.id, teamState?.id, {
        state: newState
      });

      router.replace(router.asPath);
    }
  };

  const handleSubmitSpecial = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (teamState) {
      await patchTeamSegmentState(competition.id, teamState?.id, {
        state: 'ANSWERED'
      });

      router.replace(router.asPath);
    }
  };

  const connectionStatus =
    connectionState !== 'connected'
      ? ablyHasFailed
        ? 'disconnected'
        : 'connecting'
      : 'connected';

  const isTrip = segment?.type === 'TRIP';
  const isQuestion = segment?.type === 'QUESTION';
  const isMusic = segment?.type === 'MUSIC';
  const isSpecial = segment?.type === 'SPECIAL';

  const hasLevel = competition.currentLevel === null;

  const isIdle = teamState?.state === 'IDLE';
  const isStopped = teamState?.state === 'STOPPED';
  const isStoppedAnswered = teamState?.state === 'STOPPED_ANSWERED';
  const isStoppedHandled = teamState?.state === 'STOPPED_HANDLED';
  const isAnswered = teamState?.state === 'ANSWERED';
  const isAnsweredHandled = teamState?.state === 'ANSWERED_HANDLED';

  const isWaitingForDeparture = isTrip && isIdle && hasLevel;
  const isTraveling = isTrip && isIdle && !hasLevel;
  const isAnswering =
    (isTrip && isStopped) || ((isQuestion || isMusic) && isIdle && teamState);
  const hasAnswered =
    (isTrip && (isStoppedAnswered || isStoppedHandled)) ||
    ((isQuestion || isMusic) && (isAnswered || isAnsweredHandled));
  const isFinished = competition.currentStage === competition.segmentCount + 1;
  const winnerIsDeclared = !!competition.winnerTeamId;

  return (
    <div className="flex h-full flex-col items-center">
      <div className="z-1 flex h-16 w-full content-center items-center bg-[hsl(0,0%,90%)] text-[2rem] font-bold">
        {ablyHasFailed
          ? 'offline'
          : segment
            ? getFullSegmentName(segment)
            : '. . .'}
      </div>
      <ConnectionStatus state={connectionStatus} />
      {ablyHasFailed ? (
        <WaitingForSegment>
          Du har tappat kontakten med servern. Ladda om sidan.
        </WaitingForSegment>
      ) : (
        <>
          {!segment && competition.currentStage === null && (
            <WaitingForSegment>Invänta nästa moment</WaitingForSegment>
          )}
          {!segment && isFinished && !winnerIsDeclared && (
            <WaitingForSegment>
              Spelet är över, invänta resultat
            </WaitingForSegment>
          )}
          {!segment && winnerIsDeclared && (
            <WaitingForSegment>
              Spelet är över, grattis till vinnarlaget!
            </WaitingForSegment>
          )}
          {isWaitingForDeparture && (
            <WaitingForSegment>Invänta avgång</WaitingForSegment>
          )}
          {isTraveling && (
            <>
              <button
                className="flex w-full items-center justify-center border-none bg-transparent"
                type="button"
                onClick={() => pullTheBreak()}
                disabled={connectionState !== 'connected'}
              >
                <img
                  className="-mt-52"
                  src="/break.svg"
                  alt="Break"
                  width="80%"
                />
              </button>
              <div className="mt-8 flex flex-1 content-center items-center text-[13rem] leading-none font-bold">
                {competition.currentLevel}
              </div>
            </>
          )}
          {isAnswering && (
            <AnswerForm onSubmit={handleSubmitAnswers}>
              {isTrip && (
                <TripHeading variant="stopped">
                  {teamState.stopLevel}
                </TripHeading>
              )}
              <div className="flex w-full flex-1 flex-col gap-4 p-4">
                {answers.map((answer) => (
                  <Field className="flex-1 gap-0" key={answer.id}>
                    <FieldLabel className="text-[2rem]" htmlFor={answer.id}>
                      {`Svar ${answer.questionNumber}`}
                    </FieldLabel>
                    <Textarea
                      className="h-full text-2xl leading-[1.2]"
                      id={answer.id}
                      value={answer.answer}
                      onChange={(event) =>
                        handleAnswersChange(event, answer.questionNumber - 1)
                      }
                    />
                  </Field>
                ))}
                <Button
                  className="w-full border border-[hsl(116,46%,30%)] bg-[hsl(116,46%,55%)] text-2xl"
                  type="submit"
                  disabled={connectionState !== 'connected'}
                >
                  Svara
                </Button>
              </div>
            </AnswerForm>
          )}
          {isSpecial && (
            <AnswerForm onSubmit={handleSubmitSpecial}>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex flex-1 flex-col content-center items-center gap-4 text-center text-[1.2rem] leading-[1.4rem]">
                  <div className="max-w-72">
                    Specialfråga. Följ instruktioner från spelledningen.
                  </div>

                  <div className="max-w-72">
                    {isIdle
                      ? 'Tryck på Svarat när ni är klara.'
                      : 'Ni har svarat.'}
                  </div>
                </div>
                {isIdle ? (
                  <Button
                    className="w-full border border-[hsl(116,46%,30%)] bg-[hsl(116,46%,55%)] text-2xl"
                    type="submit"
                    disabled={connectionState !== 'connected'}
                  >
                    Svarat
                  </Button>
                ) : (
                  <p className="text-center text-2xl text-[hsl(203,54%,50%)]">
                    <FontAwesomeIcon icon={faCheck} /> Svarat
                  </p>
                )}
              </div>
            </AnswerForm>
          )}
          {hasAnswered && (
            <>
              {isTrip && (
                <TripHeading variant="answered">
                  {teamState.stopLevel}
                </TripHeading>
              )}
              <div className="flex w-full flex-1 flex-col p-4">
                <p className="block text-[2rem] font-medium">Ert svar:</p>
                <ol className="flex-1 pl-4">
                  {answers.map((answer) => (
                    <li key={answer.id}>
                      <p className="mb-4 w-full flex-1 text-2xl leading-[1.2]">{`${answer.answer}`}</p>
                    </li>
                  ))}
                </ol>
                <p className="text-center text-2xl text-[hsl(203,54%,50%)]">
                  <FontAwesomeIcon icon={faCheck} /> Svarat
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

interface Params extends ParsedUrlQuery {
  competitionId: string;
  teamId: string;
}
export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  if (!context?.params?.competitionId || !context?.params?.teamId) {
    throw new Error('No competition ID or team ID in params');
  }

  const [competition, team] = await Promise.all([
    getBaseCompetition(prismaContext, context?.params?.competitionId),
    getTeam(prismaContext, context?.params?.teamId)
  ]);

  const segment =
    competition.currentStage &&
    competition.currentStage <= competition.segmentCount
      ? await getSegment(
          prismaContext,
          competition.id,
          competition.currentStage
        )
      : null;

  const teamState = segment
    ? await upsertSegmentTeamState(prismaContext, {
        selector: {
          segmentId: segment.id,
          teamId: team.id
        },
        data: {}
      })
    : null;

  const numberOfOptions = segment
    ? segment.type === 'TRIP'
      ? 1
      : segment.numberOfOptions || 0
    : 0;

  let answers: Answer[] = [];
  if (segment && teamState && numberOfOptions > 0) {
    const numberArray = new Array(numberOfOptions).fill(0);
    const promises = numberArray.map((_, i) =>
      upsertAnswer(prismaContext, {
        stateId: teamState.id,
        questionNumber: i + 1
      })
    );
    answers = await Promise.all(promises);
  }

  return {
    props: {
      competition,
      segment,
      teamState,
      answers: answers.sort((a, b) => a.questionNumber - b.questionNumber)
    }
  };
};

export default CompetitionPlayPage;
