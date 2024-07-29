import Ably from 'ably';
import { useAblyChannel } from './useAblyChannel';

export function useAblyClientChannel(
  competitionId: string,
  callback: (message: Ably.Message) => void
) {
  return useAblyChannel('client', competitionId, callback);
}
