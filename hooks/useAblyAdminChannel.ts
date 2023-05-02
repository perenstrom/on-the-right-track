import { useAblyChannel } from './useAblyChannel';

export function useAblyAdminChannel(
  competitionId: string,
  callback: () => void
) {
  useAblyChannel('admin', competitionId, callback);
}
