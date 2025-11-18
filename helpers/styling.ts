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

export const getScoreTeamStateColor = (
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
    return getScoreTeamStateColorPublished(input.segmentType, input.score);
  } else {
    return getScoreTeamStateColorUnpublished(input.state);
  }
};

const getScoreTeamStateColorUnpublished = (state: TeamState) => {
  switch (state) {
    case 'IDLE':
      return 'hsl(0, 0%, 85%)';
    case 'STOPPED':
      return 'hsl(18, 95%, 40%)';
    case 'STOPPED_ANSWERED':
    case 'STOPPED_HANDLED':
      return 'hsl(11, 74%, 77%)';
    case 'ANSWERED':
    case 'ANSWERED_HANDLED':
      return 'hsl(216, 100%, 74%)';
    default:
      return 'hsl(0, 0%, 85%)';
  }
};

const getScoreTeamStateColorPublished = (
  segmentType: SegmentType,
  score: number | null
) => {
  if (segmentType === 'TRIP') {
    switch (score) {
      case 10:
        return 'hsl(126, 84%, 37%)';
      case 8:
        return 'hsl(101, 61%, 59%)';
      case 6:
        return 'hsl(87, 70%, 74%)';
      case 4:
        return 'hsl(72, 68%, 85%)';
      case 2:
        return 'hsl(46, 41%, 87%)';
      case 0:
        return 'hsl(22, 100%, 71%)';
      default:
        return 'hsl(22, 100%, 71%)';
    }
  } else {
    switch (score) {
      case 3:
        return 'hsl(126, 84%, 37%)';
      case 2:
        return 'hsl(76, 66%, 55%)';
      case 1:
        return 'hsl(43, 100%, 68%)';
      default:
        return 'hsl(22, 100%, 71%)';
    }
  }
};

export const getScoreTeamStateTextColor = (input: {
  state: TeamState;
  scoresPublished: boolean;
}) => {
  if (input.scoresPublished) {
    return 'hsl(0, 0%, 15%)';
  } else {
    switch (input.state) {
      case 'IDLE':
      case 'ANSWERED':
      case 'ANSWERED_HANDLED':
      case 'STOPPED_HANDLED':
      case 'STOPPED_ANSWERED':
        return 'hsl(0, 0%, 15%)';
      case 'STOPPED':
        return 'hsl(0, 0%, 100%)';
      default:
        return 'hsl(0, 0%, 15%)';
    }
  }
};
