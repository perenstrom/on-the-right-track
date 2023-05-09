import Ably from 'ably';
import { useAblyChannel } from './useAblyChannel';

export function useAblyClientChannel(
  competitionId: string,
  callback: (message: Ably.Types.Message) => void
) {
  return useAblyChannel('client', competitionId, callback);
}
