import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Answer,
  Segment,
  SegmentTeamState,
  Team,
  TeamState
} from '@prisma/client';
import { Button } from 'components/Button';
import { Label, TextArea } from 'components/FormControls';
import { getFullSegmentName } from 'helpers/copy';
import { prismaContext } from 'lib/prisma';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { FormEvent, useState } from 'react';
import { patchAnswer, patchTeamSegmentState } from 'services/local';
import {
  getBaseCompetition,
  getSegment,
  getTeam,
  upsertAnswer,
  upsertSegmentTeamState
} from 'services/prisma';
import styled from 'styled-components';
import { Competition } from 'types/types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const SegmentHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  width: 100%;

  font-size: 2rem;
  font-weight: bold;
  height: 4rem;
  background-color: hsl(0, 0%, 90%);
`;

const BreakButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
`;

const BreakImage = styled.img`
  margin-top: -13rem;
`;

interface TripHeadingProps {
  variant: 'stopped' | 'answered';
}
const TripHeading = styled.div<TripHeadingProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  font-size: 5rem;
  line-height: 1;
  font-weight: bold;
  color: hsl(0, 0%, 100%);
  height: 7rem;
  background-color: ${({ variant }) =>
    variant === 'stopped' ? 'hsl(18, 95%, 40%)' : 'hsl(11, 74%, 77%)'};
`;

const TripLevel = styled.div`
  flex: 1;

  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 13rem;
  font-weight: bold;
  line-height: 1;
`;

const WaitingForSegment = styled.div`
  margin: 10rem auto 0;
  font-size: 1.6rem;
`;

const AnswerForm = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const AnswerWrapper = styled.div`
  width: 100%;
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const AnswerLabel = styled(Label)`
  font-size: 2rem;
`;

const AnswerInput = styled(TextArea)`
  font-size: 1.5rem;
  line-height: 1.2;
  flex: 1;
`;

const SubmitButton = styled(Button)`
  background-color: hsl(116, 46%, 55%);
  border: 1px solid hsl(116, 46%, 30%);
  width: 100%;
  font-size: 1.5rem;
`;

const AnsweredWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const AnsweredLabel = styled.p`
  font-size: 2rem;
  display: block;
  font-weight: 500;
`;

const AnswerText = styled.p`
  font-size: 1.5rem;
  line-height: 1.2;

  width: 100%;
  margin-bottom: 1rem;

  flex: 1;
`;

const AnsweredList = styled.ol`
  flex: 1;
  padding-left: 1rem;
`;

const AnsweredCheck = styled.p`
  color: hsl(203, 54%, 50%);
  font-size: 1.5rem;
  text-align: center;
`;

const SpecialWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
`;

const TextWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  text-align: center;
  line-height: 1.4rem;
  font-size: 1.2rem;
`;

const SpecialText = styled.div`
  max-width: 18rem;
`;

interface Props {
  competition: Competition;
  team: Team;
  segment: Segment | null;
  teamState: SegmentTeamState | null;
  answers: Answer[];
}

const CompetitionPlayPage: NextPage<Props> = ({
  competition,
  //team,
  segment,
  teamState,
  answers: initialAnswers
}) => {
  const router = useRouter();
  const pullTheBreak = async () => {
    if (teamState) {
      await patchTeamSegmentState(teamState?.id, {
        state: 'STOPPED',
        stopLevel: competition.currentLevel
      });
      router.replace(router.asPath);
    }
  };

  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);

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
      await patchTeamSegmentState(teamState?.id, {
        state: newState
      });

      router.replace(router.asPath);
    }
  };

  const handleSubmitSpecial = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (teamState) {
      await patchTeamSegmentState(teamState?.id, {
        state: 'ANSWERED'
      });

      router.replace(router.asPath);
    }
  };

  return (
    <Wrapper>
      <SegmentHeading>
        {segment ? getFullSegmentName(segment) : '. . .'}
      </SegmentHeading>
      {!segment && <WaitingForSegment>Invänta nästa moment</WaitingForSegment>}
      {segment?.type === 'TRIP' && teamState?.state === 'IDLE' && (
        <>
          <BreakButton type="button" onClick={() => pullTheBreak()}>
            <BreakImage src="/break.svg" alt="Break" width="80%" />
          </BreakButton>
          <TripLevel>{competition.currentLevel}</TripLevel>
        </>
      )}
      {((segment?.type === 'TRIP' && teamState?.state === 'STOPPED') ||
        (segment?.type === 'QUESTION' && teamState?.state === 'IDLE') ||
        (segment?.type === 'MUSIC' && teamState?.state === 'IDLE')) &&
        teamState && (
          <AnswerForm onSubmit={handleSubmitAnswers}>
            {segment?.type === 'TRIP' && (
              <TripHeading variant="stopped">{teamState.stopLevel}</TripHeading>
            )}
            <AnswerWrapper>
              {answers.map((answer) => (
                <React.Fragment key={answer.id}>
                  <AnswerLabel htmlFor={answer.id}>
                    {`Svar ${answer.questionNumber}`}
                  </AnswerLabel>
                  <AnswerInput
                    id={answer.id}
                    value={answer.answer}
                    onChange={(event) =>
                      handleAnswersChange(event, answer.questionNumber - 1)
                    }
                  />
                </React.Fragment>
              ))}
              <SubmitButton type="submit">Svara</SubmitButton>
            </AnswerWrapper>
          </AnswerForm>
        )}
      {segment?.type === 'SPECIAL' && (
        <AnswerForm onSubmit={handleSubmitSpecial}>
          <SpecialWrapper>
            <TextWrapper>
              <SpecialText>
                Specialfråga. Följ instruktioner från spelledningen.
              </SpecialText>

              <SpecialText>
                {teamState?.state === 'IDLE'
                  ? 'Tryck på Svarat när ni är klara.'
                  : 'Ni har svarat.'}
              </SpecialText>
            </TextWrapper>
            {teamState?.state === 'IDLE' ? (
              <SubmitButton type="submit">Svarat</SubmitButton>
            ) : (
              <AnsweredCheck>
                <FontAwesomeIcon icon={faCheck} /> Svarat
              </AnsweredCheck>
            )}
          </SpecialWrapper>
        </AnswerForm>
      )}
      {((segment?.type === 'TRIP' &&
        (teamState?.state === 'STOPPED_ANSWERED' ||
          teamState?.state === 'STOPPED_HANDLED')) ||
        (segment?.type === 'QUESTION' && teamState?.state === 'ANSWERED') ||
        (segment?.type === 'MUSIC' && teamState?.state === 'ANSWERED')) && (
        <>
          {segment?.type === 'TRIP' && (
            <TripHeading variant="answered">{teamState.stopLevel}</TripHeading>
          )}
          <AnsweredWrapper>
            <AnsweredLabel>Ert svar:</AnsweredLabel>
            <AnsweredList>
              {answers.map((answer) => (
                <li key={answer.id}>
                  <AnswerText>{`${answer.answer}`}</AnswerText>
                </li>
              ))}
            </AnsweredList>
            <AnsweredCheck>
              <FontAwesomeIcon icon={faCheck} /> Svarat
            </AnsweredCheck>
          </AnsweredWrapper>
        </>
      )}
    </Wrapper>
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

  const segment = competition.currentStage
    ? await getSegment(prismaContext, competition.id, competition.currentStage)
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
      team,
      segment,
      teamState,
      answers: answers.sort((a, b) => a.questionNumber - b.questionNumber)
    }
  };
};

export default CompetitionPlayPage;
