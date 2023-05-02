import { useAblyChannel } from './useAblyChannel';

export function useAblyClientChannel(
  competitionId: string,
  callback: () => void
) {
  useAblyChannel('client', competitionId, callback);
}
