import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Segment, TeamState } from '@prisma/client';
import { getTeamStateColorTW, getTeamStateTextColorTW } from 'helpers/styling';
import { cn } from 'helpers/tailwindUtils';
import { CheckIcon, Trash2, XIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { FormEventHandler, MouseEventHandler, useState } from 'react';
import { deleteTeam, patchTeamSegmentState } from 'services/local';
import { FullTeam } from 'types/types';
import { ScoreButton } from './ScoreButton';

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
}> = ({ team, score, currentSegment, connectionState, displayAnswers }) => {
  const handleDeleteTeam: FormEventHandler = async (event) => {
    event.preventDefault();

    await deleteTeam(team.id);
  };
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

  const [isEditingLevel, setIsEditingLevel] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string>(
    currentSegmentTeamState?.stopLevel?.toString() || ''
  );

  const handleLevelChange = async (level: string) => {
    if (!currentSegmentTeamState || !currentSegment) return;

    const levelNumber = level === '' ? null : parseInt(level, 10);
    await patchTeamSegmentState(
      currentSegment.competitionId,
      currentSegmentTeamState.id,
      {
        stopLevel: levelNumber
      }
    );

    setIsEditingLevel(false);
    router.replace(router.asPath);
  };

  const handleStartEditLevel = () => {
    setSelectedLevel(currentSegmentTeamState?.stopLevel?.toString() || '');
    setIsEditingLevel(true);
  };

  const handleCancelEditLevel = () => {
    setIsEditingLevel(false);
    setSelectedLevel(currentSegmentTeamState?.stopLevel?.toString() || '');
  };

  const handleConfirmLevelChange = () => {
    handleLevelChange(selectedLevel);
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
            <Dialog>
              <DialogTrigger asChild>
                <EditButton disabled={connectionState !== 'connected'}>
                  <Trash2 />
                </EditButton>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleDeleteTeam} className="contents">
                  <DialogHeader>
                    <DialogTitle className="m-0">Ta bort lag</DialogTitle>
                    <DialogDescription>
                      {`Vill du ta bort "${team.name}"?`}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Avbryt</Button>
                    </DialogClose>
                    <Button type="submit">Ta bort</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
              <div className="flex w-full flex-col gap-2">
                {currentSegment?.type === 'TRIP' &&
                  (currentState === 'STOPPED_ANSWERED' ||
                    currentState === 'STOPPED_HANDLED') &&
                  (isEditingLevel ? (
                    <div className="flex w-full items-center gap-2">
                      <Select
                        value={selectedLevel}
                        onValueChange={setSelectedLevel}
                        disabled={connectionState !== 'connected'}
                      >
                        <SelectTrigger className="h-9 flex-1 rounded-sm border border-[hsl(0_0%_15%)] bg-[hsl(0_0%_100%)] text-[hsl(0_0%_15%)] hover:bg-[hsl(0_0%_95%)] disabled:cursor-not-allowed disabled:opacity-50">
                          <SelectValue placeholder="Välj nivå" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">Stoppnivå: 2</SelectItem>
                          <SelectItem value="4">Stoppnivå: 4</SelectItem>
                          <SelectItem value="6">Stoppnivå: 6</SelectItem>
                          <SelectItem value="8">Stoppnivå: 8</SelectItem>
                          <SelectItem value="10">Stoppnivå: 10</SelectItem>
                        </SelectContent>
                      </Select>
                      <button
                        onClick={handleConfirmLevelChange}
                        disabled={connectionState !== 'connected'}
                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-[hsl(116_46%_30%)] bg-[hsl(116_46%_55%)] text-[hsl(0_0%_15%)] hover:bg-[hsl(116_46%_50%)] disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                      >
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancelEditLevel}
                        disabled={connectionState !== 'connected'}
                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-[hsl(0_0%_15%)] bg-[hsl(0_0%_100%)] text-[hsl(0_0%_15%)] hover:bg-[hsl(0_0%_95%)] disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex w-full gap-2">
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
                        {`Rätt ${currentSegmentTeamState?.stopLevel || 0}p`}
                      </ScoreButton>
                      <button
                        onClick={handleStartEditLevel}
                        disabled={connectionState !== 'connected'}
                        className="flex h-9 w-9 items-center justify-center rounded-sm border border-[hsl(0_0%_15%)] bg-[hsl(0_0%_100%)] text-[hsl(0_0%_15%)] hover:bg-[hsl(0_0%_95%)] disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </div>
                  ))}
                {(currentSegment?.type === 'MUSIC' ||
                  currentSegment?.type === 'QUESTION' ||
                  currentSegment?.type === 'SPECIAL') && (
                  <div className="flex w-full gap-2">
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
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
