import { ablyEvents, makePublishMessage } from './ably';

const publishMessage = makePublishMessage('client');

export const publishNewLevel = async (
  competitionId: string,
  level: number | null
) => {
  publishMessage(ablyEvents.newLevel, competitionId, { level });
};

export const publishNewStage = async (
  competitionId: string,
  stage: number | null
) => {
  publishMessage(ablyEvents.newStage, competitionId, { stage });
};

export const publishNewScoresPublished = async (
  competitionId: string,
  published: boolean
) => {
  publishMessage(ablyEvents.newScoresPublished, competitionId, { published });
};
