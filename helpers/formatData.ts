import { FullCompetition } from 'types/types';

export const formatCompetitionEndTable = (competition: FullCompetition) => {
  const { segments, teams } = competition;

  const table = teams
    .map((team) => {
      const segmentResults = segments.map((segment) => {
        const teamSegment = team.segmentTeamStates.find(
          (segmentTeam) => segmentTeam.segmentId === segment.id
        );

        return { score: teamSegment?.score || 0, segmentId: segment.id };
      });

      const totalScore = segmentResults.reduce(
        (acc, segmentResult) => acc + segmentResult.score,
        0
      );

      return {
        team,
        segmentResults,
        totalScore
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  return table;
};
