import Ably from 'ably';
import { useEffect, useState } from 'react';

export function useAblyChannel(
  area: 'client' | 'admin',
  competitionId: string,
  callback: (message: Ably.Message) => void
) {
  const [connectionState, setConnectionState] =
    useState<Ably.ConnectionState>('initialized');

  useEffect(() => {
    const ably = new Ably.Realtime(
      process.env.NEXT_PUBLIC_ABLY_SUBSCRIBE_API_KEY
    );

    ably.connection.on((stateChange) => {
      setConnectionState(stateChange.current);
    });

    const asyncEffect = async () => {
      try {
        const clientChannel = await ably.channels.get(
          `${area}-${competitionId}`
        );

        await clientChannel.subscribe((message) => {
          callback(message);
        });
      } catch (error) {
        console.log(error);
      }
    };

    asyncEffect();

    return () => {
      ably.connection.off();
      ably.close();
    };
  }, [competitionId, callback, area]);

  return { connectionState };
}
