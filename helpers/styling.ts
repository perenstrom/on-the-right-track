import { SegmentType, TeamState } from '@prisma/client';

export const getTeamStateColor = (state: TeamState) => {
  switch (state) {
    case 'IDLE':
      return 'hsl(0, 0%, 85%)';
    case 'STOPPED':
    case 'STOPPED_ANSWERED':
      return 'hsl(18, 95%, 40%)';
    case 'STOPPED_HANDLED':
      return 'hsl(11, 74%, 77%)';
    case 'ANSWERED':
    case 'ANSWERED_HANDLED':
      return 'hsl(216, 100%, 74%)';
    default:
      return 'hsl(0, 0%, 85%)';
  }
};

export const getTeamStateColorTW = (state: TeamState) => {
  switch (state) {
    case 'IDLE':
      return 'bg-[hsl(0,0%,85%)]';
    case 'STOPPED':
    case 'STOPPED_ANSWERED':
      return 'bg-[hsl(18,95%,40%)]';
    case 'STOPPED_HANDLED':
      return 'bg-[hsl(11,74%,77%)]';
    case 'ANSWERED':
    case 'ANSWERED_HANDLED':
      return 'bg-[hsl(216,100%,74%)]';
    default:
      return 'bg-[hsl(0,0%,85%)]';
  }
};

export const getTeamStateTextColor = (state: TeamState) => {
  switch (state) {
    case 'IDLE':
    case 'ANSWERED':
    case 'ANSWERED_HANDLED':
    case 'STOPPED_HANDLED':
      return 'hsl(0, 0%, 15%)';
    case 'STOPPED_ANSWERED':
    case 'STOPPED':
      return 'hsl(0, 0%, 100%)';
    default:
      return 'hsl(0, 0%, 15%)';
  }
};

export const getTeamStateTextColorTW = (state: TeamState) => {
  switch (state) {
    case 'IDLE':
    case 'ANSWERED':
    case 'ANSWERED_HANDLED':
    case 'STOPPED_HANDLED':
      return 'text-[hsl(0,0%,15%)]';
    case 'STOPPED_ANSWERED':
    case 'STOPPED':
      return 'text-[hsl(0,0%,100%)]';
    default:
      return 'text-[hsl(0,0%,15%)]';
  }
};

export const getScoreTeamStateColorTW = (
  input:
    | {
        state: TeamState;
        scoresPublished: false;
      }
    | {
        scoresPublished: true;
        score: number | null;
        segmentType: SegmentType;
      }
) => {
  if (input.scoresPublished) {
    return getScoreTeamStateColorPublishedTW(input.segmentType, input.score);
  } else {
    return getScoreTeamStateColorUnpublishedTW(input.state);
  }
};

const getScoreTeamStateColorUnpublishedTW = (state: TeamState) => {
  switch (state) {
    case 'IDLE':
      return 'bg-[hsl(0,0%,85%)]';
    case 'STOPPED':
      return 'bg-[hsl(18,95%,40%)]';
    case 'STOPPED_ANSWERED':
    case 'STOPPED_HANDLED':
      return 'bg-[hsl(11,74%,77%)]';
    case 'ANSWERED':
    case 'ANSWERED_HANDLED':
      return 'bg-[hsl(216,100%,74%)]';
    default:
      return 'bg-[hsl(0,0%,85%)]';
  }
};

const getScoreTeamStateColorPublishedTW = (
  segmentType: SegmentType,
  score: number | null
) => {
  if (segmentType === 'TRIP') {
    switch (score) {
      case 10:
        return 'bg-[hsl(126,84%,37%)]';
      case 8:
        return 'bg-[hsl(101,61%,59%)]';
      case 6:
        return 'bg-[hsl(87,70%,74%)]';
      case 4:
        return 'bg-[hsl(72,68%,85%)]';
      case 2:
        return 'bg-[hsl(46,41%,87%)]';
      case 0:
        return 'bg-[hsl(22,100%,71%)]';
      default:
        return 'bg-[hsl(22,100%,71%)]';
    }
  } else {
    switch (score) {
      case 3:
        return 'bg-[hsl(126,84%,37%)]';
      case 2:
        return 'bg-[hsl(76,66%,55%)]';
      case 1:
        return 'bg-[hsl(43,100%,68%)]';
      default:
        return 'bg-[hsl(22,100%,71%)]';
    }
  }
};

export const getScoreTeamStateTextColorTW = (input: {
  state: TeamState;
  scoresPublished: boolean;
}) => {
  if (input.scoresPublished) {
    return 'text-[hsl(0,0%,15%)]';
  } else {
    switch (input.state) {
      case 'IDLE':
      case 'ANSWERED':
      case 'ANSWERED_HANDLED':
      case 'STOPPED_HANDLED':
      case 'STOPPED_ANSWERED':
        return 'text-[hsl(0,0%,15%)]';
      case 'STOPPED':
        return 'text-[hsl(0,0%,100%)]';
      default:
        return 'text-[hsl(0,0%,15%)]';
    }
  }
};
