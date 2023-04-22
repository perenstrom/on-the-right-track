import { TeamState } from '@prisma/client';

export const getTeamStateColor = (state: TeamState) => {
  switch (state) {
    case 'IDLE':
      return 'hsl(0, 0%, 85%)';
    case 'STOPPED':
      return 'hsl(18, 95%, 40%)';
    case 'STOPPED_ANSWERED':
      return 'hsl(11, 74%, 77%)';
    case 'ANSWERED':
      return 'hsl(216, 100%, 74%)';
    default:
      return 'hsl(0, 0%, 85%)';
  }
};

export const getTeamStateTextColor = (state: TeamState) => {
  switch (state) {
    case 'IDLE':
    case 'ANSWERED':
    case 'STOPPED_ANSWERED':
      return 'hsl(0, 0%, 15%)';
    case 'STOPPED':
      return 'hsl(0, 0%, 100%)';
    default:
      return 'hsl(0, 0%, 15%)';
  }
};
