import { SegmentType } from '@prisma/client';
import { Clipboard, Leaf, Music, TrainTrack } from 'lucide-react';

export const SegmentIcon: React.FC<{
  type: SegmentType;
}> = ({ type }) => {
  switch (type) {
    case 'TRIP':
      return <TrainTrack />;
    case 'QUESTION':
      return <Clipboard />;
    case 'MUSIC':
      return <Music />;
    case 'SPECIAL':
      return <Leaf />;
  }
};
