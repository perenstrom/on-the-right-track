import { SegmentTeamState, Team } from '@prisma/client';
import {
  UncreatedCompetition,
  UncreatedSegment,
  UncreatedTeam
} from 'types/types';

export const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8'
};

export const createCompetition = async (competitionData: {
  competition: UncreatedCompetition;
  segments: UncreatedSegment[];
}) => {
  const url = '/api/competitions';
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({
      competition: competitionData.competition,
      segments: competitionData.segments
    })
  };

  const result = await fetch(url, options).then((r) => r.json());

  return result;
};

export const createTeam = async (team: UncreatedTeam) => {
  const url = '/api/teams';
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(team)
  };

  const result = await fetch(url, options).then((r) => r.json());

  return result;
};

export const updateTeam = async (teamId: string, team: Partial<Team>) => {
  const url = `/api/teams/${teamId}`;
  const options: RequestInit = {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify(team)
  };

  const result = await fetch(url, options).then((r) => r.json());

  return result;
};

export const setCurrentStage = async (
  competitionId: string,
  stage: number | null
) => {
  const url = `/api/competitions/${competitionId}/actions/set-stage`;
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ stage })
  };

  const result = await fetch(url, options).then((r) => r.json());

  return result;
};

export const setCurrentLevel = async (
  competitionId: string,
  level: number | null
) => {
  const url = `/api/competitions/${competitionId}/actions/set-level`;
  const options: RequestInit = {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ level })
  };

  const result = await fetch(url, options).then((r) => r.json());

  return result;
};

export const patchTeamSegmentState = async (
  segmentTeamStateId: string,
  segmentTeamState: Partial<SegmentTeamState>
) => {
  const url = `/api/segment_team_states/${segmentTeamStateId}`;
  const options: RequestInit = {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify(segmentTeamState)
  };

  const result = await fetch(url, options).then((r) => r.json());

  return result;
};

export const patchAnswer = async (answerId: string, answer: string) => {
  const url = `/api/answers
  /${answerId}`;
  const options: RequestInit = {
    method: 'PATCH',
    headers: defaultHeaders,
    body: JSON.stringify({ answer })
  };

  const result = await fetch(url, options).then((r) => r.json());

  return result;
};
