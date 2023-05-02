import Ably from 'ably';
import { useEffect } from 'react';

export function useAblyChannel(
  area: 'client' | 'admin',
  competitionId: string,
  callback: () => void
) {
  useEffect(() => {
    const ably = new Ably.Realtime.Promise(
      process.env.NEXT_PUBLIC_ABLY_SUBSCRIBE_API_KEY
    );

    const asyncEffect = async () => {
      try {
        const clientChannel = await ably.channels.get(
          `${area}-${competitionId}`
        );

        await clientChannel.subscribe(() => {
          callback();
        });
      } catch (error) {
        console.log(error);
      }
    };

    asyncEffect();

    return () => ably.close();
  }, [competitionId, callback, area]);
}
