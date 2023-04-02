import { UncreatedCompetition, UncreatedSegment } from 'types/types';

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
