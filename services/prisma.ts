import { SegmentTeamState, Team, Prisma } from '@prisma/client';
import { generateRandomId } from 'helpers/utils';
import { Context } from 'lib/prisma';
import {
  Competition,
  CompetitionWithSegmentCount,
  FullCompetition,
  ScoreCompetition,
  UncreatedCompetition,
  UncreatedSegment,
  UncreatedTeam
} from 'types/types';
import { Optional, WithRequired } from 'types/utils';

export const getCompetitions = async (ctx: Context): Promise<Competition[]> => {
  const result = await ctx.prisma.competition.findMany({
    include: {
      winnerTeam: true
    },
    orderBy: [
      {
        date: 'desc'
      }
    ]
  });

  return result.map((competition) => ({
    ...competition,
    date: competition.date.toISOString()
  }));
};

export const getCompetition = async (
  ctx: Context,
  id: string
): Promise<FullCompetition> => {
  const result = await ctx.prisma.competition.findUnique({
    where: {
      id
    },
    include: {
      segments: {
        orderBy: {
          order: 'asc'
        }
      },
      teams: {
        orderBy: {
          id: 'asc'
        },
        include: {
          segmentTeamStates: {
            include: {
              answers: {
                orderBy: {
                  questionNumber: 'asc'
                }
              }
            }
          }
        }
      }
    }
  });

  if (!result) {
    throw new Error('Competition not found');
  }

  return {
    ...result,
    date: result.date.toISOString()
  };
};

export const getScoreCompetition = async (
  ctx: Context,
  id: string
): Promise<ScoreCompetition> => {
  const result = await ctx.prisma.competition.findUnique({
    where: {
      id
    },
    include: {
      segments: {
        orderBy: {
          order: 'asc'
        }
      },
      teams: {
        orderBy: {
          id: 'asc'
        },
        include: {
          segmentTeamStates: true
        }
      }
    }
  });

  if (!result) {
    throw new Error('Competition not found');
  }

  return {
    ...result,
    date: result.date.toISOString()
  };
};

export const getBaseCompetition = async (
  ctx: Context,
  id: string
): Promise<CompetitionWithSegmentCount> => {
  const result = await ctx.prisma.competition.findUnique({
    where: {
      id
    },
    include: {
      segments: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  if (!result) {
    throw new Error('Competition not found');
  }

  const segmentCount = result.segments.length;
  const modifiedResult: Optional<typeof result, 'segments'> = { ...result };
  delete modifiedResult.segments;

  return {
    ...modifiedResult,
    segmentCount,
    date: result.date.toISOString()
  };
};

export const setCurrentStage = async (
  ctx: Context,
  competitionId: string,
  stage: number | null
) => {
  const result = await ctx.prisma.competition.update({
    where: {
      id: competitionId
    },
    data: {
      currentStage: stage,
      currentLevel: null
    }
  });

  return result;
};

export const setCurrentLevel = async (
  ctx: Context,
  competitionId: string,
  level: number | null
) => {
  const result = await ctx.prisma.competition.update({
    where: {
      id: competitionId
    },
    data: {
      currentLevel: level
    }
  });

  return result;
};

export const createCompetition = async (
  ctx: Context,
  competition: UncreatedCompetition,
  segments: UncreatedSegment[]
) => {
  const id = generateRandomId();

  const result = await ctx.prisma.competition.create({
    data: {
      id,
      ...competition,
      date: new Date(competition.date),
      segments: {
        create: segments
      }
    }
  });

  return result;
};

export const setCompetitionWinner = async (
  ctx: Context,
  competitionId: string,
  winnerTeamId: string | null
) => {
  const result = await ctx.prisma.competition.update({
    where: {
      id: competitionId
    },
    data: {
      winnerTeamId: winnerTeamId
    }
  });

  return result;
};

export const setScorePublished = async (
  ctx: Context,
  segmentId: string,
  scorePublished: boolean
) => {
  const result = await ctx.prisma.segment.update({
    where: {
      id: segmentId
    },
    data: {
      scorePublished
    }
  });

  return result;
};

export const createTeam = async (ctx: Context, team: UncreatedTeam) => {
  const result = await ctx.prisma.team.create({
    data: team
  });

  return result;
};

export const getTeam = async (ctx: Context, id: string) => {
  const result = await ctx.prisma.team.findUnique({
    where: {
      id
    }
  });

  if (!result) {
    throw new Error('Team not found');
  }

  return result;
};

export const updateTeam = async (
  ctx: Context,
  teamId: string,
  team: Partial<Team>
) => {
  const result = await ctx.prisma.team.update({
    where: {
      id: teamId
    },
    data: team
  });

  return result;
};

export const deleteTeam = async (ctx: Context, teamId: string) => {
  const result = await ctx.prisma.team.delete({
    where: {
      id: teamId
    }
  });

  return result;
};

export const getSegment = async (
  ctx: Context,
  competitionId: string,
  stage: number
) => {
  const result = await ctx.prisma.segment.findUnique({
    where: {
      competitionId_order: {
        competitionId,
        order: stage
      }
    }
  });

  if (!result) {
    throw new Error('Segment not found');
  }

  return result;
};

type SegmentTeamStateId = { id: string };
type SegmentTeamStateSegmentPlusTeamId = { segmentId: string; teamId: string };
interface SegmentTeamStateIdInput {
  selector: SegmentTeamStateId;
  data: WithRequired<Partial<SegmentTeamState>, 'segmentId' | 'teamId'>;
}
interface SegmentTeamStateSegmentPlusTeamIdInput {
  selector: SegmentTeamStateSegmentPlusTeamId;
  data: Partial<SegmentTeamState>;
}
type SegmentTeamStateInput =
  | SegmentTeamStateIdInput
  | SegmentTeamStateSegmentPlusTeamIdInput;

const isSegmentTeamStateIdInput = (
  test: SegmentTeamStateInput
): test is SegmentTeamStateIdInput => 'id' in test.selector;

export const upsertSegmentTeamState = async (
  ctx: Context,
  input: SegmentTeamStateInput
) => {
  const where: Prisma.SegmentTeamStateWhereUniqueInput =
    isSegmentTeamStateIdInput(input)
      ? { id: input.selector.id }
      : { segmentId_teamId: input.selector };

  const create: Prisma.SegmentTeamStateUncheckedCreateInput =
    isSegmentTeamStateIdInput(input)
      ? {
          id: input.selector.id,
          ...input.data
        }
      : {
          segmentId: input.selector.segmentId,
          teamId: input.selector.teamId,
          ...input.data
        };

  const result = await ctx.prisma.segmentTeamState.upsert({
    where: where,
    update: input.data,
    create: create
  });

  return result;
};

export const updateSegmentTeamState = async (
  ctx: Context,
  id: string,
  input: Prisma.SegmentTeamStateUncheckedUpdateInput
) => {
  const result = await ctx.prisma.segmentTeamState.update({
    where: { id },
    data: input
  });

  return result;
};

export const upsertAnswer = async (
  ctx: Context,
  selector: {
    stateId: string;
    questionNumber: number;
  }
) => {
  const result = await ctx.prisma.answer.upsert({
    where: {
      stateId_questionNumber: selector
    },
    update: {},
    create: { answer: '', ...selector }
  });

  return result;
};

export const updateAnswer = async (
  ctx: Context,
  id: string,
  input: Prisma.AnswerUncheckedUpdateInput
) => {
  const result = await ctx.prisma.answer.update({
    where: { id },
    data: input
  });

  return result;
};
