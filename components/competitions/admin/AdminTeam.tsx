import { Segment, TeamState } from '@prisma/client';
import { getTeamStateColorTW, getTeamStateTextColorTW } from 'helpers/styling';
import { FullTeam } from 'types/types';
import { ScoreButton } from './ScoreButton';
import { patchTeamSegmentState } from 'services/local';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MouseEventHandler } from 'react';
import { cn } from 'helpers/tailwindUtils';

const EditButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className="absolute right-0 bottom-0 m-0 -mr-2 -mb-2 border-none bg-transparent text-base text-[hsla(0,0%,0%,0.3)] hover:text-[hsla(0,0%,0%,0.5)]"
    {...props}
  />
);

export const AdminTeam: React.FC<{
  team: FullTeam;
  score: number;
  currentSegment: Segment | null;
  connectionState: 'connected' | 'connecting' | 'disconnected';
  displayAnswers: boolean;
  handleEditTeam: (teamId: string) => void;
}> = ({
  team,
  score,
  currentSegment,
  connectionState,
  displayAnswers,
  handleEditTeam
}) => {
  const currentSegmentTeamState = team.segmentTeamStates.find(
    (segmentTeamState) => segmentTeamState.segmentId === currentSegment?.id
  );

  const currentState: TeamState = currentSegmentTeamState
    ? currentSegmentTeamState.state
    : 'IDLE';

  const router = useRouter();
  const handleScoring = async (score: number) => {
    if (!currentSegmentTeamState || !currentSegment) return;

    const newState: TeamState =
      currentSegment.type === 'TRIP' ? 'STOPPED_HANDLED' : 'ANSWERED_HANDLED';
    await patchTeamSegmentState(
      currentSegment.competitionId,
      currentSegmentTeamState.id,
      {
        score,
        state: newState
      }
    );

    router.replace(router.asPath);
  };

  const handleEditButton: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();
    if (!currentSegmentTeamState || !currentSegment) return;

    const newState: TeamState =
      currentSegment.type === 'TRIP' ? 'STOPPED_ANSWERED' : 'ANSWERED';
    await patchTeamSegmentState(
      currentSegment.competitionId,
      currentSegmentTeamState.id,
      {
        state: newState,
        score: null
      }
    );

    router.replace(router.asPath);
  };

  return (
    <div
      className={cn(
        'relative flex min-w-0 flex-col overflow-hidden rounded-[10px] border-none p-4 pt-[0.8rem]',
        getTeamStateTextColorTW(currentState),
        getTeamStateColorTW(currentState)
      )}
    >
      <h2 className="m-0 block max-w-full overflow-hidden text-center text-2xl text-ellipsis whitespace-nowrap">
        {team.name}
      </h2>
      <div className="relative flex flex-1 flex-col items-center">
        <span className="m-0 block max-w-full overflow-hidden text-center text-ellipsis whitespace-nowrap">
          {team.members}
        </span>
        <div className="flex flex-1 items-center justify-center text-[6rem] leading-none font-medium">
          <>{score}</>
          {!currentSegment?.scorePublished &&
            (currentState === 'STOPPED_HANDLED' ||
              currentState === 'ANSWERED_HANDLED') &&
            !displayAnswers && (
              <span className="ml-4 text-[3rem] font-medium text-[hsl(116_46%_40%)]">
                +{currentSegmentTeamState?.score}
              </span>
            )}
          {(currentState === 'STOPPED_HANDLED' ||
            currentState === 'ANSWERED_HANDLED') &&
            !displayAnswers && (
              <EditButton
                onClick={handleEditButton}
                disabled={connectionState !== 'connected'}
              >
                <FontAwesomeIcon icon={faEdit} />
              </EditButton>
            )}
          {!currentSegment && team.segmentTeamStates.length === 0 && (
            <EditButton
              onClick={() => handleEditTeam(team.id)}
              disabled={connectionState !== 'connected'}
            >
              <FontAwesomeIcon icon={faTrash} />
            </EditButton>
          )}
        </div>
        {currentState === 'STOPPED' && !displayAnswers && (
          <>
            <div className="absolute -right-18 -bottom-18 flex h-40 w-40 items-center justify-center rounded-full border-2 border-[hsl(0_0%_15%)] bg-[hsl(0_0%_100%)]"></div>
            <div className="absolute right-0 bottom-0 w-20 p-2 text-center text-[3rem] leading-none font-medium text-[hsl(18_95%_40%)]">
              {currentSegmentTeamState?.stopLevel}
            </div>
          </>
        )}
        {(currentState === 'STOPPED_ANSWERED' ||
          currentState === 'ANSWERED' ||
          displayAnswers) && (
          <div className="absolute flex h-full w-full flex-col rounded-sm bg-[hsla(0,0%,100%,0.8)] p-2 pt-0 text-[hsl(0_0%_15%)]">
            <span className="text-[0.8rem] font-bold">Svar:</span>
            {currentSegment?.type === 'SPECIAL' &&
              'Specialfråga. Laget har svarat på annat sätt.'}
            <ol className="flex-1 list-inside list-decimal ps-0">
              {currentSegmentTeamState?.answers.map((answer) => (
                <li
                  className="m-0 text-base leading-[1.1] font-bold"
                  key={answer.id}
                >
                  {answer.answer || ''}
                </li>
              ))}
            </ol>
            {!displayAnswers && (
              <div className="flex w-full gap-2">
                {currentSegment?.type === 'TRIP' && (
                  <>
                    <ScoreButton
                      $variant="wrong"
                      onClick={() => handleScoring(0)}
                      disabled={connectionState !== 'connected'}
                    >
                      Fel 0p
                    </ScoreButton>
                    <ScoreButton
                      $variant="correct"
                      onClick={() =>
                        handleScoring(currentSegmentTeamState?.stopLevel || 0)
                      }
                      disabled={connectionState !== 'connected'}
                    >
                      {`Rätt ${currentSegmentTeamState?.stopLevel}p`}
                    </ScoreButton>
                  </>
                )}
                {(currentSegment?.type === 'MUSIC' ||
                  currentSegment?.type === 'QUESTION' ||
                  currentSegment?.type === 'SPECIAL') && (
                  <>
                    <ScoreButton
                      $variant="wrong"
                      onClick={() => handleScoring(0)}
                      disabled={connectionState !== 'connected'}
                    >
                      0p
                    </ScoreButton>
                    <ScoreButton
                      $variant="correct"
                      onClick={() => handleScoring(1)}
                      disabled={connectionState !== 'connected'}
                    >
                      1p
                    </ScoreButton>
                    <ScoreButton
                      $variant="correct"
                      onClick={() => handleScoring(2)}
                      disabled={connectionState !== 'connected'}
                    >
                      2p
                    </ScoreButton>
                    <ScoreButton
                      $variant="correct"
                      onClick={() => handleScoring(3)}
                      disabled={connectionState !== 'connected'}
                    >
                      3p
                    </ScoreButton>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
