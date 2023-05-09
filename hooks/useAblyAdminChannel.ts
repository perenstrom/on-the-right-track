import Ably from 'ably';
import { useAblyChannel } from './useAblyChannel';

export function useAblyAdminChannel(
  competitionId: string,
  callback: (message: Ably.Types.Message) => void
) {
  return useAblyChannel('admin', competitionId, callback);
}
