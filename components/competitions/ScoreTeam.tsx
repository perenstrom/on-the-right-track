import { Segment, SegmentType, TeamState } from '@prisma/client';
import {
  getScoreTeamStateColorTW,
  getScoreTeamStateTextColorTW
} from 'helpers/styling';
import { cn } from 'helpers/tailwindUtils';
import { ScoreTeam as ScoreTeamType } from 'types/types';
import { Trophy } from 'lucide-react';
import { forwardRef } from 'react';

const commonClasses =
  'm-0 block max-w-full overflow-hidden text-center leading-normal text-ellipsis whitespace-nowrap';

const getWrapperBgClassName = (
  state: TeamState,
  scoresPublished: boolean,
  score: number | null,
  segmentType: SegmentType
) => {
  const options = scoresPublished
    ? {
        scoresPublished,
        score,
        segmentType
      }
    : {
        scoresPublished,
        state
      };

  return getScoreTeamStateColorTW(options);
};

export const ScoreTeam = forwardRef<
  HTMLDivElement,
  {
    team: ScoreTeamType;
    score: number;
    currentSegment: Segment | null;
    isWinner?: boolean;
  }
>(({ team, score, currentSegment, isWinner = false }, ref) => {
  const currentSegmentTeamState = team.segmentTeamStates.find(
    (segmentTeamState) => segmentTeamState.segmentId === currentSegment?.id
  );

  const currentState: TeamState = currentSegmentTeamState
    ? currentSegmentTeamState.state
    : 'IDLE';

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex min-w-0 flex-col overflow-hidden rounded-lg border-none p-4 pt-[0.8rem]',
        getScoreTeamStateTextColorTW({
          state: currentState,
          scoresPublished: currentSegment?.scorePublished || false
        }),
        getWrapperBgClassName(
          currentState,
          currentSegment?.scorePublished || false,
          currentSegmentTeamState?.score || null,
          currentSegment?.type || 'QUESTION'
        ),
        isWinner &&
          'z-30 shadow-[0_0_20px_rgba(250,204,21,0.6)] ring-4 ring-yellow-400 ring-offset-2'
      )}
    >
      {isWinner && (
        <div className="absolute right-0 bottom-0 z-10">
          <Trophy
            className="h-14 w-14 text-yellow-400 drop-shadow-lg"
            fill="currentColor"
          />
        </div>
      )}
      <h2 className={cn(commonClasses, 'text-2xl', isWinner && 'font-bold')}>
        {team.name}
      </h2>
      <div className="relative flex flex-1 flex-col items-center">
        <span className={commonClasses}>{team.members}</span>
        <div className="flex flex-1 content-center items-center text-8xl leading-none font-medium">
          <>{score}</>
        </div>
      </div>
    </div>
  );
});
