import Ably from 'ably';
import { useAblyChannel } from './useAblyChannel';

export function useAblyAdminChannel(
  competitionId: string,
  callback: (message: Ably.Message) => void
) {
  return useAblyChannel('admin', competitionId, callback);
}
